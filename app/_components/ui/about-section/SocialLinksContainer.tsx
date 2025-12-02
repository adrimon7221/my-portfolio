'use client';
import React from 'react';
import { ArrowButton } from '../hero-section';
import { SOCIAL_LINKS } from '@/app/_data/socialLinks';
import { TECH_BOX_CONFIG, SOCIAL_LINKS_CONFIG } from '@/app/_constants/about';

interface SocialLinksContainerProps {
  isInView: boolean;
  transitionDelay: number;
}

const ARIA_LABELS = {
  GITHUB: 'GitHub',
} as const;

/**
 * SocialLinksContainer Component
 * 
 * Displays GitHub social link and arrow button with animation.
 * 
 * @param isInView - Whether the component is in viewport
 * @param transitionDelay - Delay for the entrance animation in milliseconds
 */
export const SocialLinksContainer: React.FC<SocialLinksContainerProps> = React.memo(({ 
  isInView,
  transitionDelay 
}) => {
  if (transitionDelay < 0) {
    console.warn('SocialLinksContainer: transitionDelay should be a positive number');
  }

  const githubLink = SOCIAL_LINKS.find((link) => link.label === ARIA_LABELS.GITHUB);

  if (!githubLink) {
    console.error('SocialLinksContainer: GitHub link not found in SOCIAL_LINKS');
  }

  const { ANIMATION } = TECH_BOX_CONFIG;
  const { GITHUB_BUTTON, ARROW_BUTTON } = SOCIAL_LINKS_CONFIG;

  // Animación específica desde la derecha
  const getAnimationStyles = (): React.CSSProperties => {
    if (isInView) {
      return {
        opacity: 1,
        transform: 'translateX(0)',
        transition: `opacity ${ANIMATION.DURATION} ${ANIMATION.EASING} ${transitionDelay}ms, transform ${ANIMATION.DURATION} ${ANIMATION.EASING} ${transitionDelay}ms`,
      };
    }
    
    return {
      opacity: 0,
      transform: 'translateX(10px)',
      transition: 'opacity 0ms, transform 0ms',
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
          className={`group flex items-center justify-center ${GITHUB_BUTTON.SIZE} rounded-full bg-black/30 hover:bg-black/0 transition-all duration-300 hover:rotate-12 flex-shrink-0 ${GITHUB_BUTTON.ICON_SIZE} relative z-10`}
        >
          {githubLink.svg}
        </a>
      )}
      <div className="absolute left-1/2 top-1/2 translate-x-1/4 -translate-y-1/2 z-20">
        <ArrowButton
          href="/projects"
          mounted={true}
          size="lg"
          className={ARROW_BUTTON.SIZE}
        />
      </div>
    </div>
  );
});

SocialLinksContainer.displayName = 'SocialLinksContainer';

