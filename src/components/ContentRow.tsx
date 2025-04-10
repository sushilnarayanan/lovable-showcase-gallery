
import React, { useRef, useState, useEffect } from 'react';
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to determine if we can scroll left or right
  const checkScrollPosition = () => {
    if (rowRef.current) {
      const { current } = rowRef;
      setCanScrollLeft(current.scrollLeft > 0);
      setCanScrollRight(current.scrollLeft < current.scrollWidth - current.clientWidth - 5); // 5px buffer
    }
  };

  useEffect(() => {
    const scrollContainer = rowRef.current;
    if (scrollContainer) {
      // Initial check
      checkScrollPosition();
      // Add scroll event listener
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      // Clean up
      return () => scrollContainer.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  // Also update when content changes (when items load)
  useEffect(() => {
    checkScrollPosition();
  }, [productItems, projects]);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { current } = rowRef;
      const scrollAmount = direction === 'left' 
        ? current.scrollLeft - current.clientWidth * 0.75
        : current.scrollLeft + current.clientWidth * 0.75;
      
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
    <div className="netflix-row mb-8"> {/* Consistent bottom margin */}
      {/* Title - properly aligned with consistent left padding */}
      <h2 className="text-2xl font-bold mb-3 text-white px-4 sm:px-8 md:px-12 lg:px-16">{title}</h2>
      <div className="group relative">
        {/* Left Navigation Button - only shown when we can scroll left */}
        {canScrollLeft && (
          <button 
            className="absolute left-0 top-0 bottom-0 z-40 bg-black/80 w-12 h-full flex items-center justify-center transition-opacity"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft className="text-white w-8 h-8" />
          </button>
        )}
        
        <div 
          ref={rowRef}
          className="flex space-x-4 overflow-x-scroll py-4 px-4 sm:px-8 md:px-12 lg:px-16 netflix-scrollbar"
        >
          {displayItems.length > 0 ? (
            displayItems.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-[200px] text-gray-400 bg-gray-800/30 rounded p-4">
              No items in this category yet
              {categorySlug && (
                <button 
                  onClick={assignToCategory}
                  className="ml-2 text-sm bg-netflix-red hover:bg-netflix-red/90 text-white px-3 py-1 rounded-md flex items-center"
                >
                  <RefreshCcw size={16} className="mr-1" /> Assign
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Right Navigation Button - only shown when we can scroll right */}
        {canScrollRight && (
          <button 
            className="absolute right-0 top-0 bottom-0 z-40 bg-black/80 w-12 h-full flex items-center justify-center transition-opacity"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight className="text-white w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ContentRow;
