import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { 
  useProductData, 
  useCategoryData, 
  useProductsByCategory
} from '@/hooks/usePortfolio';
import { toast } from '@/hooks/use-toast';
import PageContent from '@/components/PageContent';
import { useCategoryInitialization } from '@/hooks/useCategoryInitialization';

const Index = () => {
  const { data: productItems, isLoading: productsLoading, error: productsError } = useProductData();
  const { data: categories, isLoading: categoriesLoading } = useCategoryData();
  
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
  
  // Initialize categories if needed
  useCategoryInitialization({ refreshCategories });
  
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

  return (
    <div className="min-h-screen bg-netflix-background overflow-x-hidden w-full max-w-full min-w-[100vw]">
      <Navbar />
      <Hero />
      
      <PageContent 
        productItems={productItems}
        exitItems={exitItems}
        featuredProductItems={featuredProductItems}
        vibedCodedItems={vibedCodedItems}
        microSaasItems={microSaasItems}
        noCodeItems={noCodeItems}
        productsLoading={productsLoading}
        productsError={productsError}
        categoriesLoading={categoriesLoading}
        microSaasLoading={microSaasLoading}
        noCodeLoading={noCodeLoading}
        refreshCategories={refreshCategories}
      />
      
      <Footer />
    </div>
  );
};

export default Index;
