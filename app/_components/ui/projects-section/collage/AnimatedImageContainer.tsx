"use client";
import React from "react";
import { PROJECT_ANIMATION_STYLES, PROJECT_IMAGE_HOVER } from "@/app/_constants/projectAnimations";

/**
 * AnimatedImageContainer Component
 * 
 * Reusable container for images with entrance and hover animations
 */
interface AnimatedImageContainerProps {
  children: React.ReactNode;
  isInView: boolean;
  transitionDelay?: number;
  hoverScale?: 'small' | 'medium';
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedImageContainer: React.FC<AnimatedImageContainerProps> = React.memo(({
  children,
  isInView,
  transitionDelay = 0,
  hoverScale = 'small',
  className = '',
  style = {},
}) => {
  const hoverScaleClass = hoverScale === 'medium' 
    ? PROJECT_IMAGE_HOVER.CONTAINER_SCALE.MEDIUM 
    : PROJECT_IMAGE_HOVER.CONTAINER_SCALE.SMALL;

  return (
    <div
      className={`group ${className} transition-all ${hoverScaleClass} hover:transition-transform hover:duration-200 cursor-pointer`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'scale(1)' : 'scale(0.95)',
        transitionDuration: `${PROJECT_ANIMATION_STYLES.ENTRANCE.DURATION}ms`,
        transitionTimingFunction: PROJECT_ANIMATION_STYLES.ENTRANCE.TIMING,
        transitionDelay: isInView ? `${transitionDelay}ms` : '0ms',
        ...style,
      }}
    >
      {children}
    </div>
  );
});

AnimatedImageContainer.displayName = 'AnimatedImageContainer';

