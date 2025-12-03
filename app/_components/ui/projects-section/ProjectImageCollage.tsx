'use client';
import React from 'react';
import { DecorativeCircle } from '../hero-section';
import { DESKTOP_CONFIG, MOBILE_CONFIG } from '@/app/_constants/projects';

/**
 * ProjectImageCollage Component
 * 
 * Displays a collage of project images with decorative circle background.
 * 
 * @param images - Array of image source URLs
 * @param alt - Alt text for the images
 * @param isInView - Whether the component is in view (for animations)
 * @param transitionDelay - Animation delay in milliseconds
 * @param isReversed - Whether this is a reversed layout (for desktop)
 * @param isMobile - Whether this is the mobile layout
 * @param circlePosition - Position of the circle (for mobile: 'left' | 'right')
 */
interface ProjectImageCollageProps {
  images: readonly string[];
  alt: string;
  isInView?: boolean;
  transitionDelay?: number;
  isReversed?: boolean;
  isMobile?: boolean;
  circlePosition?: 'left' | 'right';
}

const ProjectImageCollage: React.FC<ProjectImageCollageProps> = React.memo(({
  images,
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
      <div className="relative mb-6 rounded-3xl overflow-visible">
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
        
        {/* Image Collage - Mobile Layout */}
        <div className="relative z-10 h-[400px]">
          {/* Main large image in L shape */}
          <div className="absolute top-0 left-0 overflow-visible rounded-xl" 
               style={{ 
                 width: '100%', 
                 height: '100%',
                 clipPath: 'polygon(0 0, 100% 0, 100% 68%, 68% 68%, 68% 100%, 0 100%)'
               }}>
            <div className="absolute inset-[2px] overflow-hidden rounded-xl"
                 style={{ 
                   clipPath: 'polygon(0 0, 100% 0, 100% calc(68% - 2px), calc(68% - 2px) calc(68% - 2px), calc(68% - 2px) calc(100% - 2px), 0 calc(100% - 2px))'
                 }}>
              <img 
                src={images[0]} 
                alt={`${alt} 1`} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
          
          {/* Small image in bottom-right corner */}
          <div className="absolute bottom-0 right-0 w-[30%] aspect-square overflow-hidden rounded-lg">
            <img 
              src={images[1]} 
              alt={`${alt} 2`} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  const circleStyle = isReversed
    ? {
        top: DESKTOP_CONFIG.CIRCLE.POSITION.REVERSED.top,
        right: DESKTOP_CONFIG.CIRCLE.POSITION.REVERSED.right,
        transform: `translate(${DESKTOP_CONFIG.CIRCLE.POSITION.REVERSED.translateX}, -50%)`,
      }
    : {
        top: DESKTOP_CONFIG.CIRCLE.POSITION.NORMAL.top,
        left: DESKTOP_CONFIG.CIRCLE.POSITION.NORMAL.left,
        transform: `translate(${DESKTOP_CONFIG.CIRCLE.POSITION.NORMAL.translateX}, -50%)`,
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

      {/* Image Collage - Desktop Layout */}
      <div
        className="relative z-10 transition-all duration-700 flex gap-4"
        style={{
          opacity: isInView ? 1 : 0,
          transform: `scale(${isInView ? 1 : 0.95})`,
          transitionDelay: isInView ? `${transitionDelay}ms` : '0ms',
        }}
      >
        {/* Left section: L-shape red + yellow square */}
        <div className="relative w-[600px] h-[608px] flex-shrink-0">
          {/* Main large image in L shape (red area) */}
          <div className="absolute top-0 left-0 w-full h-[400px] overflow-visible rounded-[16px]"
               style={{ 
                 clipPath: `path('M 32 0 L 568 0 C 585.673 0 600 14.327 600 32 L 600 168 C 600 180.703 589.703 191 577 191 L 409 191 C 396.297 191 386 201.297 386 214 L 386 368 C 386 385.673 371.673 400 354 400 L 32 400 C 14.327 400 0 385.673 0 368 L 0 32 C 0 14.327 14.327 0 32 0 Z')`
               }}>
            <div className="absolute inset-0 overflow-hidden rounded-[16px]"
                 style={{ 
                   clipPath: `path('M 34 2 L 566 2 C 583.673 2 598 16.327 598 34 L 598 166 C 598 178.703 587.703 189 575 189 L 411 189 C 398.297 189 388 199.297 388 212 L 388 366 C 388 383.673 373.673 398 356 398 L 34 398 C 16.327 398 2 383.673 2 366 L 2 34 C 2 16.327 16.327 2 34 2 Z')`
                 }}>
              <img 
                src={images[0]} 
                alt={`${alt} 1`} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
          
          {/* Green square - above blue */}
          <div className="absolute bottom-[calc(200px+8px)] right-0 w-[200px] h-[200px] overflow-hidden rounded-[16px] transition-all">
            <img 
              src={images[1]} 
              alt={`${alt} 2`} 
              className="w-full h-full object-cover rounded-[21px]" 
            />
          </div>
          
          {/* Blue square - bottom */}
          <div className="absolute bottom-0 right-[210px] w-[200px] h-[200px] overflow-hidden rounded-[16px] transition-all">
            <img 
              src={images[3]} 
              alt={`${alt} 4`} 
              className="w-full h-full object-cover rounded-[21px]" 
            />
          </div>
        </div>

        {/* Right section: Purple image (same height as red) */}
        <div className="w-[200px] h-[400px] overflow-hidden rounded-[16px] transition-all flex-shrink-0">
          <img 
            src={images[2]} 
            alt={`${alt} 3`} 
            className="w-full h-full object-cover rounded-[21px]" 
          />
        </div>
      </div>
    </div>
  );
});

ProjectImageCollage.displayName = 'ProjectImageCollage';

export { ProjectImageCollage };