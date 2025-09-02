import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Utility to strip HTML tags for safe text preview
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '');
}

const Trending = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeFilter, setTimeFilter] = useState('week'); // week, month, year

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5000/api/posts');
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch posts');

      // Sort posts by trending score (likes + views + recency)
      const sortedPosts = data.sort((a, b) => {
        const aScore = calculateTrendingScore(a);
        const bScore = calculateTrendingScore(b);
        return bScore - aScore;
      });

      setPosts(sortedPosts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTrendingScore = (post) => {
    const likes = post.likes?.length || 0;
    const views = post.views || 0;
    const createdAt = new Date(post.createdAt);
    const now = new Date();
    const daysSinceCreation = (now - createdAt) / (1000 * 60 * 60 * 24);
    return (likes * 2 + views) / Math.pow(daysSinceCreation + 1, 1.5);
  };

  const getTrendingPosts = () => posts.slice(0, 20);

  const getTrendingTopics = () => {
    const topicCounts = {};
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => {
          topicCounts[tag] = (topicCounts[tag] || 0) + 1;
        });
      }
    });
    return Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
  };

  const getTrendingAuthors = () => {
    const authorStats = {};
    posts.forEach(post => {
      const authorId = post.author?._id;
      if (!authorId) return;
      if (!authorStats[authorId]) {
        authorStats[authorId] = {
          author: post.author,
          posts: 0,
          totalLikes: 0,
          totalViews: 0
        };
      }
      authorStats[authorId].posts += 1;
      authorStats[authorId].totalLikes += post.likes?.length || 0;
      authorStats[authorId].totalViews += post.views || 0;
    });
    return Object.values(authorStats)
      .sort((a, b) => (b.totalLikes + b.totalViews) - (a.totalLikes + a.totalViews))
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-navy mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trending content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-navy via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Trending Now
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Discover the most popular articles, topics, and authors that are making waves in our community
          </p>
          {/* Time Filter */}
          <div className="flex justify-center space-x-2">
            {[
              { id: 'week', label: 'This Week' },
              { id: 'month', label: 'This Month' },
              { id: 'year', label: 'This Year' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setTimeFilter(filter.id)}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                  timeFilter === filter.id
                    ? 'bg-primary-gold text-primary-navy shadow-lg'
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
            {error}
          </div>
        </div>
      )}

      {/* Trending Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-navy mb-2">
                {posts.length}
              </div>
              <div className="text-gray-600">Total Articles</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-navy mb-2">
                {posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0).toLocaleString()}
              </div>
              <div className="text-gray-600">Total Likes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-navy mb-2">
                {posts.reduce((sum, post) => sum + (post.views || 0), 0).toLocaleString()}
              </div>
              <div className="text-gray-600">Total Views</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Trending Posts */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Trending Articles</h2>
              <p className="text-gray-600">The most popular content this {timeFilter}</p>
            </div>
            <div className="space-y-8">
              {getTrendingPosts().map((post, index) => (
                <article key={post._id} className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="flex">
                    {/* Post Thumbnail */}
                    <div className="w-48 h-32 flex-shrink-0">
                      <img 
                        src={post.thumbnail || post.cover || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      {/* Trending Rank */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index < 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gray-400'
                          }`}>
                            #{index + 1}
                          </div>
                          <span className="text-sm text-gray-500">Trending</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {post.likes?.length || 0}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path fillRule="evenodd" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" clipRule="evenodd" />
                            </svg>
                            {post.views || 0}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-navy transition-colors">
                        <Link to={`/post/${post._id}`}>{post.title}</Link>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {stripHtml(post.snippet || post.content)?.substring(0, 150) + (stripHtml(post.snippet || post.content).length > 150 ? '...' : '')}
                      </p>
                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={post.author?.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(post.author?.name || "User")} 
                            alt={post.author?.name}
                            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{post.author?.name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {Math.ceil(stripHtml(post.content || '').length / 200)} min read
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const postUrl = `${window.location.origin}/post/${post._id}`;
                            const postTitle = post.title;
                            const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`;
                            window.open(shareUrl, '_blank', 'width=600,height=400');
                          }}
                          className="flex items-center text-gray-400 hover:text-green-500 transition-colors"
                          title="Share on Twitter"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Trending Topics */}
            <section className="py-12 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Trending Topics</h2>
                <div className="flex flex-wrap gap-3">
                  {getTrendingTopics().map((topic, index) => (
                    <Link
                      key={topic.tag}
                      to={`/tag/${encodeURIComponent(topic.tag)}`}
                      className="px-6 py-3 bg-white text-gray-700 rounded-full hover:bg-primary-navy hover:text-white transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
                    >
                      #{topic.tag} <span className="ml-2 text-xs text-gray-500">({topic.count})</span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* Trending Authors */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Top Authors</h3>
              <div className="space-y-4">
                {getTrendingAuthors().map((author, index) => (
                  <div key={author.author._id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index < 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gray-400'
                    }`}>
                      #{index + 1}
                    </div>
                    <img 
                      src={author.author.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(author.author.name)} 
                      alt={author.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{author.author.name}</p>
                      <p className="text-sm text-gray-500">{author.posts} posts</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {(author.totalLikes + author.totalViews).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">engagement</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-primary-navy to-blue-700 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
              <p className="text-blue-100 mb-6">
                Get notified about trending articles and topics
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-gold"
                />
                <button className="w-full bg-primary-gold text-primary-navy py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trending;
