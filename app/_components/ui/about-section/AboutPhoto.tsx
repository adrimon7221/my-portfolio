'use client';
import React from 'react';
import { ANIMATION_CLASSES } from '@/app/_constants/styles';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';
import { ABOUT_PHOTO_CONFIG, ABOUT_ANIMATION_DELAYS } from '@/app/_constants/about';
import { DecorativeCircle } from '@/app/_components/ui/hero-section/DecorativeCircle';

interface AboutPhotoProps {
  isInView: boolean;
  isResponsive?: boolean;
  profileImageUrl?: string;
}

const IMAGE_ALT = 'Nikita - Full-stack Developer';
const DEFAULT_IMAGE_SRC = '/images/profile/profile.jpg';

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
  isResponsive = false,
  profileImageUrl = DEFAULT_IMAGE_SRC
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
            <DecorativeCircle customSize={circleSize} />
          ) : (
            <>
              {/* Mobile: small circle */}
              <div className="md:hidden">
                <DecorativeCircle customSize={DESKTOP.CIRCLE.MOBILE} />
              </div>
              {/* Tablet: medium circle */}
              <div className="hidden md:block lg:hidden">
                <DecorativeCircle customSize={DESKTOP.CIRCLE.TABLET} />
              </div>
              {/* Desktop: large circle */}
              <div className="hidden lg:block">
                <DecorativeCircle customSize={DESKTOP.CIRCLE.DESKTOP} />
              </div>
            </>
          )}
        </div>

        <div className={`rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-10 w-full ${isResponsive ? 'h-[280px] sm:h-[320px]' : 'h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px]'}`}>
          <img
            src={profileImageUrl}
            alt={IMAGE_ALT}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ 
              transitionDelay: isInView 
                ? `${transitionDelay + ABOUT_ANIMATION_DELAYS.IMAGE_DELAY_OFFSET}ms` 
                : '0ms' 
            }}
            onError={(e) => {
              // Si la imagen no se puede cargar, usar la imagen por defecto
              if (e.currentTarget.src !== DEFAULT_IMAGE_SRC) {
                e.currentTarget.src = DEFAULT_IMAGE_SRC
              }
            }}
          />
        </div>
      </div>
    </div>
  );
});

AboutPhoto.displayName = 'AboutPhoto';

