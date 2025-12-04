'use client';
import React from 'react';
import { Project } from '@/app/_types';
import { ProjectInfo } from './ProjectInfo';
import { ProjectImageRenderer } from './ProjectImageRenderer';
import { AnimatedContainer } from './AnimatedContainer';
import { DESKTOP_CONFIG } from '@/app/_constants/projects';
import { useProjectAnimation } from '@/app/_hooks/useProjectAnimation';
import { useProjectLayout } from '@/app/_hooks/useProjectLayout';

/**
 * DesktopProjectItem Component
 * 
 * Displays a single project item in desktop layout.
 * Supports reversed layout for specific projects.
 * 
 * @param project - Project data object
 * @param index - Project index in the array
 * @param totalProjects - Total number of projects
 */
interface DesktopProjectItemProps {
  project: Project;
  index: number;
  totalProjects: number;
}

const DesktopProjectItem: React.FC<DesktopProjectItemProps> = React.memo(({
  project,
  index,
  totalProjects,
}) => {
  const { ref, isInView, textAnimationDelay, imageAnimationDelay } = useProjectAnimation({
    index,
    rootMargin: '150px',
  });

  const { isReversed, gridCols, isLastProject } = useProjectLayout({
    index,
    totalProjects,
  });

  const paddingClass = isLastProject ? '' : DESKTOP_CONFIG.SPACING.PROJECT_PADDING;

  return (
    <div 
      ref={ref}
      key={project.id} 
      className={`grid ${gridCols} ${DESKTOP_CONFIG.GRID.GAP} lg:items-center ${paddingClass}`}
    >
      {/* Left Column - Text or Image based on layout */}
      {isReversed ? (
        <ProjectImageRenderer
          project={project}
          isInView={isInView}
          transitionDelay={imageAnimationDelay}
          isReversed={true}
        />
      ) : (
        <AnimatedContainer
          isInView={isInView}
          transitionDelay={textAnimationDelay}
          direction="left"
          className="py-8"
        >
          <ProjectInfo project={project} isInView={isInView} />
        </AnimatedContainer>
      )}

      {/* Right Column - Image or Text based on layout */}
      {isReversed ? (
        <AnimatedContainer
          isInView={isInView}
          transitionDelay={textAnimationDelay}
          direction="right"
          className="py-8"
        >
          <ProjectInfo project={project} isInView={isInView} />
        </AnimatedContainer>
      ) : (
        <ProjectImageRenderer
          project={project}
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

