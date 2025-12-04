'use client';
import React from 'react';
import { PROJECTS_ANIMATION_DELAYS } from '@/app/_constants/projects';

/**
 * ProjectsHeader Component
 * 
 * Displays the section header/title for the Projects section.
 * 
 * @param isInView - Whether the component is in view (for animations)
 */
interface ProjectsHeaderProps {
  isInView: boolean;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = React.memo(({ isInView }) => {
  return (
    <div className="relative mb-1 lg:mb-20 pb-4 lg:pb-0">
      <h2
        className="absolute text-sm text-white -top-8 left-0 lg:-top-[63px] lg:left-40 lg:left-80 xl:left-96 lg:text-base"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 700ms ease-out, transform 700ms ease-out',
          transitionDelay: isInView ? `${PROJECTS_ANIMATION_DELAYS.TITLE}ms` : '0ms',
        }}
      >
        ... /Projects ...
      </h2>
    </div>
  );
});

ProjectsHeader.displayName = 'ProjectsHeader';

export { ProjectsHeader };

