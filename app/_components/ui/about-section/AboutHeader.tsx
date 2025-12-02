'use client';
import React from 'react';
import { ANIMATION_CLASSES } from '@/app/_constants/styles';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';
import { ABOUT_CONTENT, ABOUT_ANIMATION_DELAYS } from '@/app/_constants/about';

interface AboutHeaderProps {
  isInView: boolean;
}

/**
 * AboutHeader Component
 * 
 * Displays the section title and introduction text with animations.
 * 
 * @param isInView - Whether the component is in viewport
 */
export const AboutHeader: React.FC<AboutHeaderProps> = React.memo(({ isInView }) => {
  const { SECTION_TITLE, INTRO_TEXT } = ABOUT_CONTENT;
  const titleDelay = isInView ? ANIMATION_DELAYS.TITLE_DELAY + ABOUT_ANIMATION_DELAYS.HEADER_TITLE : 0;
  const introFirstDelay = isInView ? ANIMATION_DELAYS.TITLE_DELAY + ABOUT_ANIMATION_DELAYS.INTRO_FIRST : 0;
  const introSecondDelay = isInView ? ANIMATION_DELAYS.TITLE_DELAY + ABOUT_ANIMATION_DELAYS.INTRO_SECOND : 0;

  return (
    <div className="mb-12 sm:mb-14 md:mb-16 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
      <h2
        className={`text-xs sm:text-sm text-white ${ANIMATION_CLASSES.FADE_IN_FROM_LEFT(isInView)}`}
        style={{ transitionDelay: `${titleDelay}ms` }}
      >
        {SECTION_TITLE}
      </h2>
      <div className="lg:flex-1 lg:ml-12 lg:text-center">
        <p
          className={`text-base sm:text-lg text-gray-300 leading-relaxed ${ANIMATION_CLASSES.FADE_IN_FROM_RIGHT(isInView)}`}
          style={{ transitionDelay: `${introFirstDelay}ms` }}
        >
          {INTRO_TEXT.GREETING}{' '}
          <span className="text-white font-bold">{INTRO_TEXT.NAME}</span>, I'm a{' '}
          <span className="italic text-white">{INTRO_TEXT.ROLE}</span>.
        </p>
        <p
          className={`text-base sm:text-lg text-gray-300 mt-2 ${ANIMATION_CLASSES.FADE_IN_FROM_RIGHT(isInView)}`}
          style={{ transitionDelay: `${introSecondDelay}ms` }}
        >
          {INTRO_TEXT.EXPERIENCE}{' '}
          <span className="text-white font-bold">{INTRO_TEXT.YEARS}</span>{' '}
          {INTRO_TEXT.EXPERIENCE_TEXT}
        </p>
      </div>
    </div>
  );
});

AboutHeader.displayName = 'AboutHeader';

