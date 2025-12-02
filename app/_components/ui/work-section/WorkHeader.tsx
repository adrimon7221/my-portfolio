'use client';
import React from 'react';
import { ANIMATION_CLASSES } from '@/app/_constants/styles';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';
import { WORK_CONTENT, WORK_ANIMATION_DELAYS } from '@/app/_constants/work';

interface WorkHeaderProps {
  isInView: boolean;
}

/**
 * WorkHeader Component
 * 
 * Displays the section title with animation.
 * 
 * @param isInView - Whether the component is in viewport
 */
export const WorkHeader: React.FC<WorkHeaderProps> = React.memo(({ isInView }) => {
  // Validation
  if (typeof isInView !== 'boolean') {
    console.warn('WorkHeader: isInView debe ser un booleano');
  }

  const delay = isInView 
    ? ANIMATION_DELAYS.TITLE_DELAY + WORK_ANIMATION_DELAYS.TITLE 
    : 0;

  return (
    <div className="mb-5 sm:mb-16">
      <h2
        className={`text-5xl sm:text-7xl md:text-8xl font-semibold text-right ${ANIMATION_CLASSES.FADE_IN_FROM_RIGHT(isInView, false)}`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {WORK_CONTENT.SECTION_TITLE}
      </h2>
    </div>
  );
});

WorkHeader.displayName = 'WorkHeader';

