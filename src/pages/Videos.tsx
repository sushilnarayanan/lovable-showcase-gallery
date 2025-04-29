
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';
import { ExternalLink, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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
    <Card className="group overflow-hidden bg-netflix-card border-gray-800 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-gray-600">
      <div className="relative aspect-video">
        <a
          href={video.video || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
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
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="p-3 bg-red-600 rounded-full">
              <Play size={24} className="text-white" />
            </div>
          </div>
        </a>
      </div>
      <CardContent className="p-4">
        <a
          href={video.video || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-red-400 transition-colors"
        >
          <h3 className="text-lg font-medium line-clamp-2">
            {video.Name || 'Untitled Video'}
          </h3>
        </a>
        <div className="flex items-center mt-2 justify-between">
          <span className="text-sm text-gray-400">
            {new Date(video.created_at).toLocaleDateString()}
          </span>
          {video.video && (
            <a
              href={video.video}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-400 hover:text-blue-300"
            >
              <ExternalLink size={14} className="mr-1" />
              Watch
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

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
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
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
              Add videos to the 'Videos' table in Supabase with Name, thumbnail URL, and video URL fields to display them here.
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Videos;
