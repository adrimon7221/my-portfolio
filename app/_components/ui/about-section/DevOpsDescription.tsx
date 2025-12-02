'use client';
import React from 'react';
import { ANIMATION_CLASSES } from '@/app/_constants/styles';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';
import { ABOUT_CONTENT, ABOUT_ANIMATION_DELAYS } from '@/app/_constants/about';

interface DevOpsDescriptionProps {
  isInView: boolean;
}

/**
 * DevOpsDescription Component
 * 
 * Displays the description text for the DevOps section with animation.
 * 
 * @param isInView - Whether the component is in viewport
 */
export const DevOpsDescription: React.FC<DevOpsDescriptionProps> = React.memo(({ 
  isInView 
}) => {
  const { DEVOPS_DESCRIPTION } = ABOUT_CONTENT;
  const delay = isInView 
    ? ANIMATION_DELAYS.TITLE_DELAY + ABOUT_ANIMATION_DELAYS.DEVOPS_DESCRIPTION 
    : 0;

  return (
    <div
      className={`flex items-center justify-center relative ${ANIMATION_CLASSES.FADE_IN_FROM_LEFT(isInView, false)}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p>
        {DEVOPS_DESCRIPTION.TEXT}{' '}
        <span className="font-bold">{DEVOPS_DESCRIPTION.FAVORITE_TECH}</span>,{' '}
        <span className="font-bold">{DEVOPS_DESCRIPTION.TOPICS}</span>, or{' '}
        <span className="font-bold">{DEVOPS_DESCRIPTION.TOOLS}</span>{' '}
        {DEVOPS_DESCRIPTION.END_TEXT}
      </p>
    </div>
  );
});

DevOpsDescription.displayName = 'DevOpsDescription';

