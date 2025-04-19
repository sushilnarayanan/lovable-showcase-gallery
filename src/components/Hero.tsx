import React from 'react';
import { Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
const Hero = () => {
  return <div className="relative h-[85vh] w-full overflow-hidden"> 
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80')",
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      height: '100%'
    }} />
      
      {/* Gradient Overlay - Adjusted to be more subtle and match Netflix style */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
      
      {/* Hero Content - positioned with Netflix-style layout */}
      <div className="relative z-20 h-full flex flex-col justify-center px-4 sm:px-8 md:px-[4%] lg:px-[4%] w-full">
        <div className="max-w-xl mt-0 pt-16"> 
          {/* Tag and categories */}
          <div className="mb-3">
            <span className="bg-netflix-red text-white px-2 py-0.5 text-xs font-bold mr-2">Rated U/A</span>
            <span className="text-sm text-gray-300">Cult classic • Action</span>
          </div>
          
          {/* Title area */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white leading-tight">The Products</h1>
          
          {/* Membership info */}
          <p className="text-sm text-white/80 mb-3 font-medium">Built by Sushil Narayanan</p>
          
          <p className="text-base md:text-lg mb-6 text-white/90 max-w-lg">Check out my latest products built with modern technologies. This portfolio showcases web applications created with Nocode and AI tools - Bolt, Lovable, Softr, Replit, and more. </p>
          
          <div className="flex space-x-4 mt-4">
            <Button variant="netflix" className="px-6 py-2 flex items-center text-base font-medium">
              <Play size={20} className="mr-2" />
              Start Watching
            </Button>
            <Button variant="netflixOutline" className="px-6 py-2 flex items-center text-base font-medium">
              <Info size={20} className="mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default Hero;