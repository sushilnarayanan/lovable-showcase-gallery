
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { Project } from '@/data/projects';
import { ProductItem } from '@/integrations/supabase/types/portfolio';

interface ContentRowProps {
  title: string;
  projects?: Project[];
  productItems?: ProductItem[];
}

const ContentRow = ({ title, projects, productItems }: ContentRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { current } = rowRef;
      const scrollAmount = direction === 'left' 
        ? current.scrollLeft - current.clientWidth
        : current.scrollLeft + current.clientWidth;
      
      current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Convert portfolio items to project format if provided
  const displayItems = productItems 
    ? productItems.map(item => ({
        id: String(item.id),
        title: item.title,
        subtitle: item.description || '', // Use description instead of sub_title
        description: item.description || '',
        image: item.thumbnail_url || '/placeholder.svg',
        videoUrl: item.product_video || undefined,
        tags: item.tags || [],
        productLink: item.product_link || undefined,
        showTitleByDefault: true // Add this flag to show title by default
      }))
    : projects || [];

  return (
    <div className="netflix-row">
      <h2 className="text-xl font-medium mb-2 pl-4">{title}</h2>
      <div className="group relative">
        <button 
          className="absolute left-0 top-0 bottom-0 z-40 bg-netflix-black/50 w-12 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="text-white" size={24} />
        </button>
        
        <div 
          ref={rowRef}
          className="flex space-x-2 overflow-x-scroll scrollbar-hide py-4 pl-4 netflix-scrollbar"
        >
          {displayItems.length > 0 ? (
            displayItems.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-[170px] text-gray-400">
              No items in this category yet
            </div>
          )}
        </div>
        
        <button 
          className="absolute right-0 top-0 bottom-0 z-40 bg-netflix-black/50 w-12 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="text-white" size={24} />
        </button>
      </div>
    </div>
  );
};

export default ContentRow;
