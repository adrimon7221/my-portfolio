'use client';
import React from 'react';
import { Project } from '@/app/_types';
import { ProjectInfo } from './ProjectInfo';
import { ProjectImageRenderer } from './ProjectImageRenderer';
import { AnimatedContainer } from './AnimatedContainer';
import { useProjectAnimation } from '@/app/_hooks/useProjectAnimation';
import { useProjectLayout } from '@/app/_hooks/useProjectLayout';

/**
 * MobileProjectItem Component
 * 
 * Displays a single project item in mobile layout.
 * Order: Image first, then text.
 * 
 * @param project - Project data object
 * @param index - Project index in the array
 * @param totalProjects - Total number of projects
 */
interface MobileProjectItemProps {
  project: Project;
  index: number;
  totalProjects: number;
}

const MobileProjectItem: React.FC<MobileProjectItemProps> = React.memo(({
  project,
  index,
  totalProjects,
}) => {
  const { ref, isInView, textAnimationDelay } = useProjectAnimation({
    index,
    rootMargin: '100px',
  });

  const { circlePosition } = useProjectLayout({
    index,
    totalProjects,
  });

  return (
    <div ref={ref} className="relative">
      <AnimatedContainer
        isInView={isInView}
        transitionDelay={textAnimationDelay}
        direction="down"
        className="relative z-10"
      >
        {/* Image first */}
        <ProjectImageRenderer
          project={project}
          isInView={isInView}
          transitionDelay={0}
          isMobile={true}
          circlePosition={circlePosition}
        />
        
        {/* Text after */}
        <ProjectInfo 
          project={project} 
          isInView={isInView} 
          isMobile={true}
        />
      </AnimatedContainer>
    </div>
  );
});

MobileProjectItem.displayName = 'MobileProjectItem';

export { MobileProjectItem };

