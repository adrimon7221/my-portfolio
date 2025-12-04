'use client';
import React from 'react';
import { Project } from '@/app/_data/projects';
import { ProjectInfo } from './ProjectInfo';
import { ProjectImage } from './ProjectImage';
import { ProjectImageCollage } from './ProjectImageCollage';
import { MOBILE_CONFIG, PROJECTS_ANIMATION_DELAYS } from '@/app/_constants/projects';

/**
 * MobileProjectItem Component
 * 
 * Displays a single project item in mobile layout.
 * Order: Image first, then text.
 * 
 * @param project - Project data object
 * @param index - Project index in the array
 * @param isInView - Whether the component is in view (for animations)
 * @param totalProjects - Total number of projects (to determine if this is the last one)
 */
interface MobileProjectItemProps {
  project: Project;
  index: number;
  isInView: boolean;
  totalProjects: number;
}

const MobileProjectItem: React.FC<MobileProjectItemProps> = React.memo(({
  project,
  index,
  isInView,
  totalProjects,
}) => {
  // Determine circle position: first and last projects have circle on right, middle on left
  const isFirstOrLast = index === 0 || index === totalProjects - 1;
  const circlePosition: 'left' | 'right' = isFirstOrLast ? 'right' : 'left';
  
  const animationDelay = PROJECTS_ANIMATION_DELAYS.PROJECT_BASE + 
    (index * PROJECTS_ANIMATION_DELAYS.PROJECT_INCREMENT);

  return (
    <div className="relative">
      <div
        className="relative z-10"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0)' : 'translateY(32px)',
          transition: `opacity 700ms ease-out, transform 700ms ease-out`,
          transitionDelay: isInView ? `${animationDelay}ms` : '0ms',
        }}
      >
        {/* Image first */}
        {project.images ? (
          <ProjectImageCollage
            images={project.images}
            alt={project.title}
            isInView={isInView}
            isMobile={true}
            circlePosition={circlePosition}
          />
        ) : (
          <ProjectImage
            image={project.image}
            alt={project.title}
            isInView={isInView}
            isMobile={true}
            circlePosition={circlePosition}
          />
        )}
        
        {/* Text after */}
        <ProjectInfo 
          project={project} 
          isInView={isInView} 
          isMobile={true}
        />
      </div>
    </div>
  );
});

MobileProjectItem.displayName = 'MobileProjectItem';

export { MobileProjectItem };

