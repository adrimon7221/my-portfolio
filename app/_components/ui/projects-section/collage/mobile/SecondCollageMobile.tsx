"use client";
import React from "react";
import { DecorativeCircleWrapper } from "../DecorativeCircleWrapper";
import { CLIP_PATHS } from "@/app/_constants/clipPaths";
import { TRANSITION_DURATIONS, TRANSITION_TIMINGS } from "@/app/_constants/animations";

interface SecondCollageMobileProps {
  images: readonly string[];
  alt: string;
  isInView?: boolean;
  circlePosition?: "left" | "right";
}

export const SecondCollageMobile: React.FC<SecondCollageMobileProps> = ({
  images,
  alt,
  isInView = true,
  circlePosition,
}) => {
  return (
    <div className="relative mb-6 rounded-3xl overflow-visible">
      <DecorativeCircleWrapper
        isMobile
        isInView={isInView}
        circlePosition={circlePosition}
      />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Celeste arriba, centrada */}
        <div className="flex justify-center">
          <div 
            className="group w-[30%] aspect-square overflow-hidden rounded-xl -translate-x-2 transition-all duration-700 ease-out hover:transition-transform hover:duration-200 hover:scale-105 cursor-pointer"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateX(-8px)' : 'translateX(-8px) scale(0.95)',
              transitionDelay: isInView ? '0ms' : '0ms',
            }}
          >
            <img
              src={images[1]}
              alt={`${alt} 2`}
              className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>

        {/* Main large image - Amarillo con clipPath */}
        <div className="relative w-full aspect-[5/3] rounded-xl overflow-visible -mt-3">
          <svg className="absolute inset-0 w-0 h-0">
            <defs>
              <clipPath
                id="amarillo-mobile-clip"
                clipPathUnits="objectBoundingBox"
              >
                <path d={CLIP_PATHS.AMARILLO_MOBILE} />
              </clipPath>
            </defs>
          </svg>
          <div
            className="group absolute top-0 left-0 w-full h-full overflow-hidden rounded-xl transition-all duration-700 ease-out hover:transition-transform hover:duration-200 hover:scale-[1.02] cursor-pointer"
            style={{ 
              clipPath: "url(#amarillo-mobile-clip)",
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'scale(1)' : 'scale(0.95)',
              transitionDelay: isInView ? '200ms' : '0ms',
            }}
          >
            <img
              src={images[0]}
              alt={`${alt} 1`}
              className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Gris image - dentro del recorte superior izquierdo */}
          <div 
            className="group absolute top-0 left-0 w-[30%] aspect-square overflow-hidden rounded-xl z-10 transition-all duration-700 ease-out hover:transition-transform hover:duration-200 hover:scale-105 cursor-pointer"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'scale(1)' : 'scale(0.95)',
              transitionDelay: isInView ? '400ms' : '0ms',
            }}
          >
            <img
              src={images[2]}
              alt={`${alt} 3`}
              className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

