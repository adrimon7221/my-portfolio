'use client';
import React from 'react';
import { Project, CirclePosition } from '@/app/_types';
import { ProjectImage } from './ProjectImage';
import { ProjectImageCollage } from './ProjectImageCollage';

/**
 * ProjectImageRenderer Component
 * 
 * Renders either a single ProjectImage or ProjectImageCollage based on project data
 */
interface ProjectImageRendererProps {
  project: Pick<Project, 'image' | 'images' | 'title' | 'collageType'>;
  isInView: boolean;
  transitionDelay: number;
  isReversed?: boolean;
  isMobile?: boolean;
  circlePosition?: CirclePosition;
  projectIndex?: number;
}

export const ProjectImageRenderer: React.FC<ProjectImageRendererProps> = React.memo(({
  project,
  isInView,
  transitionDelay,
  isReversed = false,
  isMobile = false,
  circlePosition,
  projectIndex,
}) => {
  if (project.images && project.images.length > 0) {
    return (
      <ProjectImageCollage
        images={project.images}
        alt={`${project.title} Dashboard`}
        isInView={isInView}
        transitionDelay={transitionDelay}
        isReversed={isReversed}
        isMobile={isMobile}
        circlePosition={circlePosition}
        projectIndex={projectIndex}
        collageType={project.collageType}
      />
    );
  }

  if (project.image) {
    return (
      <ProjectImage
        image={project.image}
        alt={`${project.title} Dashboard`}
        isInView={isInView}
        transitionDelay={transitionDelay}
        isReversed={isReversed}
        isMobile={isMobile}
        circlePosition={circlePosition}
      />
    );
  }

  return null;
});

ProjectImageRenderer.displayName = 'ProjectImageRenderer';

