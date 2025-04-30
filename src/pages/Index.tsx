import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ContentRow from '@/components/ContentRow';
import Footer from '@/components/Footer';
import { featuredProjects, webApps, designProjects, experiments } from '@/data/projects';
import { 
  useProductData, 
  useCategoryData, 
  useProductsByCategory
} from '@/hooks/usePortfolio';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { data: productItems, isLoading: productsLoading, error: productsError } = useProductData();
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategoryData();
  
  const [refreshKey, setRefreshKey] = useState(0); // Add a state for triggering refetches
  
  // Add query for exit category
  const { data: exitItems } = useProductsByCategory('exit');
  // Use category slug instead of ID for better reliability
  const { data: featuredProductItems } = useProductsByCategory('featured-products');
  const { data: vibedCodedItems } = useProductsByCategory('vibe-coded');
  
  const { 
    data: microSaasItems, 
    isLoading: microSaasLoading, 
    error: microSaasError, 
    refetch: refetchMicroSaas 
  } = useProductsByCategory('microsaas', refreshKey);
  
  const { 
    data: noCodeItems, 
    isLoading: noCodeLoading, 
    error: noCodeError, 
    refetch: refetchNoCode 
  } = useProductsByCategory('nocode', refreshKey);

  // Function to refresh all category data
  const refreshCategories = () => {
    setRefreshKey(prevKey => prevKey + 1);
    refetchMicroSaas();
    refetchNoCode();
  };
  
  // Show any errors that might be preventing data from loading
  useEffect(() => {
    if (microSaasError) {
      console.error('MicroSaaS loading error:', microSaasError);
      toast({
        title: 'Error loading MicroSaaS products',
        description: 'Please try refreshing the page',
        variant: 'destructive'
      });
    }
    
    if (noCodeError) {
      console.error('NoCode loading error:', noCodeError);
      toast({
        title: 'Error loading NoCode products',
        description: 'Please try refreshing the page',
        variant: 'destructive'
      });
    }
  }, [microSaasError, noCodeError]);

  // Check for existence of categories and create them if missing
  useEffect(() => {
    const ensureCategories = async () => {
      try {
        // Check if microsaas category exists
        const { data: microsaasCategory } = await supabase
          .from('Categories')
          .select('id')
          .eq('slug', 'microsaas')
          .maybeSingle();
          
        if (!microsaasCategory) {
          await supabase
            .from('Categories')
            .insert({
              name: 'MicroSaaS',
              slug: 'microsaas',
              description: 'MicroSaaS products'
            });
          console.log('Created MicroSaaS category');
        }
        
        // Check if nocode category exists
        const { data: nocodeCategory } = await supabase
          .from('Categories')
          .select('id')
          .eq('slug', 'nocode')
          .maybeSingle();
          
        if (!nocodeCategory) {
          await supabase
            .from('Categories')
            .insert({
              name: 'NoCode',
              slug: 'nocode',
              description: 'NoCode products'
            });
          console.log('Created NoCode category');
        }
        
        // Refresh data if we created categories
        if (!microsaasCategory || !nocodeCategory) {
          refreshCategories();
        }
      } catch (error) {
        console.error('Error ensuring categories exist:', error);
      }
    };
    
    ensureCategories();
  }, []);

  return (
    <div className="min-h-screen bg-netflix-background overflow-x-hidden w-full">
      <Navbar />
      <Hero />
      
      {/* Added consistent spacing class to ensure proper gap between hero and content */}
      <div className="pb-4 w-full mt-4">
        {/* Reordered content rows: All Products first, then Exit, then others */}
        
        {/* Display products from Supabase if available - full-width container */}
        {!productsLoading && !productsError && productItems && productItems.length > 0 && (
          <ContentRow title="All Products" productItems={productItems} />
        )}
        
        {/* Display Exit category second */}
        {!productsLoading && !productsError && exitItems && exitItems.length > 0 && (
          <ContentRow title="Exit" productItems={exitItems} />
        )}
        
        {/* Display other category-specific products */}
        {!productsLoading && !productsError && (
          <>
            {featuredProductItems && featuredProductItems.length > 0 && (
              <ContentRow title="Featured Products" productItems={featuredProductItems} />
            )}
            
            {vibedCodedItems && vibedCodedItems.length > 0 && (
              <ContentRow title="Vibe-coded" productItems={vibedCodedItems} />
            )}
            
            {/* Display MicroSaaS items with refresh button */}
            <div className="relative">
              {microSaasLoading ? (
                <div className="py-4 pl-12 lg:pl-16 text-left">Loading MicroSaaS products...</div>
              ) : (
                <ContentRow 
                  title="MicroSaaS" 
                  productItems={microSaasItems || []} 
                  projects={microSaasItems && microSaasItems.length === 0 ? webApps : undefined} 
                  categorySlug="microsaas"
                />
              )}
              {microSaasItems?.length === 0 && (
                <button 
                  onClick={refreshCategories}
                  className="absolute right-16 top-0 text-sm text-blue-400 hover:text-blue-300"
                >
                  Refresh
                </button>
              )}
            </div>
            
            {/* Display NoCode items with refresh button */}
            <div className="relative">
              {noCodeLoading ? (
                <div className="py-4 pl-12 lg:pl-16 text-left">Loading NoCode products...</div>
              ) : (
                <ContentRow 
                  title="NoCode" 
                  productItems={noCodeItems || []} 
                  projects={noCodeItems && noCodeItems.length === 0 ? designProjects : undefined}
                  categorySlug="nocode"
                />
              )}
              {noCodeItems?.length === 0 && (
                <button 
                  onClick={refreshCategories}
                  className="absolute right-16 top-0 text-sm text-blue-400 hover:text-blue-300"
                >
                  Refresh
                </button>
              )}
            </div>
          </>
        )}
        
        {/* Keep existing content rows as fallback - ensure left alignment */}
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
