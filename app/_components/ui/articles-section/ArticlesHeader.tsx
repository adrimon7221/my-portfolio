/**
 * ArticlesHeader Component
 * 
 * Header section for Articles displaying the title and border.
 * Includes scroll-triggered animations.
 */

'use client';
import React from 'react';
import { ANIMATION_CLASSES } from '@/app/_constants/styles';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';
import { ARTICLES_CONTENT, ARTICLES_CONFIG } from '@/app/_constants/articles';

interface ArticlesHeaderProps {
  isInView: boolean;
}

export const ArticlesHeader: React.FC<ArticlesHeaderProps> = ({ isInView }) => {
  const titleDelay = isInView ? ANIMATION_DELAYS.TITLE_DELAY : 0;
  const borderDelay = titleDelay + ARTICLES_CONFIG.ANIMATION.BORDER_DELAY_OFFSET;

  return (
    <div className="rounded-2xl p-4 sm:p-6">
      <h2
        className={`text-5xl sm:text-7xl md:text-8xl font-semibold text-right ${ANIMATION_CLASSES.FADE_IN_FROM_RIGHT(isInView, false)}`}
        style={{ transitionDelay: `${titleDelay}ms` }}
      >
        {ARTICLES_CONTENT.SECTION_TITLE}
      </h2>
      <div
        className={`mt-4 border-t-2 border-white/20 w-full transition-opacity duration-700 ease-out ${isInView ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDelay: `${borderDelay}ms` }}
      />
    </div>
  );
};

