import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [recentActivity, setRecentActivity] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [postStatusFilter, setPostStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }

    const userObj = JSON.parse(userData);
    if (userObj.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    setUser(userObj);
    fetchAdminData();
    // Fetch reported posts
    if (user && user.role === 'admin') {
      fetchReportedPosts();
    }
  }, [navigate]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch stats
      const statsResponse = await fetch('http://localhost:5000/api/users/admin/analytics/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch all users
      const usersResponse = await fetch('http://localhost:5000/api/users/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const usersData = await usersResponse.json();
      setUsers(usersData);

      // Fetch all posts
      const postsResponse = await fetch('http://localhost:5000/api/posts/admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const postsData = await postsResponse.json();
      setPosts(Array.isArray(postsData) ? postsData : (postsData.posts || []));

      // Fetch recent activity (last 5 events)
      const activityResponse = await fetch('http://localhost:5000/api/users/admin/analytics/activity', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const activityData = await activityResponse.json();
      setRecentActivity(activityData.activities || []);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setLoading(false);
    }
  };

  const fetchReportedPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/posts/admin/reported', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setReportedPosts(data);
    } catch (err) {
      setReportedPosts([]);
    }
  };

  const handleModeratePost = async (postId, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/posts/${postId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      fetchReportedPosts();
    } catch {}
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete user');
        return;
      }

      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleToggleFeatured = async (postId, currentFeatured) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ featured: !currentFeatured })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle featured status');
      }

      setPosts(posts.map(post => 
        post._id === postId ? { ...post, featured: !currentFeatured } : post
      ));
    } catch (err) {
      console.error('Error toggling featured status:', err);
    }
  };

  // Example data for charts (replace with real data from backend if available)
  const growthData = {
    labels: stats.growthLabels || ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Users',
        data: stats.userGrowth || [10, 20, 30, 40, 50],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Posts',
        data: stats.postGrowth || [5, 15, 25, 35, 45],
        borderColor: 'rgba(168, 85, 247, 1)',
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
        tension: 0.4,
      },
    ],
  };
  const pieData = {
    labels: stats.categoryLabels || ['Tech', 'Design', 'News'],
    datasets: [
      {
        label: 'Posts by Category',
        data: stats.categoryCounts || [20, 10, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(168, 85, 247, 0.7)',
          'rgba(251, 191, 36, 0.7)',
        ],
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-navy"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">Admin Dashboard</h1>
            <p className="text-lg text-gray-500">Manage your blog platform</p>
          </div>
          <div className="flex space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-navy text-white text-xs font-semibold">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              {user?.name || 'Admin'}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              {user?.email}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center">
            <div className="p-4 bg-blue-100 rounded-xl">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center">
            <div className="p-4 bg-green-100 rounded-xl">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Total Posts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPosts || 0}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center">
            <div className="p-4 bg-purple-100 rounded-xl">
              <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Total Comments</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalComments || 0}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center">
            <div className="p-4 bg-yellow-100 rounded-xl">
              <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalViews || 0}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-primary-navy text-primary-navy'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-primary-navy text-primary-navy'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'posts'
                    ? 'border-primary-navy text-primary-navy'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Posts ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab('reported')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reported'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reported Posts ({reportedPosts.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Platform Overview</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    {recentActivity.length > 0 ? recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${activity.type === 'user' ? 'bg-blue-400' : activity.type === 'post' ? 'bg-green-400' : 'bg-purple-400'}`}></div>
                        <span className="text-sm text-gray-600">{activity.message}</span>
                      </div>
                    )) : (
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">No recent activity</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    <button onClick={() => setActiveTab('users')} className="w-full text-left px-4 py-2 bg-primary-navy text-white rounded-lg hover:bg-opacity-90 transition-all text-sm">
                      View All Users
                    </button>
                    <button onClick={() => setActiveTab('posts')} className="w-full text-left px-4 py-2 bg-primary-navy text-white rounded-lg hover:bg-opacity-90 transition-all text-sm">
                      View All Posts
                    </button>
                    <button onClick={() => alert('Report generation coming soon!')} className="w-full text-left px-4 py-2 bg-primary-navy text-white rounded-lg hover:bg-opacity-90 transition-all text-sm">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="h-10 w-10 rounded-full" src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"} alt="" />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Post Management</h3>
              <div className="mb-4 flex items-center space-x-2">
                <label className="font-medium">Filter by status:</label>
                <select value={postStatusFilter} onChange={e => setPostStatusFilter(e.target.value)} className="p-2 rounded border">
                  <option value="all">All</option>
                  <option value="published">Published</option>
                  <option value="hidden">Hidden</option>
                  <option value="rejected">Rejected</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="space-y-4">
                {Array.isArray(posts) && posts.filter(post => postStatusFilter === 'all' || post.status === postStatusFilter).map((post) => (
                  <div key={post._id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">By {post.author.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          <span>{post.likes?.length || 0} likes</span>
                          <span>{post.views || 0} views</span>
                          {post.featured && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                              Featured
                            </span>
                          )}
                          {post.status && post.status !== 'published' && (
                            <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${post.status === 'hidden' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{post.status}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleToggleFeatured(post._id, post.featured)}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            post.featured
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {post.featured ? 'Unfeature' : 'Feature'}
                        </button>
                        {['hidden', 'rejected'].includes(post.status) && (
                          <button onClick={() => handleModeratePost(post._id, 'published')} className="ml-2 px-3 py-1 rounded bg-green-600 text-white text-xs font-semibold hover:bg-green-700">Restore</button>
                        )}
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reported' && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-2xl font-bold mb-4 text-red-700">Reported Posts</h2>
              {reportedPosts.length === 0 ? (
                <div className="text-gray-500">No reported posts.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Post</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Reports</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportedPosts.map(({ post, reports }) => (
                        <tr key={post?._id} className="border-b">
                          <td className="px-4 py-2">
                            <div className="font-semibold text-primary-navy">{post?.title}</div>
                            <div className="text-xs text-gray-500">by {post?.author?.name}</div>
                            <div className="text-xs text-gray-400">{new Date(post?.createdAt).toLocaleString()}</div>
                          </td>
                          <td className="px-4 py-2">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${post?.status === 'published' ? 'bg-green-100 text-green-700' : post?.status === 'hidden' ? 'bg-yellow-100 text-yellow-700' : post?.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'}`}>{post?.status}</span>
                          </td>
                          <td className="px-4 py-2">
                            <ul className="space-y-1">
                              {reports.map(r => (
                                <li key={r._id} className="text-xs text-gray-700">
                                  <span className="font-semibold">{r.reason}</span> by {r.reporter?.name} <span className="text-gray-400">({new Date(r.createdAt).toLocaleString()})</span>
                                  {r.comment && <div className="text-gray-500 ml-2">"{r.comment}"</div>}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="px-4 py-2 space-x-2">
                            <button onClick={() => handleModeratePost(post._id, 'published')} className="px-3 py-1 rounded bg-green-600 text-white text-xs font-semibold hover:bg-green-700">Approve</button>
                            <button onClick={() => handleModeratePost(post._id, 'hidden')} className="px-3 py-1 rounded bg-yellow-500 text-white text-xs font-semibold hover:bg-yellow-600">Hide</button>
                            <button onClick={() => handleModeratePost(post._id, 'rejected')} className="px-3 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700">Reject</button>
                            <button onClick={() => handleDeletePost(post._id)} className="px-3 py-1 rounded bg-gray-800 text-white text-xs font-semibold hover:bg-black">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Growth Chart */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Growth Over Time</h2>
          <Line data={growthData} />
        </div>
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Posts by Category</h2>
          <Pie data={pieData} />
        </div>
        {/* Top Posts Table */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Posts</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claps</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.slice(0, 10).map(post => (
                  <tr key={post._id}>
                    <td className="px-4 py-2 font-medium text-primary-navy"><Link to={`/post/${post._id}`}>{post.title}</Link></td>
                    <td className="px-4 py-2">{post.views || 0}</td>
                    <td className="px-4 py-2">{post.likes?.reduce ? post.likes.reduce((sum, l) => sum + (l.count || 1), 0) : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Top Authors Table */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Authors</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claps</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.slice(0, 10).map(author => (
                  <tr key={author._id}>
                    <td className="px-4 py-2 font-medium text-primary-navy">{author.name}</td>
                    <td className="px-4 py-2">{posts.filter(p => p.author._id === author._id).length}</td>
                    <td className="px-4 py-2">{posts.filter(p => p.author._id === author._id).reduce((sum, p) => sum + (p.likes?.reduce ? p.likes.reduce((s, l) => s + (l.count || 1), 0) : 0), 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 