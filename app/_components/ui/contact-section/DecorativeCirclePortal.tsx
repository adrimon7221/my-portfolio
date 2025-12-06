'use client';
import React from 'react';
import { createPortal } from 'react-dom';
import { DecorativeCircle } from '../hero-section/DecorativeCircle';
import { CONTACT_CIRCLE_CONFIG, CONTACT_ANIMATION_DELAYS } from '@/app/_constants/contact';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';
import { TRANSITION_DURATIONS, TRANSITION_TIMINGS } from '@/app/_constants/animations';

interface DecorativeCirclePortalProps {
  circleWrapperRef: React.RefObject<HTMLDivElement | null>;
  isInView: boolean;
  mounted: boolean;
}

/**
 * DecorativeCirclePortal Component
 * 
 * Renders decorative circle as a portal to document.body with animations.
 * 
 * @param circleWrapperRef - Ref to the circle wrapper element
 * @param isInView - Whether the section is in viewport
 * @param mounted - Whether the component has mounted
 */
export const DecorativeCirclePortal: React.FC<DecorativeCirclePortalProps> = React.memo(({
  circleWrapperRef,
  isInView,
  mounted,
}) => {
  if (!mounted) return null;

  const delay = isInView ? ANIMATION_DELAYS.TITLE_DELAY + CONTACT_ANIMATION_DELAYS.CIRCLE : 0;

  return createPortal(
    <div
      ref={circleWrapperRef}
      style={{
        position: 'fixed',
        width: CONTACT_CIRCLE_CONFIG.SIZE.width,
        height: CONTACT_CIRCLE_CONFIG.SIZE.height,
        zIndex: CONTACT_CIRCLE_CONFIG.Z_INDEX,
        pointerEvents: 'none',
        display: 'block',
        visibility: 'visible',
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'scale(1)' : 'scale(0.95)',
        transition: `opacity ${TRANSITION_DURATIONS.SLOW}ms ${TRANSITION_TIMINGS.EASE_OUT}, transform ${TRANSITION_DURATIONS.SLOW}ms ${TRANSITION_TIMINGS.EASE_OUT}`,
        transitionDelay: `${delay}ms`,
      }}
    >
      <DecorativeCircle
        customSize={CONTACT_CIRCLE_CONFIG.SIZE}
        className="opacity-50"
      />
    </div>,
    document.body
  );
});

DecorativeCirclePortal.displayName = 'DecorativeCirclePortal';

