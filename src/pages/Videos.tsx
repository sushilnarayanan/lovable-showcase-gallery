
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import VideoCard from '@/components/VideoCard';
import { useVideos } from '@/hooks/useVideos';

const Videos = () => {
  const { data: videos, isLoading, error } = useVideos();

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

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="flex flex-col space-y-2">
                <Skeleton className="aspect-video w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 mb-4">Error loading videos. Please try again later.</div>
            <Button 
              variant="netflix"
              onClick={() => window.location.reload()}
              className="px-4 py-2"
            >
              Retry
            </Button>
          </div>
        ) : videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-400 mb-4">No videos available in the database.</div>
            <p className="text-sm text-gray-500 max-w-md text-center">
              Add videos to the 'Videos' table in Supabase with Name, thumbnail_url, and video_url fields to display them here.
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Videos;
