
import React, { useState } from 'react';
import { Play, Plus, ThumbsUp, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Project } from '@/data/projects';

interface ProjectProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectProps) => {
  const [showVideo, setShowVideo] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handlePlayClick = () => {
    if (project.videoUrl) {
      setShowVideo(true);
    }
  };

  const handleCardClick = () => {
    if (project.productLink) {
      window.open(project.productLink, '_blank');
    }
  };

  // Convert Google Drive URL to a direct download URL if it's a Google Drive link
  const getProcessedImageUrl = (url: string) => {
    if (!url) return '/placeholder.svg';
    
    // Check if it's a Google Drive URL
    if (url.includes('drive.google.com') || url.includes('googleusercontent.com')) {
      // Extract the file ID
      let fileId = '';
      
      if (url.includes('id=')) {
        // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
        // or: https://drive.google.com/open?id=FILE_ID
        const idMatch = url.match(/[?&]id=([^&]+)/);
        if (idMatch && idMatch[1]) {
          fileId = idMatch[1];
        }
      } else if (url.includes('/d/')) {
        // Format: https://drive.google.com/file/d/FILE_ID/view
        const parts = url.split('/d/');
        if (parts.length > 1) {
          fileId = parts[1].split('/')[0];
        }
      } else if (url.includes('drive.google.com/uc?export=view&id=')) {
        // Format: https://drive.google.com/uc?export=view&id=FILE_ID
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
    <div className="netflix-card min-w-[250px] sm:min-w-[280px] md:min-w-[300px] h-[170px] relative">
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
            onClick={() => setShowVideo(false)}
          >
            Close
          </button>
        </div>
      ) : (
        <>
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
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
      
      <div className="netflix-card-content">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">{project.title}</h3>
          <div className="flex space-x-2">
            {project.videoUrl && (
              <button 
                className="w-8 h-8 rounded-full bg-netflix-dark border border-netflix-gray/50 flex items-center justify-center hover:border-white"
                onClick={handlePlayClick}
                title="Play preview"
              >
                <Play size={16} className="text-white" />
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
            {project.productLink && (
              <button 
                className="w-8 h-8 rounded-full bg-netflix-dark border border-netflix-gray/50 flex items-center justify-center hover:border-white"
                onClick={handleCardClick}
                title="Visit Project"
              >
                <ExternalLink size={16} className="text-white" />
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {project.tags.map((tag, index) => (
            <span key={index} className="text-xs text-white/80">{tag}{index !== project.tags.length - 1 && ' • '}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
