import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = [
    {
      id: 'technology',
      name: 'Technology',
      icon: '💻',
      description: 'Latest tech trends, gadgets, and innovations',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'programming',
      name: 'Programming',
      icon: '⚡',
      description: 'Coding tutorials, best practices, and development tips',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'web-development',
      name: 'Web Development',
      icon: '🌐',
      description: 'Frontend, backend, and full-stack development',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'design',
      name: 'Design',
      icon: '🎨',
      description: 'UI/UX design, graphics, and creative inspiration',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'tutorial',
      name: 'Tutorials',
      icon: '📚',
      description: 'Step-by-step guides and learning resources',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'news',
      name: 'News',
      icon: '📢',
      description: 'Industry updates and breaking news',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'tips',
      name: 'Tips & Tricks',
      icon: '💡',
      description: 'Pro tips and productivity hacks',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      id: 'ai-ml',
      name: 'AI & Machine Learning',
      icon: '🤖',
      description: 'Artificial intelligence and machine learning insights',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'finance',
      name: 'Finance',
      icon: '💰',
      description: 'Personal finance, investing, and money management',
      color: 'from-yellow-600 to-green-500'
    },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/posts');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch posts');
      }

      setPosts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getPostsByCategory = (categoryId) => {
    return posts.filter(post => 
      post.tags && post.tags.some(tag => 
        tag.toLowerCase().includes(categoryId.toLowerCase())
      )
    );
  };

  const getCategoryStats = (categoryId) => {
    const categoryPosts = getPostsByCategory(categoryId);
    const totalViews = categoryPosts.reduce((sum, post) => sum + (post.views || 0), 0);
    const totalLikes = categoryPosts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
    
    return {
      postCount: categoryPosts.length,
      totalViews,
      totalLikes,
      featuredPost: categoryPosts[0] || null
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-navy mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
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
            Explore Categories
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Discover content organized by topics that interest you. From technology to design, 
            find exactly what you're looking for.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{categories.length}</div>
              <div className="text-blue-200">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{posts.length}</div>
              <div className="text-blue-200">Articles</div>
            </div>
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

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category) => {
              const stats = getCategoryStats(category.id);
              
              return (
                <div key={category.id} className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  {/* Category Header */}
                  <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{category.icon}</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{stats.postCount}</div>
                        <div className="text-sm opacity-90">posts</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90 leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  {/* Category Content */}
                  <div className="p-6">
                    {/* Stats */}
                    <div className="flex justify-between mb-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path fillRule="evenodd" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" clipRule="evenodd" />
                        </svg>
                        {stats.totalViews.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {stats.totalLikes.toLocaleString()}
                      </span>
                    </div>

                    {/* Featured Post */}
                    {stats.featuredPost && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Featured Post</h4>
                        <Link 
                          to={`/post/${stats.featuredPost._id}`}
                          className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <h5 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                            {stats.featuredPost.title}
                          </h5>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {stats.featuredPost.content.substring(0, 80)}...
                          </p>
                        </Link>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Link
                        to={`/?category=${category.id}`}
                        className="flex-1 bg-primary-navy text-white text-center py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
                      >
                        Browse Posts
                      </Link>
                      <button
                        onClick={() => {
                          // Subscribe to category functionality
                          alert(`Subscribed to ${category.name} category!`);
                        }}
                        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        title="Subscribe to category"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Tags */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Tags</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore trending topics and find content that matches your interests
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {['React', 'JavaScript', 'Node.js', 'TypeScript', 'Python', 'AI/ML', 'DevOps', 'Cloud Computing', 'UI/UX', 'Mobile Development', 'Data Science', 'Cybersecurity'].map((tag) => (
              <Link
                key={tag}
                to={`/?tag=${encodeURIComponent(tag)}`}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-primary-navy hover:text-white transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary-navy to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Share Your Story?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community of writers and start creating amazing content today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create-post"
              className="bg-primary-gold text-primary-navy px-8 py-3 rounded-xl font-medium hover:bg-yellow-400 transition-colors shadow-lg"
            >
              Start Writing
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-medium hover:bg-white hover:text-primary-navy transition-colors"
            >
              Join Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categories; 