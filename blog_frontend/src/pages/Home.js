// import React from 'react';
// import { Helmet } from 'react-helmet-async';
// import { Link } from 'react-router-dom';
// import RecentPostsSection from '../components/RecentPostsSection';

// const Home = () => {
//   // TODO: Fetch real data for each section
//   const isLoggedIn = !!localStorage.getItem('user');

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
//       <Helmet>
//         <title>BlogHub - Share Your Story</title>
//         <meta name="description" content="Welcome to BlogHub! Share your stories, connect with readers, and join our community." />
//       </Helmet>
//       {/* Hero Section */}
//       <section className="bg-white rounded-2xl shadow-soft p-8 mt-8 mb-8 max-w-5xl mx-auto text-center">
//         <h1 className="text-4xl font-extrabold text-blue-900 mb-2 tracking-tight">Welcome to BlogHub!</h1>
//         <p className="text-lg text-yellow-700 mb-6">India's most feature-rich blogging platform</p>
//         <p className="text-gray-700 mb-8">Share your stories, discover new perspectives, and join a vibrant community of writers and readers.</p>
//         <Link to="/create-post" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition">Get Started</Link>
//       </section>
//       {/* Features Overview */}
//       <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
//         {/* Trending Blogs */}
//         <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600">
//           <h2 className="text-xl font-bold text-blue-900 mb-4">Trending Blogs</h2>
//           <div className="h-32 bg-blue-50 rounded-lg flex items-center justify-center text-blue-400">[Trending Blogs List]</div>
//         </div>
//         {/* Featured Blogs */}
//         <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-500">
//           <h2 className="text-xl font-bold text-yellow-700 mb-4">Featured Blogs</h2>
//           <div className="h-32 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-400">[Featured Blogs List]</div>
//         </div>
//         {/* Categories */}
//         <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-400">
//           <h2 className="text-xl font-bold text-blue-700 mb-4">Categories</h2>
//           <div className="flex flex-wrap gap-2">[Category Badges]</div>
//         </div>
//         {/* Personalized Feed */}
//         <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600 col-span-1 md:col-span-2 lg:col-span-1">
//           <h2 className="text-xl font-bold text-blue-900 mb-4">{isLoggedIn ? 'Recommended for You' : 'Personalized Feed'}</h2>
//           <div className="h-32 bg-blue-50 rounded-lg flex items-center justify-center text-blue-400">[Personalized Feed]</div>
//         </div>
//         {/* Popular Authors */}
//         <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-500">
//           <h2 className="text-xl font-bold text-yellow-700 mb-4">Popular Authors</h2>
//           <div className="h-32 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-400">[Popular Authors List]</div>
//         </div>
//         {/* Recent Blogs */}
//         <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-400">
//           <h2 className="text-xl font-bold text-blue-700 mb-4">Recent Blogs</h2>
//           <div className="h-32 bg-blue-50 rounded-lg flex items-center justify-center text-blue-400">[Recent Blogs List]</div>
//         </div>
//         {/* Engagement Highlights */}
//         <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-500 col-span-1 md:col-span-2 lg:col-span-1">
//           <h2 className="text-xl font-bold text-yellow-700 mb-4">Engagement Highlights</h2>
//           <div className="flex flex-col gap-2 items-center">
//             <div className="flex items-center gap-2"><span className="text-blue-600 font-bold">[Claps]</span> <span className="text-gray-500">Claps</span></div>
//             <div className="flex items-center gap-2"><span className="text-blue-600 font-bold">[Comments]</span> <span className="text-gray-500">Comments</span></div>
//             <div className="flex items-center gap-2"><span className="text-blue-600 font-bold">[Bookmarks]</span> <span className="text-gray-500">Bookmarks</span></div>
//           </div>
//         </div>
//         {/* Monetization/Promotions */}
//         <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-500">
//           <h2 className="text-xl font-bold text-yellow-700 mb-4">Monetization & Promotions</h2>
//           <div className="h-20 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-400">[Monetization Info]</div>
//         </div>
//         {/* Accessibility & SEO */}
//         <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-400">
//           <h2 className="text-xl font-bold text-blue-700 mb-4">Accessibility & SEO</h2>
//           <div className="h-20 bg-blue-50 rounded-lg flex items-center justify-center text-blue-400">[Accessibility & SEO Info]</div>
//         </div>
//       </section>
//       <RecentPostsSection />
//     </div>
//   );
// };

// export default Home; 


import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import RecentPostsSection from '../components/RecentPostsSection';
import { categories } from '../constants/categories';
import harivanshImg from '../constants/H.jpg';
import premchandImg from '../constants/m.jpeg';
import gulzarImg from '../constants/G.jpg';
import Amit from '../constants/Amit.jpg';
import Priya from '../constants/Priya.png'
import Electric from '../constants/Electric.png';
import Ai from '../constants/Ai.jpeg';
import Featured1 from '../constants/Featured1.jpg';
import Featured2 from '../constants/Featured2.jpg';

const trendingBlogs = [
  {
    id: 1,
    title: "The Future of Electric Cars in India",
    author: "Amit Sharma",
    avatar: Amit,
    category: "Automobile",
    categoryColor: "bg-blue-200 text-blue-800",
    cover: Electric,
    snippet: "Electric vehicles are reshaping India's roads. Here's what you need to know...",
  },
  {
    id: 2,
    title: "Top 10 AI Tools for Developers",
    author: "Priya Singh",
    avatar: Priya,
    category: "Tech",
    categoryColor: "bg-gray-200 text-gray-800",
    cover: Ai,
    snippet: "Boost your productivity with these must-have AI tools for coding...",
  },
];

const featuredBlogs = [
  {
    id: 1,
    title: "Rediscovering Poetry: The Modern Renaissance",
    author: "Harivansh Rai Bachchan",
    avatar: harivanshImg,
    cover: Featured1,
    snippet: "Poetry is making a comeback in the digital age. Explore how modern poets are reaching new audiences online.",
    link: "/post/rediscovering-poetry"
  },
  {
    id: 2,
    title: "Storytelling That Inspires: Lessons from Premchand",
    author: "Munshi Premchand",
    avatar: premchandImg,
    cover: Featured2,
    snippet: "From rural tales to urban legends, Premchand's stories continue to inspire writers across generations.",
    link: "/post/storytelling-inspires"
  }
];

const Home = () => {
  const isLoggedIn = !!localStorage.getItem('user');
  const [engagements, setEngagements] = useState({ claps: 0, bookmarks: 0, comments: 0 });
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEngagements = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/users/${user._id}/engagements`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = await response.json();
        if (response.ok) {
          setEngagements(data);
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchEngagements();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <Helmet>
        <title>BlogHub - Share Your Story</title>
        <meta name="description" content="Welcome to BlogHub! Share your stories, connect with readers, and join our community." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-white rounded-2xl shadow-soft p-8 mt-8 mb-8 max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2 tracking-tight">Welcome to BlogHub!</h1>
        <p className="text-lg text-yellow-700 mb-6">India's most feature-rich blogging platform</p>
        <p className="text-gray-700 mb-8">Share your stories, discover new perspectives, and join a vibrant community of writers and readers.</p>
        <Link to="/create-post" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition">Get Started</Link>
      </section>

      {/* Features Overview */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Trending Blogs */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <span className="animate-pulse text-blue-400 text-2xl">🔥</span>
            Trending Blogs
            <Link
              to="/trending"
              className="ml-auto text-blue-600 text-sm font-semibold hover:underline"
            >
              See All &rarr;
            </Link>
          </h2>
          <div className="bg-blue-50 rounded-lg py-4 px-2 overflow-x-auto">
            <div className="flex gap-6">
              {trendingBlogs.map(blog => (
                <div
                  key={blog.id}
                  className="min-w-[260px] max-w-xs bg-white rounded-lg shadow-md flex flex-col border border-blue-100 hover:shadow-xl transition cursor-pointer"
                  onClick={() => navigate(`/post/${blog.id}`)}
                >
                  <img
                    src={blog.cover}
                    alt={blog.title}
                    className="h-32 w-full object-cover rounded-t-lg"
                  />
                  <div className="p-4 flex flex-col flex-1">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${blog.categoryColor}`}>
                      {blog.category}
                    </div>
                    <h3 className="font-semibold text-blue-800 text-lg mb-1 line-clamp-2">{blog.title}</h3>
                    <p className="text-sm text-gray-600 flex-1 mb-2 line-clamp-2">{blog.snippet}</p>
                    <div className="flex items-center gap-2 mt-auto">
                      <img
                        src={blog.avatar}
                        alt={blog.author}
                        className="w-7 h-7 rounded-full object-cover border-2 border-blue-200"
                      />
                      <span className="text-xs text-gray-700">{blog.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Featured Blogs */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-500">
          <h2 className="text-xl font-bold text-yellow-700 mb-4 flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            Featured Blogs
          </h2>
          <div className="flex flex-col gap-4">
            {featuredBlogs.map(blog => (
              <Link
                to={blog.link}
                key={blog.id}
                className="flex items-center bg-yellow-50 hover:bg-yellow-100 rounded-lg p-3 shadow-sm transition"
              >
                <img
                  src={blog.cover}
                  alt={blog.title}
                  className="w-20 h-20 object-cover rounded-lg mr-4 border-2 border-yellow-200"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-800 text-lg mb-1">{blog.title}</h3>
                  <p className="text-sm text-yellow-700 mb-1 line-clamp-2">{blog.snippet}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src={blog.avatar}
                      alt={blog.author}
                      className="w-7 h-7 rounded-full object-cover border-2 border-yellow-300"
                    />
                    <span className="text-xs text-yellow-800">{blog.author}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* Categories */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-400">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/?category=${category.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r rounded-full text-black font-semibold text-sm shadow hover:scale-105 transition-transform"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                }}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
        {/* Personalized Feed */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600 col-span-1 md:col-span-2 lg:col-span-1">
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            {isLoggedIn ? 'Recommended for You' : 'Personalized Feed'}
          </h2>
          <div className="bg-blue-50 rounded-lg flex flex-wrap gap-3 py-6 px-4 items-center justify-center min-h-[6rem]">
            {/* Category chips */}
            <Link
              to="/?category=automobile"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-200 to-blue-100 rounded-full text-blue-800 font-semibold text-sm shadow hover:scale-105 transition-transform"
            >
              🚗 Automobile
            </Link>
            <Link
              to="/?category=technology"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full text-gray-800 font-semibold text-sm shadow hover:scale-105 transition-transform"
            >
              💻 Tech
            </Link>
            <Link
              to="/?category=travel"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-200 to-yellow-100 rounded-full text-yellow-800 font-semibold text-sm shadow hover:scale-105 transition-transform"
            >
              🌏 Travel
            </Link>
            <Link
              to="/?category=food"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-200 to-red-100 rounded-full text-red-800 font-semibold text-sm shadow hover:scale-105 transition-transform"
            >
              🍲 Food
            </Link>
            <Link
              to="/?category=finance"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-200 to-green-100 rounded-full text-green-800 font-semibold text-sm shadow hover:scale-105 transition-transform"
            >
              💸 Finance
            </Link>
            <Link
              to="/?category=health"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-200 to-pink-100 rounded-full text-pink-800 font-semibold text-sm shadow hover:scale-105 transition-transform"
            >
              🏥 Health
            </Link>
            <Link
              to="/?category=education"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-200 to-purple-100 rounded-full text-purple-800 font-semibold text-sm shadow hover:scale-105 transition-transform"
            >
              📚 Education
            </Link>
          </div>
        </div>
        {/* Popular Authors */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-500">
          <h2 className="text-xl font-bold text-yellow-700 mb-4">Popular Authors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Harivansh Rai Bachchan */}
            <div className="flex flex-col items-center bg-yellow-50 rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <img
                src={harivanshImg}
                alt="Harivansh Rai Bachchan"
                className="w-20 h-20 rounded-full object-cover mb-2 border-4 border-yellow-200"
              />
              <div className="font-semibold text-yellow-800">Harivansh Rai Bachchan</div>
              <div className="text-xs text-yellow-700 text-center mt-1">Celebrated Hindi poet, author of 'Madhushala'</div>
            </div>
            {/* Munshi Premchand */}
            <div className="flex flex-col items-center bg-yellow-50 rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <img
                src={premchandImg}
                alt="Munshi Premchand"
                className="w-20 h-20 rounded-full object-cover mb-2 border-4 border-yellow-200"
              />
              <div className="font-semibold text-yellow-800">Munshi Premchand</div>
              <div className="text-xs text-yellow-700 text-center mt-1">Legendary novelist and short story writer in Hindi-Urdu literature</div>
            </div>
            {/* Gulzar */}
            <div className="flex flex-col items-center bg-yellow-50 rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <img
                src={gulzarImg}
                alt="Gulzar"
                className="w-20 h-20 rounded-full object-cover mb-2 border-4 border-yellow-200"
              />
              <div className="font-semibold text-yellow-800">Gulzar</div>
              <div className="text-xs text-yellow-700 text-center mt-1">Acclaimed lyricist, poet, and filmmaker</div>
            </div>
          </div>
        </div>
        {/* Recent Blogs */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-400">
          {/* RecentPostsSection handles navigation and click events */}
          <RecentPostsSection />
        </div>
        {/* Your Writing Journey (replaces Engagement Highlights) */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600 col-span-1 md:col-span-2 lg:col-span-1 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-bold text-blue-900 mb-2 flex items-center gap-2">
            <span className="text-2xl">✍️</span>
            Your Writing Journey
          </h2>
          <p className="text-blue-700 mb-4">Track your progress and celebrate your milestones!</p>
          <div className="flex flex-wrap gap-6 justify-center mb-4">
            <div className="flex flex-col items-center">
              <span className="text-3xl text-blue-600 font-bold">{engagements.claps}</span>
              <span className="text-gray-500">Total Claps</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl text-blue-600 font-bold">{engagements.comments}</span>
              <span className="text-gray-500">Comments Received</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl text-blue-600 font-bold">{engagements.bookmarks}</span>
              <span className="text-gray-500">Bookmarked Posts</span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg px-6 py-3 mt-2 text-blue-800 font-semibold">
            {isLoggedIn
              ? "Keep writing, sharing, and inspiring others with your words!"
              : "Sign up to start your writing journey and unlock achievements!"}
          </div>
        </div>
        {/* Monetization/Promotions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-500">
          <h2 className="text-xl font-bold text-yellow-700 mb-4">Monetization & Promotions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ad Revenue */}
            <div className="bg-yellow-50 rounded-lg p-4 flex flex-col items-center shadow-sm">
              <span className="text-3xl mb-2 text-yellow-500">📢</span>
              <h3 className="font-semibold text-yellow-700 mb-1">Ad Revenue</h3>
              <p className="text-sm text-yellow-700 mb-3 text-center">
                Earn by displaying ads on your blog. Payouts in INR.
              </p>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded font-medium hover:bg-yellow-600 transition">
                Learn More
              </button>
            </div>
            {/* Premium Membership */}
            <div className="bg-yellow-100 rounded-lg p-4 flex flex-col items-center shadow-sm border-2 border-yellow-300">
              <span className="text-3xl mb-2 text-yellow-600">⭐</span>
              <h3 className="font-semibold text-yellow-800 mb-1">Premium Membership</h3>
              <p className="text-sm text-yellow-800 mb-3 text-center">
                Unlock exclusive features & higher earnings. <br />
                <span className="font-bold">₹299/month</span>
              </p>
              <a
                href="https://your-payment-gateway.com/subscribe?plan=premium"
                className="bg-yellow-600 text-white px-4 py-2 rounded font-medium hover:bg-yellow-700 transition"
              >
                Subscribe Now
              </a>
            </div>
            {/* Sponsored Posts */}
            <div className="bg-yellow-50 rounded-lg p-4 flex flex-col items-center shadow-sm">
              <span className="text-3xl mb-2 text-yellow-500">🤝</span>
              <h3 className="font-semibold text-yellow-700 mb-1">Sponsored Posts</h3>
              <p className="text-sm text-yellow-700 mb-3 text-center">
                Collaborate with brands & publish sponsored content. Payouts in INR.
              </p>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded font-medium hover:bg-yellow-600 transition">
                Get Started
              </button>
            </div>
          </div>
        </div>
        {/* Accessibility & SEO */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-400">
          <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🌐</span>
            Accessibility & SEO
          </h2>
          <div className="bg-blue-50 rounded-lg px-6 py-4 flex flex-row items-stretch justify-between gap-8">
            {/* Accessibility */}
            <div className="flex-1 flex flex-col items-center text-center">
              <span className="text-3xl text-blue-500 mb-2" aria-hidden="true">♿</span>
              <div className="font-semibold text-blue-800 mb-1">Accessibility</div>
              <ul className="list-disc text-left pl-5 text-blue-700 text-sm space-y-1">
                <li>Semantic HTML for screen readers</li>
                <li>Keyboard navigation support</li>
                <li>High color contrast for readability</li>
                <li>Alt text for all images</li>
              </ul>
            </div>
            {/* Divider */}
            <div className="w-px bg-blue-200 mx-6" />
            {/* SEO */}
            <div className="flex-1 flex flex-col items-center text-center">
              <span className="text-3xl text-blue-500 mb-2" aria-hidden="true">🔍</span>
              <div className="font-semibold text-blue-800 mb-1">SEO Optimization</div>
              <ul className="list-disc text-left pl-5 text-blue-700 text-sm space-y-1">
                <li>Descriptive meta tags & titles</li>
                <li>Fast loading and mobile-friendly design</li>
                <li>Structured data for rich results</li>
                <li>Accessible URLs and sitemaps</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
