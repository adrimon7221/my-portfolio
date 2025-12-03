'use client';
import React from 'react';
import { Project } from '@/app/_data/projects';
import { ProjectInfo } from './ProjectInfo';
import { ProjectImage } from './ProjectImage';
import { DESKTOP_CONFIG, REVERSED_PROJECT_INDEX, PROJECTS_ANIMATION_DELAYS } from '@/app/_constants/projects';

/**
 * DesktopProjectItem Component
 * 
 * Displays a single project item in desktop layout.
 * Supports reversed layout for specific projects.
 * 
 * @param project - Project data object
 * @param index - Project index in the array
 * @param isInView - Whether the component is in view (for animations)
 */
interface DesktopProjectItemProps {
  project: Project;
  index: number;
  isInView: boolean;
}

const DesktopProjectItem: React.FC<DesktopProjectItemProps> = React.memo(({
  project,
  index,
  isInView,
}) => {
  const isReversed = index === REVERSED_PROJECT_INDEX;
  const gridCols = isReversed 
    ? DESKTOP_CONFIG.GRID.REVERSED 
    : DESKTOP_CONFIG.GRID.NORMAL;

  const textAnimationDelay = PROJECTS_ANIMATION_DELAYS.PROJECT_BASE + 
    (index * PROJECTS_ANIMATION_DELAYS.PROJECT_INCREMENT);
  const imageAnimationDelay = textAnimationDelay + PROJECTS_ANIMATION_DELAYS.IMAGE;

  return (
    <div 
      key={project.id} 
      className={`grid ${gridCols} ${DESKTOP_CONFIG.GRID.GAP} lg:items-center ${DESKTOP_CONFIG.SPACING.PROJECT_PADDING}`}
    >
      {/* Left Column - Text or Image based on layout */}
      {isReversed ? (
        <ProjectImage
          image={project.image}
          alt={`${project.title} Dashboard`}
          isInView={isInView}
          transitionDelay={imageAnimationDelay}
          isReversed={true}
        />
      ) : (
        <div
          className="py-8"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateX(0)' : 'translateX(-32px)',
            transition: `opacity 700ms ease-out, transform 700ms ease-out`,
            transitionDelay: isInView ? `${textAnimationDelay}ms` : '0ms',
          }}
        >
          <ProjectInfo project={project} isInView={isInView} />
        </div>
      )}

      {/* Right Column - Image or Text based on layout */}
      {isReversed ? (
        <div
          className="py-8"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateX(0)' : 'translateX(32px)',
            transition: `opacity 700ms ease-out, transform 700ms ease-out`,
            transitionDelay: isInView ? `${textAnimationDelay}ms` : '0ms',
          }}
        >
          <ProjectInfo project={project} isInView={isInView} />
        </div>
      ) : (
        <ProjectImage
          image={project.image}
          alt={`${project.title} Dashboard`}
          isInView={isInView}
          transitionDelay={imageAnimationDelay}
          isReversed={false}
        />
      )}
    </div>
  );
});

DesktopProjectItem.displayName = 'DesktopProjectItem';

export { DesktopProjectItem };

