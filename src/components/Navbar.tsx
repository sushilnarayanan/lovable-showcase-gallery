
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSocialMediaIcons } from '@/hooks/useSocialMediaIcons';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: socialIcons, isLoading, error } = useSocialMediaIcons();
  const location = useLocation();
  
  // Determine if we're on the about page to set the text color
  const isAboutPage = location.pathname === '/about';
  const textColor = isAboutPage ? 'text-black' : 'text-white';
  const hoverColor = isAboutPage ? 'hover:text-gray-600' : 'hover:text-gray-300';

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
              <li><Link to="/" className={`text-base font-medium ${textColor} ${hoverColor} transition-colors`}>Home</Link></li>
              <li><Link to="/about" className={`text-base font-medium ${textColor} ${hoverColor} transition-colors`}>About</Link></li>
              <li><Link to="/videos" className={`text-base font-medium ${textColor} ${hoverColor} transition-colors`}>Videos</Link></li>
              <li><a href="https://futuretenseai.substack.com/" target="_blank" rel="noopener noreferrer" className={`text-base font-medium ${textColor} ${hoverColor} transition-colors`}>Substack</a></li>
            </ul>
          </nav>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6">
            {isLoading && <span className="text-black/50 text-sm">Loading...</span>}
            {error && <span className="text-red-400 text-sm">Error loading icons</span>}
            {socialIcons && socialIcons.length > 0 ? (
              socialIcons.map((icon) => (
                <a
                  key={icon.id}
                  href={icon.URL || '#'}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors flex items-center justify-center"
                  title={icon.name || ''}
                >
                  <img 
                    src={icon.icon_link || ''} 
                    alt={icon.name || 'Social Media Icon'} 
                    className="w-6 h-6 object-contain bg-white rounded-full p-0.5"
                    onError={(e) => {
                      console.error(`Failed to load icon: ${icon.icon_link}`);
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </a>
              ))
            ) : !isLoading && !error ? (
              <span className="text-black/50 text-sm">No icons available</span>
            ) : null}
          </div>
          
          <button className={`${textColor} md:hidden`} onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-white">
          <nav className="px-4 py-4">
            <ul className="flex flex-col space-y-4">
              <li>
                <Link to="/" className="text-black block py-2" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-black block py-2" onClick={() => setMobileMenuOpen(false)}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/videos" className="text-black block py-2" onClick={() => setMobileMenuOpen(false)}>
                  Videos
                </Link>
              </li>
              <li>
                <a 
                  href="https://futuretenseai.substack.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-black block py-2" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Substack
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
