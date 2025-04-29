
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';
import { ExternalLink } from "lucide-react";

// Define the Video type based on our database schema
type Video = {
  id: number;
  Name: string | null;
  thumbnail: string | null;
  video: string | null;
  created_at: string;
};

// Custom hook to fetch videos from the database
const useVideos = () => {
  return useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      // Log the start of the query for debugging
      console.log('Fetching videos from Supabase...');

      const { data, error } = await supabase
        .from('Videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching videos:', error);
        toast({
          title: 'Error loading videos',
          description: 'Please try refreshing the page',
          variant: 'destructive',
        });
        throw error;
      }

      console.log('Videos data received:', data);
      return data as Video[];
    },
  });
};

const VideoCard = ({ video }: { video: Video }) => {
  return (
    <div className="flex flex-col bg-netflix-card rounded-md overflow-hidden hover:scale-105 transition-transform duration-200">
      <div className="relative aspect-video">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.Name || 'Video thumbnail'}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error(`Failed to load thumbnail: ${video.thumbnail}`);
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-400">No thumbnail</span>
          </div>
        )}
        {video.video && (
          <a
            href={video.video}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity"
          >
            <div className="p-2 bg-red-600 rounded-full">
              <ExternalLink size={24} className="text-white" />
            </div>
          </a>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-white">
          {video.Name || 'Untitled Video'}
        </h3>
        {video.video && (
          <a
            href={video.video}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-blue-400 hover:text-blue-300"
          >
            Watch Video
          </a>
        )}
      </div>
    </div>
  );
};

const Videos = () => {
  const { data: videos, isLoading, error } = useVideos();

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar />
      
      {/* Header section with proper spacing for navbar */}
      <div className="pt-24 px-4 sm:px-8 md:px-12 lg:px-16 pb-16">
        <h1 className="text-4xl font-bold text-white mb-2">Videos</h1>
        <p className="text-gray-400 mb-8">
          A collection of videos about tech, AI, and more.
        </p>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-white">Loading videos...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center py-12">
            <div className="text-red-500">Error loading videos. Please try again later.</div>
          </div>
        ) : videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center py-12">
            <div className="text-gray-400">No videos available.</div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Videos;
