'use client';
import React from 'react';
import { ANIMATION_CLASSES } from '@/app/_constants/styles';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';
import { ABOUT_PHOTO_CONFIG, ABOUT_ANIMATION_DELAYS } from '@/app/_constants/about';

interface AboutPhotoProps {
  isInView: boolean;
  isResponsive?: boolean;
}

const IMAGE_ALT = 'Nikita - Full-stack Developer';
const IMAGE_SRC = '/images/profile.jpg';

/**
 * AboutPhoto Component
 * 
 * Displays the profile photo with decorative circle and animations.
 * 
 * @param isInView - Whether the component is in viewport
 * @param isResponsive - Whether to show responsive layout (mobile) or desktop layout
 */
export const AboutPhoto: React.FC<AboutPhotoProps> = React.memo(({ 
  isInView, 
  isResponsive = false 
}) => {
  const { RESPONSIVE, DESKTOP } = ABOUT_PHOTO_CONFIG;

  const containerClasses = isResponsive
    ? `mb-8 lg:hidden flex justify-center ${ANIMATION_CLASSES.FADE_IN_FROM_BOTTOM(isInView)}`
    : `hidden lg:flex mt-8 lg:mt-20 justify-center lg:justify-end ${ANIMATION_CLASSES.FADE_IN_FROM_RIGHT(isInView)}`;

  const transitionDelay = isResponsive
    ? ANIMATION_DELAYS.TITLE_DELAY + ABOUT_ANIMATION_DELAYS.PHOTO_RESPONSIVE
    : ANIMATION_DELAYS.TITLE_DELAY + ABOUT_ANIMATION_DELAYS.PHOTO_DESKTOP;

  const maxWidthClasses = isResponsive
    ? 'max-w-[280px] sm:max-w-[320px]'
    : 'max-w-[350px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px]';

  const circlePosition = isResponsive
    ? RESPONSIVE.CIRCLE.POSITION
    : DESKTOP.CIRCLE.POSITION;

  const circleSize = isResponsive
    ? RESPONSIVE.CIRCLE.SIZE
    : undefined;

  return (
    <div
      className={containerClasses}
      style={{ transitionDelay: isInView ? `${transitionDelay}ms` : '0ms' }}
    >
      <div className={`relative w-full ${maxWidthClasses}`}>
        {/* Decorative Circle */}
        <div
          aria-hidden
          className={`absolute ${circlePosition} -translate-y-1/2 pointer-events-none transition-opacity duration-700 ease-out -z-10 overflow-hidden ${
            isInView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {isResponsive ? (
            <div
              style={circleSize}
              className="rounded-full border-2 border-white/20"
            />
          ) : (
            <>
              {/* Mobile: small circle */}
              <div className="md:hidden">
                <div
                  style={DESKTOP.CIRCLE.MOBILE}
                  className="rounded-full border-2 border-white/20"
                />
              </div>
              {/* Tablet: medium circle */}
              <div className="hidden md:block lg:hidden">
                <div
                  style={DESKTOP.CIRCLE.TABLET}
                  className="rounded-full border-2 border-white/20"
                />
              </div>
              {/* Desktop: large circle */}
              <div className="hidden lg:block">
                <div
                  style={DESKTOP.CIRCLE.DESKTOP}
                  className="rounded-full border-2 border-white/20"
                />
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
          <img
            src={IMAGE_SRC}
            alt={IMAGE_ALT}
            className={`w-full h-auto object-cover transition-all duration-700 ease-out ${
              isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ 
              transitionDelay: isInView 
                ? `${transitionDelay + ABOUT_ANIMATION_DELAYS.IMAGE_DELAY_OFFSET}ms` 
                : '0ms' 
            }}
          />
        </div>
      </div>
    </div>
  );
});

AboutPhoto.displayName = 'AboutPhoto';

