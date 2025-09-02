import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import Bookmarks from './pages/Bookmarks';
import Categories from './pages/Categories';
import Trending from './pages/Trending';
import './App.css';
import { HelmetProvider } from 'react-helmet-async';
import { useEffect, useState, createContext } from 'react';
import './i18n';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Career from './pages/Careers';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AllPosts from './pages/AllPosts';

export const DarkModeContext = createContext();

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <HelmetProvider>
      <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
        <Router>
          <div className="App min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/edit-post/:id" element={<EditPost />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/about" element={<About/>} />
                <Route path="/contact" element={<Contact/>} />
                <Route path='/privacy' element={<Privacy/>} />
                <Route path='/terms' element={<Terms/>} />
                <Route path='/careers' element={<Career/>} />
                <Route path='/forgot-password' element={<ForgotPassword/>} />
                <Route path='/reset-password/:token' element={<ResetPassword />} /> 
                <Route path='/posts' element={<AllPosts />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </DarkModeContext.Provider>
    </HelmetProvider>
  );
}

export default App;
