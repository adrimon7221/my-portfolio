'use client';
import React from 'react';
import { ArrowButton } from '../hero-section';
import { TECH_BOX_CONFIG, SOCIAL_LINKS_CONFIG } from '@/app/_constants/about';
import type { SocialLinkItem } from '@/app/_types/social';

interface SocialLinksContainerProps {
  socialLinks: SocialLinkItem[]
  isInView: boolean;
  transitionDelay: number;
}

interface SocialLinksContainerClientProps {
  socialLinks: SocialLinkItem[]
  isInView: boolean;
  transitionDelay: number;
}

const ARIA_LABELS = {
  GITHUB: 'GitHub',
} as const;

/**
 * SocialLinksContainerClient Component (Client Component)
 * 
 * Displays GitHub social link and arrow button with animation.
 * 
 * Recibe los enlaces sociales como props desde el Server Component padre.
 * 
 * @param socialLinks - Array de enlaces sociales desde la base de datos
 * @param isInView - Whether the component is in viewport
 * @param transitionDelay - Delay for the entrance animation in milliseconds
 */
export const SocialLinksContainerClient: React.FC<SocialLinksContainerClientProps> = React.memo(({ 
  socialLinks,
  isInView,
  transitionDelay 
}) => {
  if (transitionDelay < 0) {
    console.warn('SocialLinksContainer: transitionDelay should be a positive number');
  }

  const githubLink = socialLinks.find((link) => link.label === ARIA_LABELS.GITHUB);

  if (!githubLink) {
    // No es un error crítico, simplemente no se mostrará el enlace de GitHub
    console.warn('SocialLinksContainer: GitHub link not found in socialLinks array. El enlace de GitHub no se mostrará.');
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
          href="/#projects"
          mounted={true}
          size="lg"
          className={ARROW_BUTTON.SIZE}
        />
      </div>
    </div>
  );
});

SocialLinksContainerClient.displayName = 'SocialLinksContainerClient';

