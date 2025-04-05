
import React, { useState } from 'react';
import { Play, Plus, ThumbsUp, ExternalLink } from 'lucide-react';
import { Project } from '@/data/projects';

interface ProjectProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectProps) => {
  const [showVideo, setShowVideo] = useState(false);

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
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover"
        />
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
