
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VideoGallery from '@/components/VideoGallery';

const Videos = () => {
  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar />
      
      {/* Header section with proper spacing for navbar */}
      <div className="pt-24 px-4 sm:px-8 md:px-12 lg:px-16 pb-16">
        <h1 className="text-4xl font-bold text-white mb-2">
          Video Library
        </h1>
        <p className="text-gray-400 mb-8 max-w-2xl">
          Dive into a collection of videos about technology, programming, AI, and more. 
          Click on any thumbnail to watch the video.
        </p>

        <VideoGallery />
      </div>
      
      <Footer />
    </div>
  );
};

export default Videos;
