'use client';
import React, { useRef } from 'react';
import { useInView } from '@/app/_hooks/useInView';
import { PROJECTS_ANIMATION_DELAYS } from '@/app/_constants/projects';

/**
 * ProjectsHeader Component
 * 
 * Displays the section header/title for the Projects section.
 * Uses scroll-triggered animation when the component enters the viewport.
 */
const ProjectsHeader: React.FC = React.memo(() => {
  const { ref, isInView } = useInView({ 
    threshold: 0.1, 
    rootMargin: '100px',
    triggerOnce: true 
  });

  return (
    <div ref={ref} className="relative mb-1 lg:mb-20 pb-4 lg:pb-0">
      <h2
        className="absolute text-sm text-white -top-8 left-0 lg:-top-[63px] lg:left-40 lg:left-80 xl:left-96 lg:text-base cursor-default select-none transition-all duration-700 ease-out"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateX(0)' : 'translateX(-32px)',
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

