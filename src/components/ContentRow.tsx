
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, RefreshCcw } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { Project } from '@/data/projects';
import { ProductItem } from '@/integrations/supabase/types/portfolio';
import { assignProductsToCategory } from '@/utils/categoryAssigner';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface ContentRowProps {
  title: string;
  projects?: Project[];
  productItems?: ProductItem[];
  categorySlug?: string;
}

const ContentRow = ({ title, projects, productItems, categorySlug }: ContentRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

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

  // Function to handle assigning specific products to categories from the UI
  const assignToCategory = async () => {
    if (!categorySlug) return;
    
    let productIds: number[] = [];
    
    if (categorySlug === 'microsaas') {
      productIds = [1, 9, 13, 14, 16];
    } else if (categorySlug === 'nocode') {
      productIds = [2, 3, 7, 11];
    }
    
    if (productIds.length === 0) return;
    
    try {
      toast({
        title: 'Assigning products',
        description: `Assigning products to ${title} category...`,
      });
      
      const success = await assignProductsToCategory(productIds, categorySlug);
      
      if (success) {
        toast({
          title: 'Success',
          description: `Products assigned to ${title} category successfully!`,
        });
        
        // Invalidate queries to trigger refetch
        queryClient.invalidateQueries({
          queryKey: ['products', 'category', categorySlug],
        });
      } else {
        toast({
          title: 'Error',
          description: `Failed to assign products to ${title} category`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error assigning products:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign products to category',
        variant: 'destructive',
      });
    }
  };

  // Convert portfolio items to project format if provided
  const displayItems = productItems 
    ? productItems.map(item => ({
        id: String(item.id),
        title: item.title,
        subtitle: item.description || '', 
        description: item.description || '',
        image: item.thumbnail_url || '/placeholder.svg',
        videoUrl: item.product_video || undefined,
        tags: item.tags || [],
        productLink: item.product_link || undefined,
        categories: item.categories || [],
        showTitleByDefault: true
      }))
    : projects || [];

  return (
    <div className="netflix-row mb-8">
      <h2 className="text-xl font-medium mb-3 pl-4 md:pl-6 lg:pl-0 text-white">{title}</h2>
      <div className="group relative">
        <button 
          className="absolute left-0 top-0 bottom-0 z-40 bg-black/50 w-12 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="text-white" size={24} />
        </button>
        
        <div 
          ref={rowRef}
          className="flex space-x-4 overflow-x-scroll py-4 pl-4 md:pl-6 lg:pl-0 netflix-scrollbar"
        >
          {displayItems.length > 0 ? (
            displayItems.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-[170px] text-gray-400 bg-gray-800/30 rounded p-4">
              No items in this category yet
              {categorySlug && (
                <button 
                  onClick={assignToCategory}
                  className="ml-2 text-sm bg-netflix-red hover:bg-netflix-red/80 text-white px-3 py-1 rounded-md flex items-center"
                >
                  <RefreshCcw size={16} className="mr-1" /> Assign
                </button>
              )}
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
