'use client';
import React from 'react';
import { ANIMATION_CLASSES } from '@/app/_constants/styles';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';

interface DevOpsDescriptionProps {
  isInView: boolean;
}

export const DevOpsDescription: React.FC<DevOpsDescriptionProps> = React.memo(({ 
  isInView 
}) => {
  return (
    <div
      className={`flex items-center justify-center relative ${ANIMATION_CLASSES.FADE_IN_FROM_LEFT(isInView, false)}`}
      style={{ transitionDelay: isInView ? `${ANIMATION_DELAYS.TITLE_DELAY + 640}ms` : '0ms' }}
    >
      <p>
        Some of my <span className="font-bold italic">favorite technologies</span>,{' '}
        <span className="font-bold italic">topics</span>, or{' '}
        <span className="font-bold italic">tools</span> that i worked with
      </p>
    </div>
  );
});

DevOpsDescription.displayName = 'DevOpsDescription';

