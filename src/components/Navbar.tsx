
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Mail, MessageSquare, Menu, X } from 'lucide-react';

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
      <div className="flex items-center justify-between py-2 sm:py-3 px-4 sm:px-8 md:px-12 md:py-[16px] lg:px-[49px]">
        <div className="flex items-center">
          <Link to="/" className="h-8">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tighter text-red-500 px-0">Sushil Narayanan</span>
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
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
            <Linkedin size={18} className="sm:size-20" />
          </a>
          <a href="mailto:contact@example.com" className="text-white hover:text-gray-300 transition-colors">
            <Mail size={18} className="sm:size-20" />
          </a>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
            <MessageSquare size={18} className="sm:size-20" />
          </a>
          
          <button className="text-white md:hidden focus:outline-none" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
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
