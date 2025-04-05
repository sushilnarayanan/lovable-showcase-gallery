
import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 mt-8 border-t border-netflix-gray/20">
      <div className="netflix-container">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-netflix-red text-xl font-bold mb-4">PORTFOLIO</h2>
            <p className="text-netflix-gray max-w-md">
              A collection of my projects created with Lovable. 
              Designed and developed with passion and attention to detail.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-netflix-white text-sm font-medium mb-4">Navigation</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-netflix-gray text-sm hover:text-netflix-white">Home</a></li>
                <li><a href="#projects" className="text-netflix-gray text-sm hover:text-netflix-white">Projects</a></li>
                <li><a href="#about" className="text-netflix-gray text-sm hover:text-netflix-white">About</a></li>
                <li><a href="#contact" className="text-netflix-gray text-sm hover:text-netflix-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-netflix-white text-sm font-medium mb-4">Categories</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-netflix-gray text-sm hover:text-netflix-white">Web Apps</a></li>
                <li><a href="#" className="text-netflix-gray text-sm hover:text-netflix-white">UI/UX Designs</a></li>
                <li><a href="#" className="text-netflix-gray text-sm hover:text-netflix-white">Animations</a></li>
                <li><a href="#" className="text-netflix-gray text-sm hover:text-netflix-white">Experiments</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-netflix-white text-sm font-medium mb-4">Technologies</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-netflix-gray text-sm hover:text-netflix-white">React</a></li>
                <li><a href="#" className="text-netflix-gray text-sm hover:text-netflix-white">Tailwind CSS</a></li>
                <li><a href="#" className="text-netflix-gray text-sm hover:text-netflix-white">TypeScript</a></li>
                <li><a href="#" className="text-netflix-gray text-sm hover:text-netflix-white">Lovable</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-netflix-white text-sm font-medium mb-4">Connect</h5>
              <div className="flex space-x-4">
                <a href="#" className="text-netflix-gray hover:text-netflix-white"><Github size={20} /></a>
                <a href="#" className="text-netflix-gray hover:text-netflix-white"><Twitter size={20} /></a>
                <a href="#" className="text-netflix-gray hover:text-netflix-white"><Linkedin size={20} /></a>
                <a href="#" className="text-netflix-gray hover:text-netflix-white"><Mail size={20} /></a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center text-netflix-gray/60 text-sm">
          <p>&copy; 2025 Portfolio. This is not affiliated with Netflix. All project work is original.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
