
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ContentRow from '@/components/ContentRow';
import Footer from '@/components/Footer';
import { featuredProjects, webApps, designProjects, experiments } from '@/data/projects';
import { 
  useProductData, 
  useCategoryData, 
  useProductsByCategory, 
  useProductsByCategoryId 
} from '@/hooks/usePortfolio';

const Index = () => {
  const { data: productItems, isLoading: productsLoading, error: productsError } = useProductData();
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategoryData();
  
  // Get featured products using the category slug
  const { data: featuredProductItems } = useProductsByCategory('featured-products');
  const { data: vibedCodedItems } = useProductsByCategory('vibe-coded');
  
  // Use specific category IDs for MicroSaaS (2) and NoCode (6)
  const { data: microSaasItems } = useProductsByCategoryId(2);
  const { data: noCodeItems } = useProductsByCategoryId(6);

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar />
      <Hero />
      
      <div className="pt-8 pb-16">
        {/* Display products from Supabase if available */}
        {!productsLoading && !productsError && productItems && productItems.length > 0 && (
          <ContentRow title="All Products" productItems={productItems} />
        )}
        
        {/* Display category-specific products */}
        {!productsLoading && !productsError && (
          <>
            {featuredProductItems && featuredProductItems.length > 0 && (
              <ContentRow title="Featured Products" productItems={featuredProductItems} />
            )}
            
            {vibedCodedItems && vibedCodedItems.length > 0 && (
              <ContentRow title="Vibe-coded" productItems={vibedCodedItems} />
            )}
            
            {/* Display MicroSaaS items (category ID 2) */}
            <ContentRow 
              title="MicroSaaS" 
              productItems={microSaasItems || []} 
              projects={microSaasItems && microSaasItems.length === 0 ? webApps : undefined} 
            />
            
            {/* Display NoCode items (category ID 6) */}
            <ContentRow 
              title="NoCode" 
              productItems={noCodeItems || []} 
              projects={noCodeItems && noCodeItems.length === 0 ? designProjects : undefined} 
            />
          </>
        )}
        
        {/* Keep existing content rows as fallback */}
        {(productsLoading || categoriesLoading || productItems?.length === 0) && (
          <>
            <ContentRow title="Featured Projects" projects={featuredProjects} />
            <ContentRow title="Web Applications" projects={webApps} />
            <ContentRow title="Design Projects" projects={designProjects} />
            <ContentRow title="Experiments" projects={experiments} />
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
