
import React from 'react';
import { Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative h-[85vh] w-full pt-16"> {/* Added pt-16 to create space for header */}
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80')", 
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>
      
      {/* Hero Content - positioned for Netflix style */}
      <div className="relative h-full flex flex-col justify-center px-4 sm:px-8 md:px-12 pb-24 w-full">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-5 text-netflix-red">My Lovable Portfolio</h1>
          <p className="text-lg md:text-xl mb-8 text-white max-w-lg">
            Check out my latest projects built with Lovable. 
            This portfolio showcases web applications created with React, Tailwind CSS, and more.
          </p>
          <div className="flex space-x-4">
            <Button className="bg-netflix-red hover:bg-netflix-red/80 text-white rounded-md px-8 py-3 flex items-center text-lg">
              <Play size={24} className="mr-2" />
              Play
            </Button>
            <Button variant="outline" className="bg-gray-800/60 text-white hover:bg-gray-800/80 border-none rounded-md px-8 py-3 flex items-center text-lg">
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
