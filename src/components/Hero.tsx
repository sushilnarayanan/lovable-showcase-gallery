
import React from 'react';
import { Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative h-[85vh] w-full">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://assets-prd.ignimgs.com/2022/09/26/love-in-contract-1664221399787.jpg')",
          backgroundPosition: "center 20%",
        }}
      >
        {/* Gradient overlays for Netflix-like look */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      </div>
      
      {/* Hero Content */}
      <div className="relative h-full flex flex-col justify-end pb-[15%] px-[60px]">
        <div className="max-w-[36%]">
          {/* Show Title Logo */}
          <img 
            src="https://i.ibb.co/cyJVfZM/love-in-the-moonlight.png" 
            alt="Love in the Moonlight" 
            className="w-[50%] mb-6"
          />
          
          {/* Description */}
          <p className="text-white text-lg mb-4 line-clamp-3">
            When a young noblewoman crosses paths with a mysterious man living in disguise, she finds herself caught up in palace intrigue and unexpected romance.
          </p>
          
          {/* Buttons */}
          <div className="flex space-x-4">
            <Button variant="play" size="lg" className="flex items-center gap-2 px-8">
              <Play size={24} /> Play
            </Button>
            <Button variant="moreInfo" size="lg" className="flex items-center gap-2 px-8">
              <Info size={24} /> More Info
            </Button>
          </div>
        </div>
      </div>
      
      {/* Age rating badge */}
      <div className="absolute bottom-[25%] right-[60px] flex items-center">
        <div className="border-l-4 border-white pl-3 py-1">
          <span className="text-white text-lg font-medium">U/A 16+</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
