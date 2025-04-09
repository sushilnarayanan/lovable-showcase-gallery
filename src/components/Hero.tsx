
import React from 'react';
import { Play, Info, VolumeX } from 'lucide-react';
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
          
          {/* Buttons */}
          <div className="flex space-x-3 mb-4">
            <Button 
              className="bg-white text-black hover:bg-white/90 rounded-md px-6 py-1 h-[38px] flex items-center"
            >
              <Play className="mr-1" size={24} /> Play
            </Button>
            <Button 
              variant="secondary" 
              className="bg-zinc-500/70 text-white hover:bg-zinc-500/90 rounded-md px-6 py-1 h-[38px] flex items-center"
            >
              <Info className="mr-2" size={24} /> More Info
            </Button>
          </div>
        </div>
      </div>
      
      {/* Age rating and mute button */}
      <div className="absolute bottom-[25%] right-[60px] flex items-center space-x-5">
        <div className="border-l-4 border-white pl-2">
          <span className="text-white text-lg font-medium">U/A 16+</span>
        </div>
        <button className="w-10 h-10 border-2 border-white/70 rounded-full flex items-center justify-center bg-black/30">
          <VolumeX size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default Hero;
