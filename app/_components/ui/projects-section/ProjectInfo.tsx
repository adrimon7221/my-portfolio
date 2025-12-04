'use client';
import React from 'react';
import { Project } from '@/app/_types';
import { ProjectIcons } from './ProjectIcons';
import { PROJECT_STYLES } from '@/app/_constants/styles';

/**
 * ProjectInfo Component
 * 
 * Displays project information including title, tags, description, and icons.
 * 
 * @param project - Project data object (subset of Project type)
 * @param isInView - Whether the component is in view (for animations)
 * @param transitionDelay - Animation delay in milliseconds
 * @param className - Additional CSS classes
 * @param isMobile - Whether this is the mobile layout
 */
interface ProjectInfoProps {
  project: Pick<Project, 'title' | 'description' | 'tags' | 'demoUrl' | 'githubUrl'>;
  isInView?: boolean;
  transitionDelay?: number;
  className?: string;
  isMobile?: boolean;
}

const ProjectInfo: React.FC<ProjectInfoProps> = React.memo(({
  project,
  isInView = true,
  transitionDelay = 0,
  className = '',
  isMobile = false,
}) => {
  const titleClasses = isMobile
    ? PROJECT_STYLES.TITLE.MOBILE
    : PROJECT_STYLES.TITLE.DESKTOP;
  
  const tagClasses = isMobile
    ? `${PROJECT_STYLES.TAG.MOBILE} ${PROJECT_STYLES.TAG.BASE}`
    : `${PROJECT_STYLES.TAG.DESKTOP} ${PROJECT_STYLES.TAG.BASE}`;
  
  const descriptionClasses = isMobile
    ? PROJECT_STYLES.DESCRIPTION.MOBILE
    : PROJECT_STYLES.DESCRIPTION.DESKTOP;
  
  const iconsMargin = isMobile 
    ? PROJECT_STYLES.ICONS_MARGIN.MOBILE 
    : PROJECT_STYLES.ICONS_MARGIN.DESKTOP;
  
  const contentMargin = isMobile
    ? PROJECT_STYLES.CONTENT_MARGIN.MOBILE
    : PROJECT_STYLES.CONTENT_MARGIN.DESKTOP;

  // Helper function to process text with **bold** markers
  const processDescriptionText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return (
          <span key={index} className="font-bold">
            {boldText}
          </span>
        );
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="group w-full">
        {/* Project Info */}
        <div className={`${contentMargin} w-full`}>
          <div className={titleClasses}>{project.title}</div>
          
          {/* Tags Row 1 */}
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tags.slice(0, 3).map((tag) => (
              <h4 key={tag} className={tagClasses}>
                {tag}
              </h4>
            ))}
          </div>
          
          {/* Tags Row 2 */}
          <div className={`flex flex-wrap gap-2 ${contentMargin}`}>
            {project.tags.slice(3).map((tag) => (
              <h4 key={tag} className={tagClasses}>
                {tag}
              </h4>
            ))}
          </div>
          
          {/* Description */}
          <div className={descriptionClasses}>
            {project.description.split('\n\n').map((paragraph, index) => (
              <p 
                key={index}
                className={index > 0 ? 'mt-4' : ''}
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              >
                {processDescriptionText(paragraph)}
              </p>
            ))}
          </div>
        </div>
        
        {/* Icons */}
        <ProjectIcons 
          className={iconsMargin}
          demoUrl={project.demoUrl}
          githubUrl={project.githubUrl}
        />
      </div>
    </div>
  );
});

ProjectInfo.displayName = 'ProjectInfo';

export { ProjectInfo };

