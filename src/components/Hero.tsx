
import React from 'react';
import { Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative h-[90vh] w-full">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80')", 
        }}
      >
        {/* Darker gradient overlays for Netflix-like look */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />
      </div>
      
      {/* Hero Content - positioned more like Netflix */}
      <div className="relative h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 pb-20">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">My Portfolio</h1>
          <p className="text-xl mb-8 text-white/80">
            Check out my latest projects built with Lovable. 
            This portfolio showcases web applications created with React, Tailwind CSS, and more.
          </p>
          <div className="flex space-x-4">
            <Button variant="netflix" className="rounded-none px-8 py-6 flex items-center">
              <Play size={24} className="mr-2" />
              Play
            </Button>
            <Button variant="netflixOutline" className="rounded-none px-8 py-6 flex items-center">
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
