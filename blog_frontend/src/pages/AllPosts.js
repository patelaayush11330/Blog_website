import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '');
}
  useEffect(() => {
    // Fetch all posts from your backend
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/posts');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <span className="text-blue-700 text-xl font-semibold">Loading posts...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">All Blog Posts</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {posts.map(post => (
            <Link
              to={`/post/${post._id}`}
              key={post._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition flex flex-col"
            >
              <img
                src={post.cover || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'}
                alt={post.title}
                className="h-44 w-full object-cover rounded-t-xl"
              />
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {post.author && (
                    <>
                      <img
                        src={post.author.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.author.name)}
                        alt={post.author.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-blue-200"
                      />
                      <span className="text-sm text-blue-800 font-semibold">{post.author.name}</span>
                    </>
                  )}
                </div>
                <h2 className="font-bold text-lg text-blue-900 mb-1 line-clamp-2">{post.title}</h2>
                <p className="text-gray-700 text-sm flex-1 line-clamp-3">
  {stripHtml(post.snippet || post.content)?.slice(0, 100) + '...'}
</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{post.category || 'General'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {posts.length === 0 && (
          <div className="text-center text-gray-500 mt-10">No posts found.</div>
        )}
      </div>
    </div>
  );
};

export default AllPosts;
