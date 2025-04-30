
import React from 'react';
import ContentRow from '@/components/ContentRow';
import { ProductItem } from '@/integrations/supabase/types/portfolio';
import { Project } from '@/data/projects';

interface CategoryRowProps {
  title: string;
  productItems?: ProductItem[];
  projects?: Project[];
  categorySlug?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  showRefreshButton?: boolean;
}

const CategoryRow = ({
  title,
  productItems,
  projects,
  categorySlug,
  isLoading,
  onRefresh,
  showRefreshButton = false
}: CategoryRowProps) => {
  if (isLoading) {
    return <div className="py-4 pl-12 lg:pl-16 text-left">Loading {title} products...</div>;
  }

  return (
    <div className="relative">
      <ContentRow 
        title={title} 
        productItems={productItems || []} 
        projects={projects}
        categorySlug={categorySlug}
      />
      
      {showRefreshButton && onRefresh && (
        <button 
          onClick={onRefresh}
          className="absolute right-16 top-0 text-sm text-blue-400 hover:text-blue-300"
        >
          Refresh
        </button>
      )}
    </div>
  );
};

export default CategoryRow;
