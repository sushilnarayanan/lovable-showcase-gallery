
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Mail, MessageSquare, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between py-4 px-4 sm:px-8 md:px-12 lg:px-[49px]">
        <div className="flex items-center">
          <Link to="/" className="h-8">
            <span className="text-2xl font-bold tracking-tighter text-red-500">Sushil Narayanan</span>
          </Link>
          <nav className="hidden md:flex ml-8">
            <ul className="flex space-x-6">
              <li><Link to="/" className="text-base font-medium text-white hover:text-gray-300 transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-base font-medium text-white hover:text-gray-300 transition-colors">About</Link></li>
              <li><Link to="#products" className="text-base font-medium text-white hover:text-gray-300 transition-colors">Products</Link></li>
            </ul>
          </nav>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="mailto:contact@example.com" className="text-white/80 hover:text-white transition-colors">
              <Mail size={20} />
            </a>
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
              <MessageSquare size={20} />
            </a>
          </div>
          
          <button className="text-white md:hidden" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-black">
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
        </div>
      )}
    </header>
  );
};

export default Navbar;
