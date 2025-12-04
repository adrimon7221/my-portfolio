'use client';
import React from 'react';
import { Project } from '@/app/_data/projects';
import { ProjectInfo } from './ProjectInfo';
import { ProjectImage } from './ProjectImage';
import { ProjectImageCollage } from './ProjectImageCollage';
import { DESKTOP_CONFIG, REVERSED_PROJECT_INDEX, PROJECTS_ANIMATION_DELAYS } from '@/app/_constants/projects';
import { useInView } from '@/app/_hooks/useInView';

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
  totalProjects: number;
}

const DesktopProjectItem: React.FC<DesktopProjectItemProps> = React.memo(({
  project,
  index,
  isInView: externalIsInView,
  totalProjects,
}) => {
  const { ref, isInView: scrollInView } = useInView({ 
    threshold: 0.1, 
    rootMargin: '150px',
    triggerOnce: true 
  });
  // Only use scroll-based animation, ignore external isInView for scroll behavior
  const isInView = scrollInView;

  const isReversed = index === REVERSED_PROJECT_INDEX;
  const gridCols = isReversed 
    ? DESKTOP_CONFIG.GRID.REVERSED 
    : DESKTOP_CONFIG.GRID.NORMAL;

  const textAnimationDelay = PROJECTS_ANIMATION_DELAYS.PROJECT_BASE + 
    (index * PROJECTS_ANIMATION_DELAYS.PROJECT_INCREMENT);
  const imageAnimationDelay = textAnimationDelay + PROJECTS_ANIMATION_DELAYS.IMAGE;

  // Remove bottom padding from last project to maintain consistent spacing
  const isLastProject = index === totalProjects - 1;
  const paddingClass = isLastProject ? '' : DESKTOP_CONFIG.SPACING.PROJECT_PADDING;

  return (
    <div 
      ref={ref}
      key={project.id} 
      className={`grid ${gridCols} ${DESKTOP_CONFIG.GRID.GAP} lg:items-center ${paddingClass}`}
    >
      {/* Left Column - Text or Image based on layout */}
      {isReversed ? (
        project.images ? (
          <ProjectImageCollage
            images={project.images}
            alt={`${project.title} Dashboard`}
            isInView={isInView}
            transitionDelay={imageAnimationDelay}
            isReversed={true}
          />
        ) : (
          <ProjectImage
            image={project.image}
            alt={`${project.title} Dashboard`}
            isInView={isInView}
            transitionDelay={imageAnimationDelay}
            isReversed={true}
          />
        )
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
        project.images ? (
          <ProjectImageCollage
            images={project.images}
            alt={`${project.title} Dashboard`}
            isInView={isInView}
            transitionDelay={imageAnimationDelay}
            isReversed={false}
          />
        ) : (
          <ProjectImage
            image={project.image}
            alt={`${project.title} Dashboard`}
            isInView={isInView}
            transitionDelay={imageAnimationDelay}
            isReversed={false}
          />
        )
      )}
    </div>
  );
});

DesktopProjectItem.displayName = 'DesktopProjectItem';

export { DesktopProjectItem };

