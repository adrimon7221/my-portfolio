'use client';
import React from 'react';
import { ArrowButton } from '../hero-section';
import { SOCIAL_LINKS } from '@/app/_data/socialLinks';

interface SocialLinksContainerProps {
  isInView: boolean;
  transitionDelay: number;
}

export const SocialLinksContainer: React.FC<SocialLinksContainerProps> = React.memo(({ 
  isInView,
  transitionDelay 
}) => {
  const githubLink = SOCIAL_LINKS.find((link) => link.label === 'GitHub');

  // Animación específica desde la derecha
  const getAnimationStyles = () => {
    return {
      opacity: isInView ? 1 : 0,
      transform: isInView ? 'translateX(0)' : 'translateX(10px)',
      transition: isInView 
        ? `opacity 800ms cubic-bezier(0.4, 0, 0.2, 1) ${transitionDelay}ms, transform 800ms cubic-bezier(0.4, 0, 0.2, 1) ${transitionDelay}ms`
        : 'opacity 0ms, transform 0ms',
    };
  };

  return (
    <div 
      className="flex items-center justify-center relative"
      style={getAnimationStyles()}
    >
      {githubLink && (
        <a
          href={githubLink.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={githubLink.label}
          className="group flex items-center justify-center w-16 h-16 rounded-full bg-black/30 hover:bg-black/0 transition-all duration-300 hover:rotate-12 flex-shrink-0 [&_svg]:w-10 [&_svg]:h-10 relative z-10"
        >
          {githubLink.svg}
        </a>
      )}
      <div className="absolute left-1/2 top-1/2 translate-x-1/4 -translate-y-1/2 z-20">
        <ArrowButton
          href="/projects"
          mounted={true}
          size="lg"
          className="!w-14 !h-14"
        />
      </div>
    </div>
  );
});

SocialLinksContainer.displayName = 'SocialLinksContainer';

