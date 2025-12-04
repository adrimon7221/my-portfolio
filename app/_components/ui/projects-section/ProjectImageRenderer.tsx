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
  project: Pick<Project, 'image' | 'images' | 'title'>;
  isInView: boolean;
  transitionDelay: number;
  isReversed?: boolean;
  isMobile?: boolean;
  circlePosition?: CirclePosition;
}

export const ProjectImageRenderer: React.FC<ProjectImageRendererProps> = React.memo(({
  project,
  isInView,
  transitionDelay,
  isReversed = false,
  isMobile = false,
  circlePosition,
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

  // Validation: Log warning if project has no images
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Project "${project.title}" has no images (neither 'image' nor 'images' provided)`);
  }

  return null;
});

ProjectImageRenderer.displayName = 'ProjectImageRenderer';

