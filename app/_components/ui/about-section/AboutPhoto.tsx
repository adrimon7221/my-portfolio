'use client';
import React from 'react';
import { ANIMATION_CLASSES } from '@/app/_constants/styles';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';

interface AboutPhotoProps {
  isInView: boolean;
  isResponsive?: boolean;
}

export const AboutPhoto: React.FC<AboutPhotoProps> = React.memo(({ 
  isInView, 
  isResponsive = false 
}) => {
  const containerClasses = isResponsive
    ? `mb-8 lg:hidden flex justify-center ${ANIMATION_CLASSES.FADE_IN_FROM_BOTTOM(isInView)}`
    : `hidden lg:flex mt-8 lg:mt-20 justify-center lg:justify-end ${ANIMATION_CLASSES.FADE_IN_FROM_RIGHT(isInView)}`;

  const transitionDelay = isResponsive
    ? ANIMATION_DELAYS.TITLE_DELAY + 240
    : ANIMATION_DELAYS.TITLE_DELAY + 400;

  const maxWidthClasses = isResponsive
    ? 'max-w-[280px] sm:max-w-[320px]'
    : 'max-w-[350px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px]';

  const circlePosition = isResponsive
    ? 'top-[35%] left-full -translate-x-1/3'
    : 'top-[15%] left-1/2 -translate-x-1/2';

  const circleSize = isResponsive
    ? { width: '470px', height: '470px' }
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
              {/* Móvil: círculo pequeño */}
              <div className="md:hidden">
                <div
                  style={{ width: '350px', height: '350px' }}
                  className="rounded-full border-2 border-white/20"
                />
              </div>
              {/* Tablet: círculo mediano */}
              <div className="hidden md:block lg:hidden">
                <div
                  style={{ width: '520px', height: '520px' }}
                  className="rounded-full border-2 border-white/20"
                />
              </div>
              {/* Desktop: círculo grande */}
              <div className="hidden lg:block">
                <div
                  style={{ width: '650px', height: '650px' }}
                  className="rounded-full border-2 border-white/20"
                />
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
          <img
            src="/images/profile.jpg"
            alt="Nikita - Full-stack Developer"
            className={`w-full h-auto object-cover transition-all duration-700 ease-out ${
              isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ transitionDelay: isInView ? `${transitionDelay + 200}ms` : '0ms' }}
          />
        </div>
      </div>
    </div>
  );
});

AboutPhoto.displayName = 'AboutPhoto';

