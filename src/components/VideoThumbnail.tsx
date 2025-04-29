
import React, { useState } from 'react';
import { FileImage } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoThumbnailProps {
  src: string | null;
  alt: string;
}

const VideoThumbnail = ({ src, alt }: VideoThumbnailProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [attemptedHttps, setAttemptedHttps] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  
  // Log thumbnail source for debugging
  console.log(`Rendering thumbnail for ${alt}:`, src);
  
  // Try alternate protocol if original fails
  const tryAlternateProtocol = (originalSrc: string | null) => {
    if (!originalSrc || attemptedHttps) return;
    
    // If URL started with https, try http instead, or vice versa
    let newSrc: string | null = null;
    if (originalSrc.startsWith('https://')) {
      newSrc = originalSrc.replace('https://', 'http://');
    } else if (originalSrc.startsWith('http://')) {
      newSrc = originalSrc.replace('http://', 'https://');
    }
    
    if (newSrc) {
      console.log(`Attempting alternate protocol for ${alt}:`, newSrc);
      setCurrentSrc(newSrc);
      setAttemptedHttps(true);
      setHasError(false);
      setIsLoading(true);
    } else {
      setHasError(true);
    }
  };
  
  if (!currentSrc || hasError) {
    return (
      <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center">
        <FileImage size={48} className="text-gray-500 mb-2" />
        <span className="text-gray-400 text-sm">No thumbnail</span>
      </div>
    );
  }

  return (
    <>
      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={(e) => {
          console.error(`Failed to load thumbnail: ${currentSrc}`);
          if (!attemptedHttps) {
            tryAlternateProtocol(currentSrc);
          } else {
            setHasError(true);
          }
        }}
        onLoad={() => {
          console.log(`Successfully loaded thumbnail: ${currentSrc}`);
          setIsLoading(false);
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <Skeleton className="w-full h-full absolute" />
        </div>
      )}
    </>
  );
};

export default VideoThumbnail;
