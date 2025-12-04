'use client';
import React from 'react';
import { PROJECT_ANIMATION_STYLES } from '@/app/_constants/projectAnimations';

/**
 * AnimatedContainer Component
 * 
 * Wrapper component for consistent entrance animations
 */
interface AnimatedContainerProps {
  children: React.ReactNode;
  isInView: boolean;
  transitionDelay?: number;
  direction?: 'left' | 'right' | 'up' | 'down' | 'scale';
  className?: string;
  style?: React.CSSProperties;
}

const TRANSFORM_MAP = {
  left: PROJECT_ANIMATION_STYLES.ENTRANCE.TRANSFORM.LEFT,
  right: PROJECT_ANIMATION_STYLES.ENTRANCE.TRANSFORM.RIGHT,
  up: PROJECT_ANIMATION_STYLES.ENTRANCE.TRANSFORM.UP,
  down: PROJECT_ANIMATION_STYLES.ENTRANCE.TRANSFORM.DOWN,
  scale: PROJECT_ANIMATION_STYLES.ENTRANCE.TRANSFORM.SCALE,
};

export const AnimatedContainer: React.FC<AnimatedContainerProps> = React.memo(({
  children,
  isInView,
  transitionDelay = 0,
  direction = 'scale',
  className = '',
  style = {},
}) => {
  const transform = isInView 
    ? TRANSFORM_MAP[direction].to 
    : TRANSFORM_MAP[direction].from;

  return (
    <div
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform,
        transition: `opacity ${PROJECT_ANIMATION_STYLES.ENTRANCE.DURATION}ms ${PROJECT_ANIMATION_STYLES.ENTRANCE.TIMING}, transform ${PROJECT_ANIMATION_STYLES.ENTRANCE.DURATION}ms ${PROJECT_ANIMATION_STYLES.ENTRANCE.TIMING}`,
        transitionDelay: isInView ? `${transitionDelay}ms` : '0ms',
        ...style,
      }}
    >
      {children}
    </div>
  );
});

AnimatedContainer.displayName = 'AnimatedContainer';

