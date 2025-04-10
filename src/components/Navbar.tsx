
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black/80 via-black/50 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between py-4 px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="flex items-center space-x-8">
          <Link to="/" className="h-8">
            <span className="text-netflix-red text-3xl font-bold tracking-tighter">PORTFOLIO</span>
          </Link>
          <nav className="hidden md:flex">
            <ul className="flex space-x-6">
              <li><Link to="/" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">Home</Link></li>
              <li><Link to="/portfolio" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">Projects</Link></li>
              <li><Link to="#about" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">About</Link></li>
              <li><Link to="#contact" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">Contact</Link></li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-5">
          <button className="text-white hover:text-gray-300 transition-colors">
            <Search size={20} />
          </button>
          <button className="text-white hover:text-gray-300 transition-colors">
            <Bell size={20} />
          </button>
          <div className="w-8 h-8 rounded-sm bg-netflix-red flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
