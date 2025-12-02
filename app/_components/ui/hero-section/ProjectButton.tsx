import React from 'react';
import Link from 'next/link';
import { BUTTON_STYLES } from '@/app/_constants/styles';

interface ProjectButtonProps {
  href: string;
  mounted: boolean;
  transitionDelay?: number;
  className?: string;
  children: React.ReactNode;
}

const ARIA_LABELS = {
  VIEW_PROJECTS: 'Ver proyectos',
} as const;

export const ProjectButton: React.FC<ProjectButtonProps> = React.memo(({
  href,
  mounted,
  transitionDelay = 220,
  className = '',
  children,
}) => {
  if (!href) {
    console.error('ProjectButton: href es requerido');
    return null;
  }

  if (!children) {
    console.error('ProjectButton: children es requerido');
    return null;
  }

  return (
    <Link
      href={href}
      aria-label={ARIA_LABELS.VIEW_PROJECTS}
      className={`project-btn inline-flex items-center justify-center px-6 md:px-10 lg:px-20 py-3 md:py-4 lg:py-4 rounded-full font-medium text-base md:text-lg lg:text-lg transform ${
        mounted
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-6 scale-95'
      } focus:outline-none focus:ring-4 focus:ring-white/20 ${className}`}
      style={{
        backgroundColor: BUTTON_STYLES.PROJECT.backgroundColor,
        color: BUTTON_STYLES.PROJECT.color,
        transition: `opacity 0.3s ease-out, transform 0.3s ease-out`,
        transitionDelay: mounted ? `${transitionDelay}ms` : '0ms',
      }}
    >
      {children}
    </Link>
  );
});

ProjectButton.displayName = 'ProjectButton';

