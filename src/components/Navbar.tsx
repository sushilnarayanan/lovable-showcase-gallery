
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
        isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between py-4 px-6 md:px-12 lg:px-24">
        <div className="flex items-center space-x-8">
          <Link to="/" className="h-8">
            <span className="text-netflix-red text-3xl font-bold tracking-tighter">PORTFOLIO</span>
          </Link>
          <nav className="hidden md:flex">
            <ul className="flex space-x-6">
              <li><Link to="/" className="text-sm text-white hover:text-gray-300">Home</Link></li>
              <li><Link to="/portfolio" className="text-sm text-white hover:text-gray-300">Projects</Link></li>
              <li><Link to="#about" className="text-sm text-white hover:text-gray-300">About</Link></li>
              <li><Link to="#contact" className="text-sm text-white hover:text-gray-300">Contact</Link></li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-white">
            <Search size={20} />
          </button>
          <button className="text-white">
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
