
import React from 'react';
import ContentRow from '@/components/ContentRow';
import { featuredProjects, webApps, designProjects, experiments } from '@/data/projects';

const FallbackContent = () => {
  return (
    <>
      <ContentRow title="Featured Projects" projects={featuredProjects} />
      <ContentRow title="Web Applications" projects={webApps} />
      <ContentRow title="Design Projects" projects={designProjects} />
      <ContentRow title="Experiments" projects={experiments} />
    </>
  );
};

export default FallbackContent;
