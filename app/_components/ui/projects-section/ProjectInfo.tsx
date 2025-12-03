'use client';
import React from 'react';
import { ProjectIcons } from './ProjectIcons';

/**
 * ProjectInfo Component
 * 
 * Displays project information including title, tags, description, and icons.
 * 
 * @param project - Project data object
 * @param isInView - Whether the component is in view (for animations)
 * @param transitionDelay - Animation delay in milliseconds
 * @param className - Additional CSS classes
 * @param isMobile - Whether this is the mobile layout
 */
interface ProjectInfoProps {
  project: {
    title: string;
    description: string;
    tags: readonly string[];
    demoUrl?: string;
    githubUrl?: string;
  };
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
    ? 'text-lg lg:text-xl font-semibold mb-2 not-italic'
    : 'text-xl font-semibold mb-8';
  
  const tagClasses = isMobile
    ? 'px-2.5 py-0.5 lg:px-3 lg:py-1 text-[10px] lg:text-xs bg-white/10 rounded-full border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 cursor-default'
    : 'px-3 py-1 text-xs bg-white/10 rounded-full border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 cursor-default';
  
  const descriptionClasses = isMobile
    ? 'text-xs lg:text-sm text-gray-400 leading-relaxed break-all w-full'
    : 'text-sm text-gray-400 leading-relaxed break-all w-full';
  
  const iconsMargin = isMobile ? 'mt-6' : 'mt-8';

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="group w-full">
        {/* Project Info */}
        <div className={`${isMobile ? 'mb-4' : 'mb-8'} w-full`}>
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
          <div className={`flex flex-wrap gap-2 ${isMobile ? 'mb-4' : 'mb-8'}`}>
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
                {paragraph}
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

