'use client';
import React from 'react';
import { ANIMATION_CLASSES } from '@/app/_constants/styles';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';

interface AboutHeaderProps {
  isInView: boolean;
}

export const AboutHeader: React.FC<AboutHeaderProps> = React.memo(({ isInView }) => {
  return (
    <div className="mb-12 sm:mb-14 md:mb-16 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
      <h2
        className={`text-xs sm:text-sm text-white ${ANIMATION_CLASSES.FADE_IN_FROM_LEFT(isInView)}`}
        style={{ transitionDelay: isInView ? `${ANIMATION_DELAYS.TITLE_DELAY}ms` : '0ms' }}
      >
        ... /About me ...
      </h2>
      <div className="lg:flex-1 lg:ml-12 lg:text-center">
        <p
          className={`text-base sm:text-lg text-gray-300 leading-relaxed ${ANIMATION_CLASSES.FADE_IN_FROM_RIGHT(isInView)}`}
          style={{ transitionDelay: isInView ? `${ANIMATION_DELAYS.TITLE_DELAY + 80}ms` : '0ms' }}
        >
          Hello! I'm{" "}
          <span className="text-white font-semibold italic">Nikita</span>, I'm a{" "}
          <span className="italic text-white">full-stack developer</span>.
        </p>
        <p
          className={`text-base sm:text-lg text-gray-300 mt-2 ${ANIMATION_CLASSES.FADE_IN_FROM_RIGHT(isInView)}`}
          style={{ transitionDelay: isInView ? `${ANIMATION_DELAYS.TITLE_DELAY + 160}ms` : '0ms' }}
        >
          More than{" "}
          <span className="text-white font-semibold italic">5 years</span>{" "}
          experience.
        </p>
      </div>
    </div>
  );
});

AboutHeader.displayName = 'AboutHeader';

