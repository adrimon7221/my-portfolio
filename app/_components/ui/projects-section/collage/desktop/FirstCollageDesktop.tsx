"use client";
import React from "react";
import { CLIP_PATHS } from "@/app/_constants/clipPaths";
import { TRANSITION_DURATIONS, TRANSITION_TIMINGS } from "@/app/_constants/animations";

interface FirstCollageDesktopProps {
  images: readonly string[];
  alt: string;
  isInView?: boolean;
  baseDelay?: number;
}

export const FirstCollageDesktop: React.FC<FirstCollageDesktopProps> = ({
  images,
  alt,
  isInView = true,
  baseDelay = 0,
}) => {
  const imageDelay1 = baseDelay + 0;    // Rojo
  const imageDelay2 = baseDelay + 150;  // Verde
  const imageDelay3 = baseDelay + 300;  // Morado
  const imageDelay4 = baseDelay + 450;  // Azul
  return (
    <>
      <div className="relative w-[600px] h-[608px] flex-shrink-0">
        <div
          className="group absolute top-0 left-0 w-full h-[400px] overflow-visible rounded-[16px] transition-all duration-700 ease-out hover:transition-transform hover:duration-200 hover:scale-[1.02] cursor-pointer"
          style={{
            clipPath: CLIP_PATHS.ROJO_DESKTOP_OUTER,
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'scale(1)' : 'scale(0.95)',
            transitionDelay: isInView ? `${imageDelay1}ms` : '0ms',
          }}
        >
          <div
            className="absolute inset-0 overflow-hidden rounded-[16px]"
            style={{
              clipPath: CLIP_PATHS.ROJO_DESKTOP_INNER,
            }}
          >
            <img
              src={images[0]}
              alt={`${alt} 1`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>

        <div 
          className="group absolute bottom-[calc(200px+8px)] right-0 w-[200px] h-[200px] overflow-hidden rounded-[16px] transition-all duration-700 ease-out hover:transition-transform hover:duration-200 hover:scale-105 cursor-pointer"
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

        <div 
          className="group absolute bottom-0 right-[210px] w-[220px] h-[200px] overflow-hidden rounded-[16px] transition-all duration-700 ease-out hover:transition-transform hover:duration-200 hover:scale-105 cursor-pointer"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'scale(1)' : 'scale(0.95)',
            transitionDelay: isInView ? `${imageDelay3}ms` : '0ms',
          }}
        >
          <img
            src={images[3]}
            alt={`${alt} 4`}
            className="w-full h-full object-cover rounded-[21px] transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>

      <div 
        className="group w-[200px] h-[400px] overflow-hidden rounded-[16px] transition-all duration-700 ease-out flex-shrink-0 hover:transition-transform hover:duration-200 hover:scale-105 cursor-pointer"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0)' : 'translateY(20px)',
          transitionDelay: isInView ? `${imageDelay4}ms` : '0ms',
        }}
      >
        <img
          src={images[2]}
          alt={`${alt} 3`}
          className="w-full h-full object-cover rounded-[21px] transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </>
  );
};

