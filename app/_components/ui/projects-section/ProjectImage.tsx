'use client';
import React from 'react';
import { DecorativeCircle } from '../hero-section';
import { DESKTOP_CONFIG, MOBILE_CONFIG } from '@/app/_constants/projects';
import { CirclePosition } from '@/app/_types';

/**
 * ProjectImage Component
 * 
 * Displays project image with decorative circle background.
 * 
 * @param image - Image source URL
 * @param alt - Alt text for the image
 * @param isInView - Whether the component is in view (for animations)
 * @param transitionDelay - Animation delay in milliseconds
 * @param isReversed - Whether this is a reversed layout (for desktop)
 * @param isMobile - Whether this is the mobile layout
 * @param circlePosition - Position of the circle (for mobile: 'left' | 'right')
 */
interface ProjectImageProps {
  image: string;
  alt: string;
  isInView?: boolean;
  transitionDelay?: number;
  isReversed?: boolean;
  isMobile?: boolean;
  circlePosition?: CirclePosition;
}

const ProjectImage: React.FC<ProjectImageProps> = React.memo(({
  image,
  alt,
  isInView = true,
  transitionDelay = 0,
  isReversed = false,
  isMobile = false,
  circlePosition,
}) => {
  if (isMobile) {
    const positionClasses = circlePosition === 'right'
      ? 'right-0 translate-x-1/2'
      : 'left-0 -translate-x-1/2';

    return (
      <div className="relative mb-6 rounded-3xl overflow-visible border-2 border-white/20">
        {/* Decorative Circle */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-1000 ease-out z-0 ${positionClasses} ${
            isInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <DecorativeCircle 
            customSize={MOBILE_CONFIG.CIRCLE.SIZE} 
            className="!border !border-white/10" 
          />
        </div>
        
        {/* Image */}
        <div className="relative z-10 rounded-3xl overflow-hidden">
          <img 
            src={image} 
            alt={alt} 
            className="w-full h-64 object-cover" 
          />
        </div>
      </div>
    );
  }

  // Desktop layout
  const circleConfig = isReversed 
    ? DESKTOP_CONFIG.CIRCLE.POSITION.REVERSED
    : DESKTOP_CONFIG.CIRCLE.POSITION.NORMAL;

  const circleStyle = isReversed
    ? {
        top: circleConfig.top,
        right: circleConfig.right,
        transform: `translate(${circleConfig.translateX}, -50%)`,
      }
    : {
        top: circleConfig.top,
        left: circleConfig.left,
        transform: `translate(${circleConfig.translateX}, -50%)`,
      };

  return (
    <div className="relative flex items-start justify-end min-h-[600px]">
      {/* Decorative Circle */}
      <div
        className="absolute pointer-events-none transition-all duration-1000 ease-out z-0"
        style={{
          ...circleStyle,
          opacity: isInView ? 1 : 0,
          transform: `${circleStyle.transform} scale(${isInView ? 1 : 0.95})`,
        }}
      >
        <DecorativeCircle 
          customSize={DESKTOP_CONFIG.CIRCLE.SIZE} 
          className="border-white/10" 
        />
      </div>

      {/* Image */}
      <div
        className="relative z-10 transition-all duration-700"
        style={{
          opacity: isInView ? 1 : 0,
          transform: `scale(${isInView ? 1 : 0.95})`,
          transitionDelay: isInView ? `${transitionDelay}ms` : '0ms',
        }}
      >
        <div className="rounded-3xl overflow-hidden border-2 border-white/20 hover:border-white/40 transition-all w-[830px] h-[555px]">
          <img 
            src={image} 
            alt={alt} 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>
    </div>
  );
});

ProjectImage.displayName = 'ProjectImage';

export { ProjectImage };

