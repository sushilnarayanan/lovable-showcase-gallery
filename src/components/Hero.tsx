
import React from 'react';
import { Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative h-[80vh] w-full"> {/* Adjusted height */}
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80')", 
        }}
      >
        {/* Enhanced Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>
      
      {/* Hero Content - positioned like Netflix with better alignment */}
      <div className="relative h-full flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 w-full">
        <div className="max-w-xl mt-16"> {/* Increased top margin to account for navbar */}
          {/* Logo/Title area */}
          <h2 className="text-3xl font-bold mb-2 text-netflix-red">MY PORTFOLIO</h2>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-5 text-white">Creative Developer</h1>
          
          {/* Info section */}
          <div className="flex items-center gap-3 text-sm text-gray-300 mb-4">
            <span className="bg-netflix-red text-white px-1 py-0.5 text-xs">NEW</span>
            <span>2024</span>
            <span className="border border-gray-500 px-1 text-xs">HD</span>
          </div>
          
          <p className="text-lg md:text-xl mb-6 text-white/90 max-w-lg">
            Check out my latest projects built with modern technologies. 
            This portfolio showcases web applications created with React, Tailwind CSS, and more.
          </p>
          
          <div className="flex space-x-4">
            <Button variant="netflix" className="px-8 py-3 flex items-center text-lg">
              <Play size={24} className="mr-2" />
              Start Watching
            </Button>
            <Button variant="netflixOutline" className="px-8 py-3 flex items-center text-lg">
              <Info size={24} className="mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
