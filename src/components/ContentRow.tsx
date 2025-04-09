
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { Project } from '@/data/projects';
import { ProductItem } from '@/integrations/supabase/types/portfolio';

interface ContentRowProps {
  title: string;
  projects?: Project[];
  productItems?: ProductItem[];
  categorySlug?: string;
}

const ContentRow = ({ title, projects, productItems, categorySlug }: ContentRowProps) => {
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
        id: item.id,
        title: item.title,
        subtitle: item.description || '', // Add subtitle from description
        description: item.description || '',
        image: item.thumbnail_url || '/placeholder.svg',
        videoUrl: item.product_video || undefined,
        tags: item.tags || [],
        productLink: item.product_link || undefined,
        categories: item.categories || [],
      }))
    : projects || [];

  return (
    <div className="netflix-row px-[60px] mt-[2vw]">
      <h2 className="text-[1.4vw] text-white font-medium mb-2">{title}</h2>
      <div className="group relative">
        <button 
          className="absolute left-0 top-0 bottom-0 z-40 bg-black/50 w-12 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="text-white" size={24} />
        </button>
        
        <div 
          ref={rowRef}
          className="flex gap-1 overflow-x-scroll scrollbar-hide pb-8 pt-1 netflix-scrollbar"
        >
          {displayItems.length > 0 ? (
            displayItems.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-[130px] text-gray-400 bg-[#181818] rounded p-4">
              No items in this category yet
            </div>
          )}
        </div>
        
        <button 
          className="absolute right-0 top-0 bottom-0 z-40 bg-black/50 w-12 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="text-white" size={24} />
        </button>
      </div>
    </div>
  );
};

export default ContentRow;
