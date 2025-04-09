
import React, { useState } from 'react';
import { Play, Plus, ThumbsUp, Info, Image as ImageIcon } from 'lucide-react';
import { Project } from '@/data/projects';
import { CategoryItem } from '@/integrations/supabase/types/portfolio';
import { useNavigate } from 'react-router-dom';

// Extend Project type to include categories and subtitle
interface ProjectProps {
  project: Project & { 
    categories?: CategoryItem[];
    subtitle?: string; 
  };
}

const ProjectCard = ({ project }: ProjectProps) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${project.id || 'detail'}`, { state: { project } });
  };

  // Process image URL if needed
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
    <div 
      className="netflix-card relative min-w-[16.5%] aspect-video cursor-pointer transition-transform duration-300 ease-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {imageError ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      ) : (
        <img 
          src={getProcessedImageUrl(project.image)} 
          alt={project.title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}

      {/* Netflix badging */}
      {project.tags?.includes('new') && (
        <div className="absolute top-0 right-0 bg-netflix-red text-white text-xs font-bold py-0.5 px-2">
          NEW
        </div>
      )}
      
      {/* Episode badge - show if it's in the format "Episode X" */}
      {project.description?.toLowerCase().includes('episode') && (
        <div className="absolute bottom-0 left-0 bg-netflix-red text-white text-xs font-bold py-0.5 px-2">
          New Episode
        </div>
      )}
      
      {/* Watch Now badge */}
      {project.productLink && (
        <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs font-bold py-0.5 px-2">
          Watch Now
        </div>
      )}
      
      {/* Hover state with extra information */}
      {isHovered && (
        <div className="absolute -top-1/3 left-0 right-0 bottom-0 bg-zinc-800 z-10 rounded shadow-xl scale-125 origin-bottom">
          <img 
            src={getProcessedImageUrl(project.image)} 
            alt={project.title}
            className="w-full aspect-video object-cover rounded-t"
            onError={() => setImageError(true)}
          />
          
          <div className="p-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <button className="bg-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200">
                  <Play size={18} className="text-black" />
                </button>
                <button className="border border-gray-400 rounded-full w-8 h-8 flex items-center justify-center hover:border-white">
                  <Plus size={18} className="text-white" />
                </button>
                <button className="border border-gray-400 rounded-full w-8 h-8 flex items-center justify-center hover:border-white">
                  <ThumbsUp size={18} className="text-white" />
                </button>
              </div>
              
              <button className="border border-gray-400 rounded-full w-8 h-8 flex items-center justify-center hover:border-white">
                <Info size={18} className="text-white" />
              </button>
            </div>
            
            <h3 className="text-white font-medium text-sm mb-1">{project.title}</h3>
            
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-green-500 font-bold text-xs">98% Match</span>
              <span className="text-xs border border-gray-500 px-1">16+</span>
              <span className="text-xs text-gray-400">1 Season</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {project.tags && project.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs text-gray-300">
                  {index > 0 && <span className="mx-1 text-gray-500">•</span>}
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
