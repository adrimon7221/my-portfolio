'use client';
import React from 'react';
import { ANIMATION_CLASSES } from '@/app/_constants/styles';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';
import { WORK_CONTENT, WORK_ANIMATION_DELAYS } from '@/app/_constants/work';

interface WorkExperienceSummaryProps {
  isInView: boolean;
  totalYears: number;
  totalMonths: number;
}

/**
 * WorkExperienceSummary Component
 * 
 * Displays the total work experience summary with animation.
 * 
 * @param isInView - Whether the component is in viewport
 * @param totalYears - Total years of work experience
 * @param totalMonths - Total months of work experience
 */
export const WorkExperienceSummary: React.FC<WorkExperienceSummaryProps> = React.memo(({ isInView, totalYears, totalMonths }) => {
  // Validation
  if (typeof isInView !== 'boolean') {
    console.warn('WorkExperienceSummary: isInView debe ser un booleano');
  }

  const delay = isInView 
    ? ANIMATION_DELAYS.TITLE_DELAY + WORK_ANIMATION_DELAYS.SUMMARY 
    : 0;

  return (
    <div
      className={`mt-5 sm:mt-16 text-right px-4 sm:px-8 lg:px-12 ${ANIMATION_CLASSES.FADE_IN_FROM_RIGHT(isInView, false)}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="text-white text-sm sm:text-base">
        {WORK_CONTENT.SUMMARY.LABEL}
      </p>
      <p className="text-lg sm:text-xl font-light italic mt-1">
        {totalYears} years {totalMonths} months
      </p>
    </div>
  );
});

WorkExperienceSummary.displayName = 'WorkExperienceSummary';

