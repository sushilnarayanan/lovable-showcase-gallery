
import React, { useEffect } from 'react';
import { useVideos } from '@/hooks/useVideos';
import VideoCard from '@/components/VideoCard';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useQueryClient } from '@tanstack/react-query';

const VideoGallery = () => {
  const queryClient = useQueryClient();
  const { data: videos, isLoading, error, refetch } = useVideos();
  
  // Invalidate videos query on component mount to ensure fresh data
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['videos'] });
  }, [queryClient]);
  
  console.log("VideoGallery rendering with data:", videos);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, idx) => (
          <div key={idx} className="flex flex-col space-y-2">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    console.error("Error in VideoGallery:", error);
    return (
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
    );
  }
  
  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-400 mb-4">No videos available in the database.</div>
        <p className="text-sm text-gray-500 max-w-md text-center">
          Add videos to the 'video_page' table in Supabase with name, thumbnail_url, and video_url fields to display them here.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};

export default VideoGallery;
