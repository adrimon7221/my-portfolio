'use client';
import React from 'react';
import { WorkExperience } from '@/app/_data/workExperience';
import { ANIMATION_CLASSES } from '@/app/_constants/styles';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';
import { WORK_ANIMATION_DELAYS, WORK_STYLES } from '@/app/_constants/work';

interface WorkItemProps {
  work: WorkExperience;
  index: number;
  isLast: boolean;
  isInView: boolean;
}

/**
 * WorkItem Component
 * 
 * Displays a single work experience item with animation and hover effects.
 * 
 * @param work - Work experience data
 * @param index - Index of the item in the list
 * @param isLast - Whether this is the last item
 * @param isInView - Whether the component is in viewport
 */
export const WorkItem: React.FC<WorkItemProps> = React.memo(({
  work,
  index,
  isLast,
  isInView,
}) => {
  // Validation
  if (!work) {
    console.error('WorkItem: work data is required');
    return null;
  }

  if (typeof index !== 'number' || index < 0) {
    console.warn('WorkItem: index debe ser un número no negativo');
  }

  if (typeof isInView !== 'boolean') {
    console.warn('WorkItem: isInView debe ser un booleano');
  }

  if (!work.company || !work.position) {
    console.warn('WorkItem: company y position son requeridos');
  }

  const itemDelay = ANIMATION_DELAYS.TITLE_DELAY + WORK_ANIMATION_DELAYS.ITEM_BASE + (index * WORK_ANIMATION_DELAYS.ITEM_INCREMENT);
  const animationClass = ANIMATION_CLASSES.FADE_IN_FROM_LEFT(isInView, false);
  const { HOVER, ANIMATION, TYPOGRAPHY, ITEM } = WORK_STYLES;

  const transitionStyle = isInView 
    ? `opacity ${ANIMATION.DURATION} ${ANIMATION.EASING} ${itemDelay}ms, transform ${ANIMATION.DURATION} ${ANIMATION.EASING} ${itemDelay}ms, background-color ${HOVER.DURATION} ease, color ${HOVER.DURATION} ease, border-color ${HOVER.DURATION} ease`
    : `opacity 0ms, transform 0ms, background-color ${HOVER.DURATION} ease, color ${HOVER.DURATION} ease, border-color ${HOVER.DURATION} ease`;

  return (
    <div
      className={`${ITEM.BASE} ${ITEM.MOBILE_GRID_CLASS} ${isLast ? 'border-b' : ''} ${animationClass}`}
      style={{ 
        transitionDelay: isInView ? `${itemDelay}ms` : '0ms',
        transition: transitionStyle,
      }}
    >
      {/* Period and Duration */}
      <div className="text-sm flex flex-col">
        <div className="font-semibold">{work.period}</div>
        <div className="text-gray-400 group-hover:text-gray-600 transition-colors duration-300">
          {work.duration}
        </div>
      </div>

      {/* Company and Position */}
      <div className="text-sm sm:text-base flex flex-col sm:contents">
        <div className="text-base sm:text-lg font-medium">
          {work.company}
        </div>
        <div 
          className="text-sm sm:text-base text-gray-300 group-hover:text-gray-700 transition-colors duration-300"
          style={{ fontFamily: TYPOGRAPHY.POSITION_FONT }}
        >
          {work.position}
        </div>
      </div>
    </div>
  );
});

WorkItem.displayName = 'WorkItem';

