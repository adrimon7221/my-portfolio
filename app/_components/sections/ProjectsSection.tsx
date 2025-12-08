'use client';
import React from 'react';
import type { Project } from '@/app/_types';
import { ProjectsHeader, DesktopProjectItem, MobileProjectItem } from '../ui/projects-section';
import { DESKTOP_CONFIG, MOBILE_CONFIG } from '@/app/_constants/projects';

interface ProjectsSectionProps {
  projects: Project[];
}

/**
 * ProjectsSection Component
 * 
 * Main section displaying portfolio projects with desktop and mobile layouts.
 * Uses scroll-triggered animations for each project item as they enter the viewport.
 * 
 * Features:
 * - Responsive design with separate desktop and mobile layouts
 * - Alternating layouts for visual interest (reversed layout for middle project)
 * - Decorative circles behind project images
 * - Smooth scroll-triggered entrance animations
 */
const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  // Validation
  if (!projects || projects.length === 0) {
    console.warn('ProjectsSection: No projects data available');
  }

  return (
    <section className="relative min-h-screen text-white py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-20">
        <ProjectsHeader />

        {/* Projects Layout */}
        <div className="relative min-h-[800px] lg:min-h-[900px]">
          {/* Desktop Layout */}
          <div className={`hidden lg:block ${DESKTOP_CONFIG.SPACING.BETWEEN_PROJECTS}`}>
            {projects.map((project, index) => (
              <DesktopProjectItem
                key={project.id}
                project={project}
                index={index}
                totalProjects={projects.length}
              />
            ))}
          </div>

          {/* Mobile Layout */}
          <div className={`lg:hidden ${MOBILE_CONFIG.SPACING.BETWEEN_PROJECTS}`}>
            {projects.map((project, index) => (
              <MobileProjectItem
                key={project.id}
                project={project}
                index={index}
                totalProjects={projects.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
