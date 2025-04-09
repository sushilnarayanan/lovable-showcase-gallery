
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ContentRow from '@/components/ContentRow';
import Footer from '@/components/Footer';
import { featuredProjects, webApps, designProjects, experiments } from '@/data/projects';

const Index = () => {
  // Use the static project data for display
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      
      <div className="pt-0 pb-16 -mt-[100px] relative z-10">
        {/* Content Rows */}
        <ContentRow title="My List" projects={featuredProjects} />
        <ContentRow title="Continue Watching for SUSSH" projects={webApps} />
        <ContentRow title="Only on Netflix" projects={designProjects} />
        <ContentRow title="Trending Now" projects={experiments} />
        <ContentRow title="New Releases" projects={featuredProjects.slice(0, 5)} />
        <ContentRow title="Korean TV Shows" projects={webApps.slice(0, 6)} />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
