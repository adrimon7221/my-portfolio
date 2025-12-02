'use client';
import React from 'react';
import { TECH_BOX_CONFIG } from '@/app/_constants/about';

interface TechBoxProps {
  title: string;
  technologies: readonly string[];
  isInView: boolean;
  transitionDelay: number;
  className?: string;
  animationDirection?: 'left' | 'right';
}

/**
 * TechBox Component
 * 
 * Displays a technology stack box with animation and hover effects.
 * 
 * @param title - The title of the technology category
 * @param technologies - Array of technology names
 * @param isInView - Whether the component is in viewport
 * @param transitionDelay - Delay for the entrance animation in milliseconds
 * @param className - Additional CSS classes
 * @param animationDirection - Direction of the entrance animation ('left' or 'right')
 */
export const TechBox: React.FC<TechBoxProps> = React.memo(({
  title,
  technologies,
  isInView,
  transitionDelay,
  className = '',
  animationDirection = 'left',
}) => {
  // Validation
  if (!title) {
    console.error('TechBox: title is required');
    return null;
  }

  if (!technologies || technologies.length === 0) {
    console.warn('TechBox: technologies array is empty');
  }

  if (transitionDelay < 0) {
    console.warn('TechBox: transitionDelay should be a positive number');
  }

  const { ANIMATION, STYLES } = TECH_BOX_CONFIG;
  const translateX = animationDirection === 'right' 
    ? ANIMATION.TRANSLATE_DISTANCE 
    : -ANIMATION.TRANSLATE_DISTANCE;
  
  // Animación específica para TechBox usando estilos inline
  const getAnimationStyles = (): React.CSSProperties => {
    const baseTransition = `background-color ${ANIMATION.HOVER_DURATION} ease, border-color ${ANIMATION.HOVER_DURATION} ease, color ${ANIMATION.HOVER_DURATION} ease`;
    
    if (isInView) {
      return {
        opacity: 1,
        transform: 'translateX(0)',
        transition: `opacity ${ANIMATION.DURATION} ${ANIMATION.EASING} ${transitionDelay}ms, transform ${ANIMATION.DURATION} ${ANIMATION.EASING} ${transitionDelay}ms, ${baseTransition}`,
      };
    }
    
    return {
      opacity: 0,
      transform: `translateX(${translateX}px)`,
      transition: `opacity 0ms, transform 0ms, ${baseTransition}`,
    };
  };

  return (
    <div
      className={`${STYLES.BASE} ${className}`}
      style={getAnimationStyles()}
    >
      <p className="text-base sm:text-lg font-normal mb-3 sm:mb-4 px-5 sm:px-6 pt-5 sm:pt-6">
        {title}
      </p>
      <h4 className="text-xs sm:text-sm leading-relaxed px-5 sm:px-6 pb-5 sm:pb-6">
        {technologies.join(' / ')}
      </h4>
    </div>
  );
});

TechBox.displayName = 'TechBox';