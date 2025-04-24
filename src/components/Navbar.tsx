import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User, Menu, X } from 'lucide-react';
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black/80 via-black/50 to-transparent'}`}>
      <div className="flex items-center justify-between py-2 sm:py-3 px-4 sm:px-8 md:px-12 lg:px-16 md:py-[16px]">
        <div className="flex items-center">
          <Link to="/" className="h-8">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tighter text-red-500">SINGULARITEA</span>
          </Link>
          <nav className="hidden md:flex ml-8">
            <ul className="flex space-x-6">
              <li><Link to="/" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">About</Link></li>
              <li><Link to="#contact" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">Contact</Link></li>
            </ul>
          </nav>
        </div>
        
        <div className="flex items-center space-x-3 sm:space-x-5">
          <button className="text-white hover:text-gray-300 transition-colors hidden sm:block">
            <Search size={18} className="sm:size-20" />
          </button>
          <button className="text-white hover:text-gray-300 transition-colors hidden sm:block">
            <Bell size={18} className="sm:size-20" />
          </button>
          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-sm bg-netflix-red flex items-center justify-center">
            <User size={14} className="sm:size-16 text-white" />
          </div>
          
          {/* Mobile menu button */}
          <button className="text-white md:hidden focus:outline-none" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && <div className="md:hidden bg-black">
          <nav className="px-4 py-4">
            <ul className="flex flex-col space-y-4">
              <li>
                <Link to="/" className="text-white block py-2" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white block py-2" onClick={() => setMobileMenuOpen(false)}>
                  About
                </Link>
              </li>
              <li>
                <Link to="#contact" className="text-white block py-2" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>}
    </header>;
};
export default Navbar;