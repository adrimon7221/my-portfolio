"use client";
import React from "react";
import { CLIP_PATHS } from "@/app/_constants/clipPaths";
import { TRANSITION_DURATIONS, TRANSITION_TIMINGS } from "@/app/_constants/animations";

interface SecondCollageDesktopProps {
  images: readonly string[];
  alt: string;
  isInView?: boolean;
  baseDelay?: number;
}

export const SecondCollageDesktop: React.FC<SecondCollageDesktopProps> = ({
  images,
  alt,
  isInView = true,
  baseDelay = 0,
}) => {
  const imageDelay1 = baseDelay + 0;    // Amarillo
  const imageDelay2 = baseDelay + 150;  // Celeste
  const imageDelay3 = baseDelay + 300;  // Gris
  return (
    <div className="relative w-[816px] h-[605px] flex-shrink-0">
      {/* Yellow image - with cutouts */}
      <div
        className="group absolute bottom-0 left-0 w-full h-[400px] overflow-visible rounded-[16px] transition-all duration-700 ease-out hover:transition-transform hover:duration-200 hover:scale-[1.02] cursor-pointer"
        style={{
          clipPath: CLIP_PATHS.AMARILLO_DESKTOP_OUTER,
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'scale(1)' : 'scale(0.95)',
          transitionDelay: isInView ? `${imageDelay1}ms` : '0ms',
        }}
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-[16px]"
          style={{
            clipPath: CLIP_PATHS.AMARILLO_DESKTOP_INNER,
          }}
        >
          <img
            src={images[0]}
            alt={`${alt} 1`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>

      {/* Celeste image - bottom-right corner */}
      <div 
        className="group absolute top-0 left-[210px] w-[200px] h-[200px] overflow-hidden rounded-[16px] transition-all duration-700 ease-out hover:transition-transform hover:duration-200 hover:scale-105 cursor-pointer"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'scale(1)' : 'scale(0.95)',
          transitionDelay: isInView ? `${imageDelay2}ms` : '0ms',
        }}
      >
        <img
          src={images[1]}
          alt={`${alt} 2`}
          className="w-full h-full object-cover rounded-[21px] transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Gris image - top-left corner */}
      <div 
        className="group absolute top-[205px] left-0 w-[200px] h-[200px] overflow-hidden rounded-[16px] transition-all duration-700 ease-out hover:transition-transform hover:duration-200 hover:scale-105 cursor-pointer"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'scale(1)' : 'scale(0.95)',
          transitionDelay: isInView ? `${imageDelay3}ms` : '0ms',
        }}
      >
        <img
          src={images[2]}
          alt={`${alt} 3`}
          className="w-full h-full object-cover rounded-[21px] transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </div>
  );
};

