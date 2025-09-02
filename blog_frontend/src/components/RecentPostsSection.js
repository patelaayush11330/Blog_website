// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';

// const RecentPostsSection = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchRecentPosts = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const token = localStorage.getItem('token');
//         const response = await fetch('http://localhost:5000/api/posts?limit=6&sort=-createdAt', {
//           headers: token ? { 'Authorization': `Bearer ${token}` } : {}
//         });
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || 'Failed to fetch posts');
//         setPosts(Array.isArray(data) ? data : (data.posts || []));
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRecentPosts();
//   }, []);

//   return (
//     <section className="max-w-7xl mx-auto mb-12">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-extrabold text-blue-900 tracking-tight">Recent Posts</h2>
//         <Link to="/posts" className="text-blue-600 font-semibold hover:underline text-2xl" aria-label="See All Post">&rarr;</Link>
//       </div>
//       {loading ? (
//         <div className="flex justify-center items-center h-32">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         </div>
//       ) : error ? (
//         <div className="text-red-600 text-center">{error}</div>
//       ) : posts.length === 0 ? (
//         <div className="text-gray-500 text-center">No posts found.</div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {posts.map(post => (
//             <div key={post._id} className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600 flex flex-col justify-between h-full transition hover:shadow-2xl">
//               <div>
//                 <h3 className="text-lg font-bold text-blue-800 mb-1 truncate" title={post.title}>{post.title}</h3>
//                 <p className="text-gray-700 mb-3 line-clamp-3">{post.snippet || post.content?.slice(0, 100) + '...'}</p>
//               </div>
//               <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
//                 <span>By {post.author?.name || 'Unknown'}</span>
//                 <span>{new Date(post.createdAt).toLocaleDateString()}</span>
//               </div>
//               <div className="mt-2 flex items-center gap-2">
//                 <span className={`px-2 py-0.5 rounded text-xs font-semibold ${post.status === 'published' ? 'bg-blue-100 text-blue-700' : post.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{post.status}</span>
//                 {post.featured && <span className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">Featured</span>}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// };

// export default RecentPostsSection; 

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Utility to strip HTML tags
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '');
}

const RecentPostsSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/posts?limit=6&sort=-createdAt', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch posts');
        setPosts(Array.isArray(data) ? data : (data.posts || []));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentPosts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-extrabold text-blue-900 tracking-tight">Recent Posts</h2>
        <Link
          to="/posts"
          className="text-blue-600 font-semibold hover:underline text-lg"
          aria-label="See all recent posts"
        >
          See All Posts &rarr;
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-gray-500 text-center">No posts found.</div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-2">
          {posts.map(post => (
            <Link
              to={`/post/${post._id}`}
              key={post._id}
              className="min-w-[270px] max-w-xs bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600 flex flex-col justify-between h-full transition hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            >
              <div>
                <h3
                  className="text-lg font-bold text-blue-800 mb-1 truncate"
                  title={post.title}
                >
                  {post.title}
                </h3>
                <p className="text-gray-700 mb-3 line-clamp-3">
                  {post.snippet
                    ? stripHtml(post.snippet)
                    : stripHtml(post.content)?.slice(0, 100) +
                      (stripHtml(post.content).length > 100 ? '...' : '')
                  }
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <span>By {post.author?.name || 'Unknown'}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    post.status === 'published'
                      ? 'bg-blue-100 text-blue-700'
                      : post.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {post.status}
                </span>
                {post.featured && (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
                    Featured
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentPostsSection;
