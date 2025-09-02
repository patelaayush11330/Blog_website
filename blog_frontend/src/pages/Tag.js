import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const Tag = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('recent'); // recent, popular

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, [tag, sort]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/posts?tag=${encodeURIComponent(tag)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch posts');
      let sorted = data;
      if (sort === 'popular') {
        sorted = [...data].sort((a, b) => ((b.likes?.length || 0) + (b.views || 0)) - ((a.likes?.length || 0) + (a.views || 0)));
      } else {
        sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      setPosts(sorted);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-navy"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary-navy">Posts tagged #{tag}</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setSort('recent')}
              className={`px-4 py-2 rounded-lg font-medium ${sort === 'recent' ? 'bg-primary-navy text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            >
              Most Recent
            </button>
            <button
              onClick={() => setSort('popular')}
              className={`px-4 py-2 rounded-lg font-medium ${sort === 'popular' ? 'bg-primary-navy text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            >
              Most Popular
            </button>
          </div>
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">{error}</div>}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts found for this tag</h3>
            <p className="text-gray-600 mb-6">Try another tag or check back later.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <article key={post._id} className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {post.thumbnail && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.thumbnail} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-primary-navy transition-colors">
                    <Link to={`/post/${post._id}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                    {post.content.substring(0, 120)}...
                  </p>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={post.author.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{post.author.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {Math.ceil(post.content.length / 200)} min read
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tag; 