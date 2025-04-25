
import React from 'react';
import { useSocialMediaIcons } from '@/hooks/useSocialMediaIcons';

const Footer = () => {
  const { data: socialIcons } = useSocialMediaIcons();

  return (
    <footer className="py-8 border-t border-netflix-gray/20">
      <div className="px-12 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-netflix-red text-xl font-bold mb-4">PORTFOLIO</h2>
            <p className="text-netflix-gray max-w-md">
              A collection of my projects created with Lovable. 
              Designed and developed with passion and attention to detail.
            </p>
          </div>
          
          <div>
            <h5 className="text-netflix-white text-sm font-medium mb-4">Connect</h5>
            <div className="flex space-x-4">
              {socialIcons?.map((icon) => (
                <a
                  key={icon.id}
                  href={icon.URL || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-netflix-gray hover:text-netflix-white"
                >
                  <img 
                    src={icon.icon_link || ''} 
                    alt={icon.name || 'Social Media Icon'} 
                    className="w-5 h-5 object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-netflix-gray/60 text-sm">
          <p>&copy; 2025 Portfolio. This is not affiliated with Netflix. All project work is original.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
