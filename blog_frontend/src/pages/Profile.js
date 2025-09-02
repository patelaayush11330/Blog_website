import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
    cover: '',
    twitter: '',
    linkedin: '',
    github: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const { id } = useParams();
  const [publicProfile, setPublicProfile] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }

    const userObj = JSON.parse(userData);
    if (id && id !== userObj._id) {
      setIsOwnProfile(false);
      fetch(`http://localhost:5000/api/users/${id}/public`)
        .then(res => res.json())
        .then(data => {
          setPublicProfile(data);
          setIsFollowing(data.followers.some(f => f._id === userObj._id));
        });
    } else {
      setIsOwnProfile(true);
      setUser(userObj);
      setFormData({
        name: userObj.name || '',
        email: userObj.email || '',
        bio: userObj.bio || '',
        avatar: userObj.avatar || '',
        cover: userObj.cover || '',
        twitter: userObj.twitter || '',
        linkedin: userObj.linkedin || '',
        github: userObj.github || ''
      });
    }
    setLoading(false);
  }, [navigate, id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, cover: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    console.log('Uploading file:', file);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:5000/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }

      return data.url;
    } catch (error) {
      throw new Error('Failed to upload image: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      let avatarUrl = formData.avatar;

      // Upload image if selected
      if (selectedFile) {
        avatarUrl = await uploadImage(selectedFile);
      }

      // Upload cover if changed and is a file
      let coverUrl = formData.cover;
      if (formData.cover && formData.cover.startsWith('data:')) {
        // Simulate upload, in real app upload to server
        coverUrl = formData.cover;
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          avatar: avatarUrl,
          cover: coverUrl
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update localStorage with new user data
      const updatedUser = { ...user, ...formData, avatar: avatarUrl, cover: coverUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      setSaving(false);
      setSelectedFile(null);
      setImagePreview('');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleFollow = async () => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/users/${id}/follow`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    // Refetch profile
    const res = await fetch(`http://localhost:5000/api/users/${id}/public`);
    const data = await res.json();
    setPublicProfile(data);
    setIsFollowing(data.followers.some(f => f._id === JSON.parse(localStorage.getItem('user'))._id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-navy"></div>
      </div>
    );
  }

  if (!isOwnProfile && publicProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        {/* Cover Image */}
        {publicProfile.cover && (
          <div className="w-full h-48 rounded-2xl overflow-hidden mb-8">
            <img src={publicProfile.cover} alt="Cover" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{publicProfile.name}</h1>
            <p className="text-gray-600">@{publicProfile.email}</p>
            {/* Social Links */}
            <div className="flex space-x-4 mt-2">
              {publicProfile.twitter && <a href={publicProfile.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Twitter</a>}
              {publicProfile.linkedin && <a href={publicProfile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">LinkedIn</a>}
              {publicProfile.github && <a href={publicProfile.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">GitHub</a>}
            </div>
            {/* Membership Status */}
            {(publicProfile.membership?.status === 'active') ? (
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold text-xs ml-2">Active Member</span>
            ) : (
              <Link to="/subscribe" className="inline-block px-3 py-1 bg-primary-gold text-primary-navy rounded-full font-semibold text-xs ml-2">Subscribe</Link>
            )}
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-soft p-6 text-center">
                <img src={publicProfile.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face'} alt={publicProfile.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                <h2 className="text-xl font-bold text-gray-900 mb-1">{publicProfile.name}</h2>
                <p className="text-gray-500 mb-4">{publicProfile.email}</p>
                {publicProfile.bio && <p className="text-gray-600 text-sm mb-4">{publicProfile.bio}</p>}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
                  <span>Member since</span>
                  <span>{new Date(publicProfile.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <button onClick={() => setShowFollowers(true)} className="text-blue-700 font-semibold hover:underline">{publicProfile.followers.length} Followers</button>
                  <button onClick={() => setShowFollowing(true)} className="text-blue-700 font-semibold hover:underline">{publicProfile.following.length} Following</button>
                </div>
                {/* Followers Modal */}
                {showFollowers && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                      <h3 className="text-xl font-bold mb-4">Followers</h3>
                      <button onClick={() => setShowFollowers(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">&times;</button>
                      <div className="space-y-4">
                        {publicProfile.followers.map(f => (
                          <Link key={f._id} to={`/profile/${f._id}`} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg">
                            <img src={f.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'} alt={f.name} className="w-10 h-10 rounded-full" />
                            <span className="font-medium text-gray-900">{f.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {/* Following Modal */}
                {showFollowing && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                      <h3 className="text-xl font-bold mb-4">Following</h3>
                      <button onClick={() => setShowFollowing(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">&times;</button>
                      <div className="space-y-4">
                        {publicProfile.following.map(f => (
                          <Link key={f._id} to={`/profile/${f._id}`} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg">
                            <img src={f.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'} alt={f.name} className="w-10 h-10 rounded-full" />
                            <span className="font-medium text-gray-900">{f.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleFollow}
                  className={`mt-6 px-6 py-2 rounded-xl font-semibold text-white ${isFollowing ? 'bg-gray-400' : 'bg-primary-navy'} hover:bg-opacity-90 transition-all`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            </div>
            {/* User's Posts */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Posts by {publicProfile.name}</h3>
                {publicProfile.posts.length === 0 ? (
                  <div className="text-gray-500">No posts yet.</div>
                ) : (
                  <div className="space-y-4">
                    {publicProfile.posts.map(post => (
                      <Link key={post._id} to={`/post/${post._id}`} className="block border border-gray-100 rounded-xl p-4 hover:bg-blue-50 transition-all">
                        <h4 className="font-semibold text-gray-900 mb-1">{post.title}</h4>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{post.content.substring(0, 120)}...</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          <span>{post.likes?.length || 0} likes</span>
                          <span>{post.views || 0} views</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isOwnProfile && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        {/* Cover Image */}
        {formData.cover && (
          <div className="w-full h-48 rounded-2xl overflow-hidden mb-8 relative">
            <img src={formData.cover} alt="Cover" className="w-full h-full object-cover" />
            <label className="absolute top-2 right-2 bg-white bg-opacity-80 px-3 py-1 rounded-lg cursor-pointer text-sm font-medium text-gray-700 shadow">
              Change Cover
              <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
            </label>
          </div>
        )}
        {!formData.cover && (
          <div className="w-full h-48 rounded-2xl bg-gray-200 flex items-center justify-center mb-8 relative">
            <label className="bg-white bg-opacity-80 px-3 py-1 rounded-lg cursor-pointer text-sm font-medium text-gray-700 shadow">
              Add Cover Image
              <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
            </label>
          </div>
        )}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <img 
                      src={imagePreview || user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face"} 
                      alt={user?.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    {editMode && (
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-primary-navy rounded-full flex items-center justify-center cursor-pointer">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.name}</h2>
                  <p className="text-gray-500 mb-4">{user?.email}</p>
                  {user?.bio && (
                    <p className="text-gray-600 text-sm mb-4">{user.bio}</p>
                  )}
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <span>Member since</span>
                    <span>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-soft p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Role</span>
                    <span className="font-medium text-gray-900 capitalize">{user?.role || 'user'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-4 py-2 bg-primary-navy text-white rounded-lg hover:bg-opacity-90 transition-all"
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm mb-6">
                  {success}
                </div>
              )}

              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-soft p-8">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editMode}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editMode}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!editMode}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Tell us about yourself..."
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.bio.length}/500 characters
                    </p>
                  </div>

                  {/* Profile Picture Upload */}
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture
                  </label>
                  <div className="space-y-4">
                  {/* File Upload */}
                    <div>
                        <label htmlFor="avatar-file" className="block text-sm font-medium text-gray-700 mb-2">
                          Upload from your device
                        </label>
                        <input
                        id="avatar-file"
                        name="avatar-file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={!editMode}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-navy file:text-white hover:file:bg-opacity-90"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Supported formats: JPG, PNG, GIF (Max 5MB)
                        </p>
                        </div>

                      {/* URL Input */}
                      <div>
                          <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
                            Or enter image URL
                          </label>
                          <input
                            id="avatar"
                            name="avatar"
                            type="url"
                            value={formData.avatar}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                            placeholder="https://example.com/avatar.jpg"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Enter a URL for your profile picture
                          </p>
                          </div>
                          </div>

                      {/* Preview */}
                      {imagePreview && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preview
                          </label>
                          <div className="flex items-center space-x-4">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFile(null);
                                setImagePreview('');
                              }}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                  {/* Social Links */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                        <input id="twitter" name="twitter" type="url" value={formData.twitter} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200" placeholder="https://twitter.com/yourhandle" />
                      </div>
                      <div>
                        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                        <input id="linkedin" name="linkedin" type="url" value={formData.linkedin} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200" placeholder="https://linkedin.com/in/yourprofile" />
                      </div>
                      <div>
                        <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                        <input id="github" name="github" type="url" value={formData.github} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200" placeholder="https://github.com/yourusername" />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  {editMode && (
                    <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-primary-navy text-white rounded-xl font-medium hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-navy disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {saving ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </div>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setFormData({
                            name: user?.name || '',
                            email: user?.email || '',
                            bio: user?.bio || '',
                            avatar: user?.avatar || '',
                            cover: user?.cover || '',
                            twitter: user?.twitter || '',
                            linkedin: user?.linkedin || '',
                            github: user?.github || ''
                          });
                        }}
                        className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              ) : (
                <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <span>Member since</span>
                    <span>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div className="flex space-x-4 mt-2">
                    {user.twitter && <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Twitter</a>}
                    {user.linkedin && <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">LinkedIn</a>}
                    {user.github && <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">GitHub</a>}
                  </div>
                </div>
              )}
              {/* Danger Zone */}
              <div className="bg-white rounded-2xl shadow-soft p-8 mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Danger Zone</h3>
                <div className="border border-red-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Sign Out</h4>
                      <p className="text-gray-600 text-sm">Sign out of your account on this device</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* My Bookmarks Section */}
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">My Bookmarks</h2>
          {/* Bookmarked posts will be fetched and displayed here */}
          {/* Implement fetch and display logic for bookmarked posts */}
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <img 
                    src={imagePreview || user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face"} 
                    alt={user?.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  {editMode && (
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-primary-navy rounded-full flex items-center justify-center cursor-pointer">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.name}</h2>
                <p className="text-gray-500 mb-4">{user?.email}</p>
                {user?.bio && (
                  <p className="text-gray-600 text-sm mb-4">{user.bio}</p>
                )}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <span>Member since</span>
                  <span>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-soft p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Role</span>
                  <span className="font-medium text-gray-900 capitalize">{user?.role || 'user'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-4 py-2 bg-primary-navy text-white rounded-lg hover:bg-opacity-90 transition-all"
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm mb-6">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!editMode}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                {/* Profile Picture Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div>
                      <label htmlFor="avatar-file" className="block text-sm font-medium text-gray-700 mb-2">
                        Upload from your device
                      </label>
                      <input
                        id="avatar-file"
                        name="avatar-file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={!editMode}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-navy file:text-white hover:file:bg-opacity-90"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Supported formats: JPG, PNG, GIF (Max 5MB)
                      </p>
                    </div>

                    {/* URL Input */}
                    <div>
                      <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
                        Or enter image URL
                      </label>
                      <input
                        id="avatar"
                        name="avatar"
                        type="url"
                        value={formData.avatar}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="https://example.com/avatar.jpg"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter a URL for your profile picture
                      </p>
                    </div>

                    {/* Preview */}
                    {imagePreview && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preview
                        </label>
                        <div className="flex items-center space-x-4">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setImagePreview('');
                            }}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                {editMode && (
                  <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-primary-navy text-white rounded-xl font-medium hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-navy disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {saving ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </div>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setFormData({
                          name: user?.name || '',
                          email: user?.email || '',
                          bio: user?.bio || '',
                          avatar: user?.avatar || '',
                          cover: user?.cover || '',
                          twitter: user?.twitter || '',
                          linkedin: user?.linkedin || '',
                          github: user?.github || ''
                        });
                      }}
                      className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl shadow-soft p-8 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Danger Zone</h3>
              <div className="border border-red-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Sign Out</h4>
                    <p className="text-gray-600 text-sm">Sign out of your account on this device</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 

// // // EDITED CODE
// // src/pages/Profile.js

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AvatarPicker from '../components/AvatarPicker';

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     bio: '',
//     avatar: '',
//     cover: '',
//     twitter: '',
//     linkedin: '',
//     github: ''
//   });
//   const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState('');
//   const [selectedCoverFile, setSelectedCoverFile] = useState(null);
//   const [coverPreview, setCoverPreview] = useState('');
//   const navigate = useNavigate();

//   // Fetch user from localStorage on mount
//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     const token = localStorage.getItem('token');
//     if (!userData || !token) {
//       navigate('/login');
//       return;
//     }
//     const userObj = JSON.parse(userData);
//     setUser(userObj);
//     setFormData({
//       name: userObj.name || '',
//       email: userObj.email || '',
//       bio: userObj.bio || '',
//       avatar: userObj.avatar || '',
//       cover: userObj.cover || '',
//       twitter: userObj.twitter || '',
//       linkedin: userObj.linkedin || '',
//       github: userObj.github || ''
//     });
//     setLoading(false);
//   }, [navigate]);

//   // Handle text/URL field changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle avatar file upload
//   const handleAvatarFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedAvatarFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setAvatarPreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle cover file upload
//   const handleCoverFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedCoverFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setCoverPreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   // Upload image to backend and return the URL
//   const uploadImage = async (file) => {
//     const token = localStorage.getItem('token');
//     const formDataObj = new FormData();
//     formDataObj.append('image', file);
//     const response = await fetch('http://localhost:5000/api/upload/image', {
//       method: 'POST',
//       headers: { Authorization: `Bearer ${token}` },
//       body: formDataObj,
//     });
//     const data = await response.json();
//     if (!response.ok) throw new Error(data.message || 'Failed to upload image');
//     return data.url;
//   };

//   // Save changes
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError('');
//     setSuccess('');
//     try {
//       let avatarUrl = formData.avatar;
//       let coverUrl = formData.cover;

//       // If a new avatar file is selected, upload it
//       if (selectedAvatarFile) {
//         avatarUrl = await uploadImage(selectedAvatarFile);
//       }
//       // If a new cover file is selected, upload it
//       if (selectedCoverFile) {
//         coverUrl = await uploadImage(selectedCoverFile);
//       }

//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:5000/api/users/profile', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           ...formData,
//           avatar: avatarUrl,
//           cover: coverUrl,
//         }),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || 'Failed to update profile');
//       const updatedUser = { ...user, ...formData, avatar: avatarUrl, cover: coverUrl };
//       localStorage.setItem('user', JSON.stringify(updatedUser));
//       setUser(updatedUser);
//       setSuccess('Profile updated successfully!');
//       setEditMode(false);
//       setSaving(false);
//       setSelectedAvatarFile(null);
//       setAvatarPreview('');
//       setSelectedCoverFile(null);
//       setCoverPreview('');
//     } catch (err) {
//       setError(err.message || 'Failed to update profile');
//       setSaving(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-navy"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
//       {/* Cover Image */}
//       <div className="w-full h-48 rounded-2xl overflow-hidden mb-8 relative">
//         <img
//           src={coverPreview || formData.cover || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"}
//           alt="Cover"
//           className="w-full h-full object-cover"
//         />
//         {editMode && (
//           <label className="absolute top-2 right-2 bg-white bg-opacity-80 px-3 py-1 rounded-lg cursor-pointer text-sm font-medium text-gray-700 shadow">
//             Change Cover
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleCoverFileChange}
//               className="hidden"
//             />
//           </label>
//         )}
//       </div>
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
//           <p className="text-gray-600">Manage your account information and preferences</p>
//         </div>
//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Profile Card */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-soft p-6">
//               <div className="text-center">
//                 <div className="relative inline-block">
//                   <img
//                     src={
//                       avatarPreview ||
//                       formData.avatar ||
//                       user?.avatar ||
//                       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face"
//                     }
//                     alt={formData.name}
//                     className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
//                   />
//                   {editMode && (
//                     <div className="absolute bottom-2 right-2">
//                       <label className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer text-xs">
//                         Upload
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={handleAvatarFileChange}
//                           className="hidden"
//                         />
//                       </label>
//                     </div>
//                   )}
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-900 mb-1">{formData.name}</h2>
//                 <p className="text-gray-500 mb-4">{formData.email}</p>
//                 {formData.bio && <p className="text-gray-600 text-sm mb-4">{formData.bio}</p>}
//                 <button
//                   onClick={handleLogout}
//                   className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all"
//                 >
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </div>
//           {/* Profile Form */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-2xl shadow-soft p-8">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
//                 <button
//                   onClick={() => setEditMode(!editMode)}
//                   className="px-4 py-2 bg-primary-navy text-white rounded-lg hover:bg-opacity-90 transition-all"
//                 >
//                   {editMode ? 'Cancel' : 'Edit Profile'}
//                 </button>
//               </div>
//               {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
//                   {error}
//                 </div>
//               )}
//               {success && (
//                 <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm mb-6">
//                   {success}
//                 </div>
//               )}
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Name */}
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                     Full Name
//                   </label>
//                   <input
//                     id="name"
//                     name="name"
//                     type="text"
//                     value={formData.name}
//                     onChange={handleChange}
//                     disabled={!editMode}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
//                     placeholder="Enter your full name"
//                   />
//                 </div>
//                 {/* Email */}
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                     Email
//                   </label>
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     disabled
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 cursor-not-allowed"
//                     placeholder="Enter your email"
//                   />
//                 </div>
//                 {/* Bio */}
//                 <div>
//                   <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
//                     Bio
//                   </label>
//                   <textarea
//                     id="bio"
//                     name="bio"
//                     value={formData.bio}
//                     onChange={handleChange}
//                     disabled={!editMode}
//                     rows={3}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
//                     placeholder="Tell us about yourself"
//                   />
//                 </div>
//                 {/* Avatar Picker */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Or choose an avatar
//                   </label>
//                   <AvatarPicker
//                     currentAvatar={formData.avatar}
//                     onChange={avatar => {
//                       if (!editMode) return;
//                       setFormData(prev => ({ ...prev, avatar }));
//                       setAvatarPreview('');
//                       setSelectedAvatarFile(null);
//                     }}
//                     disabled={!editMode}
//                   />
//                   <p className="text-xs text-gray-500 mt-1">
//                     Pick from our default avatars
//                   </p>
//                 </div>
//                 {/* Social Links */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-2">
//                       Twitter
//                     </label>
//                     <input
//                       id="twitter"
//                       name="twitter"
//                       type="url"
//                       value={formData.twitter}
//                       onChange={handleChange}
//                       disabled={!editMode}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
//                       placeholder="https://twitter.com/username"
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">
//                       LinkedIn
//                     </label>
//                     <input
//                       id="linkedin"
//                       name="linkedin"
//                       type="url"
//                       value={formData.linkedin}
//                       onChange={handleChange}
//                       disabled={!editMode}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
//                       placeholder="https://linkedin.com/in/username"
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-2">
//                       GitHub
//                     </label>
//                     <input
//                       id="github"
//                       name="github"
//                       type="url"
//                       value={formData.github}
//                       onChange={handleChange}
//                       disabled={!editMode}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-navy focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
//                       placeholder="https://github.com/username"
//                     />
//                   </div>
//                 </div>
//                 {/* Save Button */}
//                 {editMode && (
//                   <button
//                     type="submit"
//                     disabled={saving}
//                     className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
//                   >
//                     {saving ? 'Saving...' : 'Save Changes'}
//                   </button>
//                 )}
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
