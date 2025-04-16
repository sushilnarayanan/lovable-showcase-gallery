
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink, Github } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProductHeroProps {
  videoUrl?: string | null;
  image?: string | null;
  isVideoPlaying: boolean;
  setIsVideoPlaying: (playing: boolean) => void;
  title: string;
  description: string;
  productLink?: string | null;
  github_link?: string | null;
  tags?: string[] | null;
}

const ProductHero = ({
  videoUrl,
  image,
  isVideoPlaying,
  setIsVideoPlaying,
  title,
  description,
  productLink,
  github_link,
  tags
}: ProductHeroProps) => {
  const handlePlayVideo = () => {
    if (videoUrl) {
      setIsVideoPlaying(true);
    } else {
      toast({
        title: "No Video Available",
        description: "This project doesn't have a video preview.",
      });
    }
  };

  return (
    <div className="relative w-full h-[50vh] lg:h-[60vh] overflow-hidden">
      {isVideoPlaying && videoUrl ? (
        <div className="absolute inset-0 bg-black z-40">
          <div className="relative w-full h-full">
            <Button 
              className="absolute top-4 right-4 z-50 bg-black/70 hover:bg-black/90 border border-netflix-red/30 text-white" 
              onClick={() => setIsVideoPlaying(false)}
            >
              Close
            </Button>
            <video 
              src={videoUrl} 
              className="w-full h-full object-contain"
              controls
              autoPlay
            />
          </div>
        </div>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-10"></div>
          <img 
            src={image || '/placeholder.svg'} 
            alt={title}
            className="w-full h-full object-cover brightness-75" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-20" />
        </>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 to-transparent py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-netflix-red text-sm font-medium tracking-wider block mb-2">FEATURED PROJECT</span>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white break-words">{title}</h1>
          
          <p className="text-lg text-gray-300 mb-6 max-w-2xl font-medium break-words">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-3 mb-4">
            {videoUrl && (
              <Button 
                variant="netflix"
                className="font-medium flex-grow sm:flex-grow-0" 
                onClick={handlePlayVideo}
              >
                <Play size={18} className="mr-2" />
                Watch Demo
              </Button>
            )}
            
            {productLink && (
              <Button
                variant="netflixOutline"
                className="border-netflix-red flex-grow sm:flex-grow-0" 
                onClick={() => window.open(productLink, '_blank')}
              >
                <ExternalLink size={18} className="mr-2" />
                Visit Project
              </Button>
            )}
            
            {github_link && (
              <Button
                variant="netflixOutline"
                className="border-netflix-red flex-grow sm:flex-grow-0" 
                onClick={() => window.open(github_link, '_blank')}
              >
                <Github size={18} className="mr-2" />
                View Code
              </Button>
            )}
          </div>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-netflix-red/20 text-white border border-netflix-red/30 rounded-md text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductHero;
