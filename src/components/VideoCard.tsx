
import React from 'react';
import { ExternalLink, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import VideoThumbnail from "./VideoThumbnail";
import { type Video } from "@/hooks/useVideos";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface VideoCardProps {
  video: Video;
}

const VideoCard = ({ video }: VideoCardProps) => {
  // Debug video data
  console.log(`Rendering video card:`, {
    id: video.id,
    name: video.Name,
    thumbnail: video.thumbnail_url,
    videoUrl: video.video_url
  });

  // Format video URL to ensure it has a protocol
  const formattedVideoUrl = video.video_url;

  return (
    <Card className="group overflow-hidden bg-netflix-card border-gray-800 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-gray-600">
      <div className="relative aspect-video">
        <a
          href={formattedVideoUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
          <div className="relative h-full">
            <VideoThumbnail 
              src={video.thumbnail_url} 
              alt={video.Name || 'Video thumbnail'} 
            />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="p-3 bg-red-600 rounded-full transform scale-90 group-hover:scale-100 transition-transform">
              <Play size={24} className="text-white" />
            </div>
          </div>
        </a>
      </div>
      <CardContent className="p-4">
        <HoverCard>
          <HoverCardTrigger asChild>
            <a
              href={formattedVideoUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-red-400 transition-colors block"
            >
              <h3 className="text-lg font-medium line-clamp-2">
                {video.Name || 'Untitled Video'}
              </h3>
            </a>
          </HoverCardTrigger>
          <HoverCardContent className="bg-netflix-dark border-gray-700 text-white">
            {video.Name}
          </HoverCardContent>
        </HoverCard>
        <div className="flex items-center mt-2 justify-between">
          <span className="text-sm text-gray-400">
            {new Date(video.created_at).toLocaleDateString()}
          </span>
          {formattedVideoUrl && (
            <a
              href={formattedVideoUrl}
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

export default VideoCard;
