
import React from 'react';
import { Linkedin, Mail, WhatsApp } from 'lucide-react';

const Footer = () => {
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
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-netflix-gray hover:text-netflix-white">
                <Linkedin size={20} />
              </a>
              <a href="mailto:contact@example.com" className="text-netflix-gray hover:text-netflix-white">
                <Mail size={20} />
              </a>
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="text-netflix-gray hover:text-netflix-white">
                <WhatsApp size={20} />
              </a>
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
