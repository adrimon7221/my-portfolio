'use client';
import React from 'react';
import { useMountAnimation } from '@/app/_hooks/useMountAnimation';
import { PROJECTS } from '@/app/_data/projects';
import { ProjectsHeader, DesktopProjectItem, MobileProjectItem } from '../ui/projects-section';
import { DESKTOP_CONFIG, MOBILE_CONFIG } from '@/app/_constants/projects';

/**
 * ProjectsSection Component
 * 
 * Main section displaying portfolio projects with desktop and mobile layouts.
 * Uses mount-triggered animations for all child components.
 * 
 * Features:
 * - Responsive design with separate desktop and mobile layouts
 * - Alternating layouts for visual interest (reversed layout for middle project)
 * - Decorative circles behind project images
 * - Smooth entrance animations
 */
const ProjectsSection: React.FC = () => {
  const mounted = useMountAnimation();

  return (
    <section className="relative min-h-screen text-white py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-20">
        <ProjectsHeader isInView={mounted} />

        {/* Projects Layout */}
        <div className="relative min-h-[800px] lg:min-h-[900px]">
          {/* Desktop Layout */}
          <div className={`hidden lg:block ${DESKTOP_CONFIG.SPACING.BETWEEN_PROJECTS}`}>
            {PROJECTS.map((project, index) => (
              <DesktopProjectItem
                key={project.id}
                project={project}
                index={index}
                isInView={mounted}
              />
            ))}
          </div>

          {/* Mobile Layout */}
          <div className={`lg:hidden ${MOBILE_CONFIG.SPACING.BETWEEN_PROJECTS}`}>
            {PROJECTS.map((project, index) => (
              <MobileProjectItem
                key={project.id}
                project={project}
                index={index}
                isInView={mounted}
                totalProjects={PROJECTS.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
