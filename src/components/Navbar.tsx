
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, ChevronDown } from 'lucide-react';

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
        isScrolled ? 'bg-netflix-black' : 'bg-gradient-to-b from-netflix-black/80 to-transparent'
      }`}
    >
      <div className="netflix-container flex items-center justify-between py-4">
        <div className="flex items-center space-x-8">
          <Link to="/" className="h-8">
            <span className="text-netflix-red text-3xl font-bold tracking-tighter">PORTFOLIO</span>
          </Link>
          <nav className="hidden md:flex">
            <ul className="flex space-x-6">
              <li><Link to="/" className="text-sm text-netflix-white hover:text-netflix-gray">Home</Link></li>
              <li><Link to="#projects" className="text-sm text-netflix-white hover:text-netflix-gray">Projects</Link></li>
              <li><Link to="#about" className="text-sm text-netflix-white hover:text-netflix-gray">About</Link></li>
              <li><Link to="#contact" className="text-sm text-netflix-white hover:text-netflix-gray">Contact</Link></li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-netflix-white">
            <Search size={20} />
          </button>
          <button className="text-netflix-white">
            <Bell size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-netflix-red flex items-center justify-center">
              <span className="text-white text-sm">L</span>
            </div>
            <ChevronDown size={16} className="text-netflix-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
