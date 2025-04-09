
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, ChevronDown, User } from 'lucide-react';

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
      <div className="flex items-center justify-between h-[68px] px-[60px]">
        {/* Left section: Logo and navigation */}
        <div className="flex items-center">
          <Link to="/" className="mr-8">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" 
              alt="Netflix" 
              className="h-[25px]"
            />
          </Link>
          
          <nav>
            <ul className="flex items-center space-x-5">
              <li><Link to="/" className="text-sm text-white font-medium">Home</Link></li>
              <li><Link to="/tvshows" className="text-sm text-white/70 hover:text-white transition-colors">TV Shows</Link></li>
              <li><Link to="/movies" className="text-sm text-white/70 hover:text-white transition-colors">Movies</Link></li>
              <li><Link to="/new" className="text-sm text-white/70 hover:text-white transition-colors">New & Popular</Link></li>
              <li><Link to="/mylist" className="text-sm text-white/70 hover:text-white transition-colors">My List</Link></li>
              <li><Link to="/browse" className="text-sm text-white/70 hover:text-white transition-colors">Browse by Languages</Link></li>
            </ul>
          </nav>
        </div>
        
        {/* Right section: Search, notifications, profile */}
        <div className="flex items-center space-x-5">
          <button className="text-white hover:text-white/80 transition-colors">
            <Search size={20} />
          </button>
          <Link to="/kids" className="text-sm text-white/70 hover:text-white transition-colors">Children</Link>
          <div className="relative">
            <button className="text-white hover:text-white/80 transition-colors">
              <Bell size={20} />
            </button>
            <span className="absolute -top-1 -right-1 bg-netflix-red text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </div>
          <div className="flex items-center space-x-1 group">
            <img 
              src="https://occ-0-1339-1340.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABTYctxxbe-UkKEdlMxXm4FVGD6DqTHkQ0TQ5CQJ9jbOMnG0CYxYcSICcTUQz8DrB7CpKUGpqJVMtEqksLlvSJx2ac3Ak.png?r=a41" 
              alt="Profile" 
              className="h-8 w-8 rounded"
            />
            <ChevronDown size={16} className="text-white group-hover:rotate-180 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
