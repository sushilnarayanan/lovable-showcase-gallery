import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ContentRow from '@/components/ContentRow';
import Footer from '@/components/Footer';
import { featuredProjects, webApps, designProjects, experiments } from '@/data/projects';
import { usePortfolioData } from '@/hooks/usePortfolio';

const Index = () => {
  const { data: portfolioItems, isLoading, error } = usePortfolioData();

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar />
      <Hero />
      
      <div className="pt-8 pb-16">
        {/* Display portfolio items from Supabase if available */}
        {!isLoading && !error && portfolioItems && portfolioItems.length > 0 && (
          <ContentRow title="My Portfolio" portfolioItems={portfolioItems} />
        )}
        
        {/* Keep existing content rows as fallback */}
        <ContentRow title="Featured Projects" projects={featuredProjects} />
        <ContentRow title="Web Applications" projects={webApps} />
        <ContentRow title="Design Projects" projects={designProjects} />
        <ContentRow title="Experiments" projects={experiments} />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
