import React, { useState } from 'react';
import { Play, Plus, ThumbsUp, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Project } from '@/data/projects';
import { CategoryItem } from '@/integrations/supabase/types/portfolio';
import { useNavigate } from 'react-router-dom';
import { 
  HoverCard,
  HoverCardTrigger,
  HoverCardContent
} from "@/components/ui/hover-card";

// Extend Project type to include categories and subtitle
interface ProjectProps {
  project: Project & { 
    categories?: CategoryItem[];
    subtitle?: string; 
  };
  className?: string;
}

const ProjectCard = ({ project, className = "" }: ProjectProps) => {
  const [showVideo, setShowVideo] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.videoUrl) {
      setShowVideo(true);
    }
  };

  const handleCardClick = () => {
    // Navigate to the product detail page instead of opening external link directly
    navigate(`/product/${project.id || 'detail'}`, { state: { project } });
  };

  // Convert Google Drive URL to a direct download URL if it's a Google Drive link
  const getProcessedImageUrl = (url: string) => {
    if (!url) return '/placeholder.svg';
    
    // Check if it's a Google Drive URL
    if (url.includes('drive.google.com') || url.includes('googleusercontent.com')) {
      // Extract the file ID
      let fileId = '';
      
      if (url.includes('id=')) {
        const idMatch = url.match(/[?&]id=([^&]+)/);
        if (idMatch && idMatch[1]) {
          fileId = idMatch[1];
        }
      } else if (url.includes('/d/')) {
        const parts = url.split('/d/');
        if (parts.length > 1) {
          fileId = parts[1].split('/')[0];
        }
      } else if (url.includes('drive.google.com/uc?export=view&id=')) {
        const idMatch = url.match(/id=([^&]+)/);
        if (idMatch && idMatch[1]) {
          fileId = idMatch[1];
        }
      }
      
      if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }
    
    return url;
  };

  return (
    <div className={`netflix-card h-[200px] relative group cursor-pointer w-full ${className}`} onClick={handleCardClick}>
      {showVideo && project.videoUrl ? (
        <div className="w-full h-full absolute top-0 left-0 z-20">
          {project.videoUrl.endsWith('.gif') ? (
            <img 
              src={project.videoUrl} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <video 
              src={project.videoUrl} 
              autoPlay 
              controls 
              className="w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          )}
          <button 
            className="absolute top-2 right-2 bg-netflix-dark/80 text-white p-1 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setShowVideo(false);
            }}
          >
            Close
          </button>
        </div>
      ) : (
        <>
          {imageError ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
              <ImageIcon className="w-12 h-12 text-gray-400" />
              <p className="text-sm text-gray-400 mt-2">Image unavailable</p>
            </div>
          ) : (
            <img 
              src={getProcessedImageUrl(project.image)} 
              alt={project.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </>
      )}
      
      {/* Gradient overlay always visible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-opacity duration-300"></div>
      
      {/* Always visible title and subtitle - left-aligned text */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        <h3 className="text-base font-bold mb-1 text-white">{project.title}</h3>
        {(project.subtitle || project.description) && (
          <p className="text-xs text-white/70 line-clamp-2 break-words">
            {project.subtitle || project.description}
          </p>
        )}
      </div>
      
      {/* Modified hover content - tags at top right and buttons at bottom */}
      <div className="netflix-card-content group-hover:opacity-100 flex flex-col justify-between h-full">
        {/* Tags at top right corner */}
        <div className="absolute top-2 right-2 z-20">
          <div className="flex flex-wrap gap-1 justify-end">
            {project.tags && project.tags.map((tag, index) => (
              <span key={index} className="text-xs bg-black/70 text-white px-1.5 py-0.5 rounded-sm">{tag}</span>
            ))}
          </div>
          
          {/* Categories shown on hover */}
          {project.categories && project.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1 justify-end">
              {project.categories.map((category) => (
                <span key={category.id} className="text-xs bg-white/30 px-1.5 py-0.5 rounded-sm">
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Action buttons at bottom */}
        <div className="flex items-center justify-between mt-2 px-3 pb-3">
          <div className="flex space-x-2">
            {project.videoUrl && (
              <button 
                className="w-8 h-8 rounded-full bg-white text-netflix-dark border border-netflix-gray/50 flex items-center justify-center hover:bg-white/90"
                onClick={handlePlayClick}
                title="Play preview"
              >
                <Play size={16} className="text-netflix-dark" />
              </button>
            )}
            <button 
              className="w-8 h-8 rounded-full bg-netflix-dark border border-netflix-gray/50 flex items-center justify-center hover:border-white"
              title="Add to My List"
            >
              <Plus size={16} className="text-white" />
            </button>
            <button 
              className="w-8 h-8 rounded-full bg-netflix-dark border border-netflix-gray/50 flex items-center justify-center hover:border-white"
              title="Like"
            >
              <ThumbsUp size={16} className="text-white" />
            </button>
          </div>
          
          {project.productLink && (
            <button 
              className="w-8 h-8 rounded-full bg-netflix-dark border border-netflix-gray/50 flex items-center justify-center hover:border-white"
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.productLink, '_blank');
              }}
              title="Visit Project"
            >
              <ExternalLink size={16} className="text-white" />
            </button>
          )}
        </div>
      </div>
      
      {/* Enhanced hover effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 -bottom-[80px] -left-[10px] -right-[10px] top-[-10px] pointer-events-none bg-transparent shadow-xl z-0">
        {/* This creates the expanded card effect that Netflix has */}
      </div>
    </div>
  );
};

export default ProjectCard;
