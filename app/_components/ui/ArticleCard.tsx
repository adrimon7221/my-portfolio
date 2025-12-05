'use client';
import React from 'react';
import { TECH_BOX_CONFIG } from '@/app/_constants/about';

interface ArticleCardProps {
  title: string;
  description: string;
  url: string;
  isInView?: boolean;
  transitionDelay?: number;
  animationDirection?: 'left' | 'right';
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  description,
  url,
  isInView = true,
  transitionDelay = 0,
  animationDirection = 'left',
}) => {
  const { ANIMATION, STYLES } = TECH_BOX_CONFIG;
  const translateX = animationDirection === 'right' 
    ? ANIMATION.TRANSLATE_DISTANCE 
    : -ANIMATION.TRANSLATE_DISTANCE;
  
  const getAnimationStyles = (): React.CSSProperties => {
    if (isInView) {
      return {
        opacity: 1,
        transform: 'translateX(0)',
        transition: `opacity ${ANIMATION.DURATION} ${ANIMATION.EASING} ${transitionDelay}ms, transform ${ANIMATION.DURATION} ${ANIMATION.EASING} ${transitionDelay}ms`,
      };
    }
    
    return {
      opacity: 0,
      transform: `translateX(${translateX}px)`,
      transition: `opacity 0ms, transform 0ms`,
    };
  };

  return (
    <article
      className="rounded-3xl sm:rounded-[2rem] border border-white/20 transition-transform duration-500 ease-out hover:scale-[1.02] cursor-pointer group"
      style={getAnimationStyles()}
    >
      <div className="px-6 sm:px-10 md:px-14 pt-5 sm:pt-6 pb-5 sm:pb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-normal mb-2 sm:mb-3 min-h-[3rem] sm:min-h-[3.5rem] line-clamp-2">
          {title}
        </h2>

        <p className="text-xs sm:text-sm leading-relaxed opacity-80 mb-2 sm:mb-3 h-16 sm:h-20 overflow-hidden">
          {description}
        </p>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-1.5 md:px-10 lg:px-12 text-xs md:text-base lg:py-3 bg-white text-gray-800 rounded-full font-medium italic hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          Read more
        </a>
      </div>
    </article>
  );
};

export default ArticleCard;