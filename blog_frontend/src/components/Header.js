// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// // const languages = [
// //   { code: 'en', label: 'English' },
// //   { code: 'hi', label: 'हिन्दी' },
// //   { code: 'bn', label: 'বাংলা' },
// //   { code: 'ta', label: 'தமிழ்' },
// //   { code: 'te', label: 'తెలుగు' },
// //   { code: 'mr', label: 'मराठी' },
// //   { code: 'gu', label: 'ગુજરાતી' },
// //   { code: 'kn', label: 'ಕನ್ನಡ' },
// //   { code: 'ml', label: 'മലയാളം' },
// // ];

// const Header = () => {
//   const [search, setSearch] = useState('');
//   // const [lang, setLang] = useState('en');
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem('user'));

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (search.trim()) {
//       navigate(`/search?q=${encodeURIComponent(search)}`);
//     }
//   };

//   // const handleLangChange = (e) => {
//   //   setLang(e.target.value);
//   //   // TODO: Integrate i18n switch logic
//   // };

//   return (
//     <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center h-auto py-2 gap-2 md:gap-0">
//         {/* Logo & Tagline */}
//         <Link to="/" className="flex items-center space-x-3">
//           <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-400 rounded-xl flex items-center justify-center shadow-lg">
//             <span className="text-yellow-500 font-bold text-xl">B</span>
//           </div>
//           <span className="text-blue-900 font-extrabold text-2xl tracking-tight">BlogHub</span>
//           <span className="hidden md:inline text-yellow-600 font-semibold text-lg ml-2">Share Your Story</span>
//         </Link>
//         {/* Search Bar */}
//         <form onSubmit={handleSearch} className="flex-1 flex justify-center max-w-lg w-full mx-4">
//           <input
//             type="text"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             placeholder="Search blogs, authors, topics..."
//             className="w-full px-4 py-2 border border-blue-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
//           />
//           <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-r-lg font-semibold hover:bg-blue-700 transition">Search</button>
//         </form>
//         {/* Language Switcher & Profile/Login */}
//         <div className="flex items-center space-x-4">
//           {/* <select
//             value={lang}
//             onChange={handleLangChange}
//             className="px-3 py-2 rounded-lg border border-yellow-400 bg-yellow-50 text-yellow-800 font-semibold focus:outline-none"
//           >
//             {languages.map(l => (
//               <option key={l.code} value={l.code}>{l.label}</option>
//             ))}
//           </select> */}
//           {user ? (
//             <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-600 text-blue-900 rounded-lg font-semibold hover:bg-blue-100 transition">
//               <img src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)} alt="avatar" className="w-8 h-8 rounded-full" />
//               { <span>{user.name.split(' ')[0]}</span>}
//               {/* {<span>{user.name}</span>} */}
//             </Link>
//           ) : (
//             <>
//               <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">Sign Up</Link>
//               <Link to="/login" className="ml-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">Login</Link>
//             </>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header; 


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ...languages array (optional)

const Header = () => {
  const [search, setSearch] = useState('');
  // const [lang, setLang] = useState('en');
  const navigate = useNavigate();

  // Robust user parsing
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    user = null;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  // const handleLangChange = (e) => {
  //   setLang(e.target.value);
  //   // TODO: Integrate i18n switch logic
  // };

  // Safely get first name or fallback
  const getFirstName = (userObj) => {
    if (userObj && userObj.name && typeof userObj.name === 'string') {
      return userObj.name.split(' ')[0];
    }
    return 'User';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center h-auto py-2 gap-2 md:gap-0">
        {/* Logo & Tagline */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-400 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-yellow-500 font-bold text-xl">B</span>
          </div>
          <span className="text-blue-900 font-extrabold text-2xl tracking-tight">BlogHub</span>
          <span className="hidden md:inline text-yellow-600 font-semibold text-lg ml-2">Share Your Story</span>
        </Link>
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 flex justify-center max-w-lg w-full mx-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search blogs, authors, topics..."
            className="w-full px-4 py-2 border border-blue-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-r-lg font-semibold hover:bg-blue-700 transition">Search</button>
        </form>
        {/* Language Switcher & Profile/Login */}
        <div className="flex items-center space-x-4">
          {/* Language switcher (optional) */}
          {user ? (
            <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-600 text-blue-900 rounded-lg font-semibold hover:bg-blue-100 transition">
              <img
                src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User')}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <span>{getFirstName(user)}</span>
            </Link>
          ) : (
            <>
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">Sign Up</Link>
              <Link to="/login" className="ml-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">Login</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
