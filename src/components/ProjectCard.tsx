
import React from 'react';
import { Play, Plus, ThumbsUp } from 'lucide-react';

interface ProjectProps {
  project: {
    id: number;
    title: string;
    image: string;
    description: string;
    tags: string[];
  };
}

const ProjectCard = ({ project }: ProjectProps) => {
  return (
    <div className="netflix-card min-w-[250px] sm:min-w-[280px] md:min-w-[300px] h-[170px]">
      <img 
        src={project.image} 
        alt={project.title}
        className="w-full h-full object-cover"
      />
      <div className="netflix-card-content">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">{project.title}</h3>
          <div className="flex space-x-2">
            <button className="w-8 h-8 rounded-full bg-netflix-dark border border-netflix-gray/50 flex items-center justify-center hover:border-white">
              <Play size={16} className="text-white" />
            </button>
            <button className="w-8 h-8 rounded-full bg-netflix-dark border border-netflix-gray/50 flex items-center justify-center hover:border-white">
              <Plus size={16} className="text-white" />
            </button>
            <button className="w-8 h-8 rounded-full bg-netflix-dark border border-netflix-gray/50 flex items-center justify-center hover:border-white">
              <ThumbsUp size={16} className="text-white" />
            </button>
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
