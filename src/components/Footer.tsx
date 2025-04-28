
import React from 'react';
import { useSocialMediaIcons } from '@/hooks/useSocialMediaIcons';

const Footer = () => {
  const { data: socialIcons, isLoading, error } = useSocialMediaIcons();
  
  console.log('Footer social icons:', socialIcons);

  return (
    <footer className="py-8 border-t border-gray-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2025 Sushil Narayanan. All rights reserved.
          </p>
          
          <div className="flex space-x-4">
            {isLoading && <span className="text-gray-400 text-sm">Loading icons...</span>}
            {error && <span className="text-red-400 text-sm">Error loading social icons</span>}
            {socialIcons && socialIcons.length > 0 ? (
              socialIcons.map((icon) => (
                <a
                  key={icon.id}
                  href={icon.URL || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-800 transition-colors"
                  title={icon.name || ''}
                >
                  <img 
                    src={icon.icon_link || ''} 
                    alt={icon.name || 'Social Media Icon'} 
                    className="w-5 h-5 object-contain bg-white rounded-full p-0.5"
                    onError={(e) => {
                      console.error(`Failed to load icon: ${icon.icon_link}`);
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </a>
              ))
            ) : !isLoading && !error ? (
              <span className="text-gray-400 text-sm">No social icons available</span>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
