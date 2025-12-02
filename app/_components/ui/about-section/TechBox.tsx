'use client';
import React from 'react';

interface TechBoxProps {
  title: string;
  technologies: readonly string[];
  isInView: boolean;
  transitionDelay: number;
  className?: string;
  animationDirection?: 'left' | 'right';
}

export const TechBox: React.FC<TechBoxProps> = React.memo(({
  title,
  technologies,
  isInView,
  transitionDelay,
  className = '',
  animationDirection = 'left',
}) => {
  const baseClasses = 'rounded-2xl sm:rounded-3xl border border-white transition-all duration-300 hover:bg-white hover:border-white hover:text-black cursor-pointer';
  
  // Animación específica para TechBox usando estilos inline
  const getAnimationStyles = () => {
    const translateX = animationDirection === 'right' ? 10 : -10;
    
    return {
      opacity: isInView ? 1 : 0,
      transform: isInView ? 'translateX(0)' : `translateX(${translateX}px)`,
      // Incluir todas las transiciones: animación de entrada + hover
      transition: isInView 
        ? `opacity 800ms cubic-bezier(0.4, 0, 0.2, 1) ${transitionDelay}ms, transform 800ms cubic-bezier(0.4, 0, 0.2, 1) ${transitionDelay}ms, background-color 300ms ease, border-color 300ms ease, color 300ms ease`
        : 'opacity 0ms, transform 0ms, background-color 300ms ease, border-color 300ms ease, color 300ms ease',
    };
  };

  return (
    <div
      className={`${baseClasses} ${className}`}
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