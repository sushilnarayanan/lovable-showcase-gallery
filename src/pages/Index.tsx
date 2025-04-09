
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ContentRow from '@/components/ContentRow';
import Footer from '@/components/Footer';
import { featuredProjects, webApps, designProjects, experiments } from '@/data/projects';
import { useProductsByCategory } from '@/hooks/usePortfolio';

const Index = () => {
  // Fetch data from the database using our hooks
  const { data: featuredProducts } = useProductsByCategory('featured-products');
  const { data: microSaasProducts } = useProductsByCategory('microsaas');
  const { data: noCodeProducts } = useProductsByCategory('nocode');
  const { data: vibeCodedProducts } = useProductsByCategory('vibe-coded');
  
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      
      <div className="pt-0 pb-16 -mt-[100px] relative z-10">
        {/* Database Content Rows */}
        <ContentRow title="Featured Products" productItems={featuredProducts} />
        <ContentRow title="MicroSaaS" productItems={microSaasProducts} />
        <ContentRow title="NoCode Projects" productItems={noCodeProducts} />
        <ContentRow title="Vibe Coded" productItems={vibeCodedProducts} />
        
        {/* Static Content Rows (Fallback) */}
        {(!featuredProducts || featuredProducts.length === 0) && 
          <ContentRow title="Featured" projects={featuredProjects} />}
        {(!microSaasProducts || microSaasProducts.length === 0) && 
          <ContentRow title="Continue Watching" projects={webApps} />}
        {(!noCodeProducts || noCodeProducts.length === 0) && 
          <ContentRow title="Only on Netflix" projects={designProjects} />}
        {(!vibeCodedProducts || vibeCodedProducts.length === 0) && 
          <ContentRow title="Trending Now" projects={experiments} />}
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
