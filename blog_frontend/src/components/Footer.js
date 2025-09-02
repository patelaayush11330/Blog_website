import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-blue-900 text-white py-8 mt-12">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
      <div className="mb-4 md:mb-0">
        <span className="font-bold text-xl text-yellow-400">BlogHub</span>
        <span className="ml-2 text-sm text-blue-100">&copy; {new Date().getFullYear()} All rights reserved.</span>
      </div>
      <nav className="flex flex-wrap gap-6 text-sm">
        <Link to="/about" className="hover:text-yellow-400 transition">About</Link>
        <Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link>
        <Link to="/privacy" className="hover:text-yellow-400 transition">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-yellow-400 transition">Terms</Link>
        <Link to="/careers" className="hover:text-yellow-400 transition">Careers</Link>
      </nav>
    </div>
  </footer>
);

export default Footer; 