import React from 'react';
import { webApps, designProjects } from '@/data/projects';
import CategoryRow from '@/components/CategoryRow';
import FallbackContent from '@/components/FallbackContent';
import { ProductItem } from '@/integrations/supabase/types/portfolio';

interface PageContentProps {
  productItems?: ProductItem[];
  exitItems?: ProductItem[];
  featuredProductItems?: ProductItem[];
  vibedCodedItems?: ProductItem[];
  microSaasItems?: ProductItem[];
  noCodeItems?: ProductItem[];
  productsLoading: boolean;
  productsError?: unknown;
  categoriesLoading: boolean;
  microSaasLoading: boolean;
  noCodeLoading: boolean;
  refreshCategories: () => void;
}

const PageContent: React.FC<PageContentProps> = ({
  productItems,
  exitItems,
  featuredProductItems,
  vibedCodedItems,
  microSaasItems,
  noCodeItems,
  productsLoading,
  productsError,
  categoriesLoading,
  microSaasLoading,
  noCodeLoading,
  refreshCategories
}) => {
  const showAllProducts = !productsLoading && !productsError && productItems && productItems.length > 0;
  const showFallbackContent = productsLoading || categoriesLoading || (productItems?.length === 0);

  return (
    <div className="pb-4 w-full mt-4" id="products">
      {/* All Products */}
      {showAllProducts && <CategoryRow title="All Products" productItems={productItems} />}
      
      {/* Exit Category */}
      {!productsLoading && !productsError && exitItems && exitItems.length > 0 && (
        <CategoryRow title="Exit" productItems={exitItems} />
      )}
      
      {/* Other Categories */}
      {!productsLoading && !productsError && (
        <>
          {/* Featured Products */}
          {featuredProductItems && featuredProductItems.length > 0 && (
            <CategoryRow title="Featured Products" productItems={featuredProductItems} />
          )}
          
          {/* Vibe-coded Products */}
          {vibedCodedItems && vibedCodedItems.length > 0 && (
            <CategoryRow title="Vibe-coded" productItems={vibedCodedItems} />
          )}
          
          {/* MicroSaaS Products */}
          <CategoryRow 
            title="MicroSaaS" 
            productItems={microSaasItems} 
            projects={microSaasItems && microSaasItems.length === 0 ? webApps : undefined}
            categorySlug="microsaas"
            isLoading={microSaasLoading}
            onRefresh={refreshCategories}
            showRefreshButton={microSaasItems?.length === 0}
          />
          
          {/* NoCode Products */}
          <CategoryRow 
            title="NoCode" 
            productItems={noCodeItems} 
            projects={noCodeItems && noCodeItems.length === 0 ? designProjects : undefined}
            categorySlug="nocode"
            isLoading={noCodeLoading}
            onRefresh={refreshCategories}
            showRefreshButton={noCodeItems?.length === 0}
          />
        </>
      )}
      
      {/* Fallback Content */}
      {showFallbackContent && <FallbackContent />}
    </div>
  );
};

export default PageContent;
