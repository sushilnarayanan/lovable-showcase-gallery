
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSocialMediaIcons } from '@/hooks/useSocialMediaIcons';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: socialIcons, isLoading, error } = useSocialMediaIcons();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  console.log('Navbar social icons:', socialIcons);

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
            {isLoading && <span className="text-white/50 text-sm">Loading...</span>}
            {error && <span className="text-red-400 text-sm">Error loading icons</span>}
            {socialIcons && socialIcons.length > 0 ? (
              socialIcons.map((icon) => (
                <a
                  key={icon.id}
                  href={icon.URL || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors flex items-center justify-center"
                >
                  <img 
                    src={icon.icon_link || ''} 
                    alt={icon.name || 'Social Media Icon'} 
                    className="w-5 h-5 object-contain"
                    onError={(e) => {
                      console.error(`Failed to load icon: ${icon.icon_link}`);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </a>
              ))
            ) : !isLoading && !error ? (
              <span className="text-white/50 text-sm">No icons available</span>
            ) : null}
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
                <Link to="#products" className="text-white block py-2" onClick={() => setMobileMenuOpen(false)}>
                  Products
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
