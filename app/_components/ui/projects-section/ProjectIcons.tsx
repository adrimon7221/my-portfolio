'use client';
import React from 'react';

/**
 * ProjectIcons Component
 * 
 * Displays GitHub and external link icons for a project.
 * 
 * @param className - Additional CSS classes
 */
interface ProjectIconsProps {
  className?: string;
  demoUrl?: string;
  githubUrl?: string;
}

const LinkIcon: React.FC = React.memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
));

const GitHubIcon: React.FC = React.memo(() => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="black">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
));

LinkIcon.displayName = 'LinkIcon';
GitHubIcon.displayName = 'GitHubIcon';

const ProjectIcons: React.FC<ProjectIconsProps> = React.memo(({ 
  className = '',
  demoUrl,
  githubUrl,
}) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {demoUrl && (
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
          aria-label="View project demo"
        >
          <LinkIcon />
        </a>
      )}
      {githubUrl && (
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
          aria-label="View project on GitHub"
        >
          <GitHubIcon />
        </a>
      )}
      {!demoUrl && !githubUrl && (
        <>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <LinkIcon />
          </div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <GitHubIcon />
          </div>
        </>
      )}
    </div>
  );
});

ProjectIcons.displayName = 'ProjectIcons';

export { ProjectIcons };

