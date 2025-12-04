"use client";
import React from "react";
import { DecorativeCircleWrapper } from "../DecorativeCircleWrapper";
import { TRANSITION_DURATIONS, TRANSITION_TIMINGS } from "@/app/_constants/animations";

interface ThirdCollageMobileProps {
  images: readonly string[];
  alt: string;
  isInView?: boolean;
  circlePosition?: "left" | "right";
}

export const ThirdCollageMobile: React.FC<ThirdCollageMobileProps> = ({
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

      <div className="relative z-10 flex gap-2">
        {/* Lima y Rosado en columna a la izquierda */}
        <div className="flex flex-col gap-2 w-[30%]">
          {/* Lima image */}
          <div 
            className="group w-full aspect-square overflow-hidden rounded-xl transition-all duration-700 ease-out hover:transition-transform hover:duration-200 hover:scale-105 cursor-pointer"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: isInView ? '0ms' : '0ms',
            }}
          >
            <img
              src={images[1]}
              alt={`${alt} 2`}
              className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Rosado image */}
          <div 
            className="group w-full aspect-[1/2] overflow-hidden rounded-xl transition-all duration-700 ease-out hover:transition-transform hover:duration-200 hover:scale-105 cursor-pointer"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: isInView ? '200ms' : '0ms',
            }}
          >
            <img
              src={images[3]}
              alt={`${alt} 4`}
              className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>

        {/* Main large image - Blanco a la derecha */}
        <div
          className="group flex-1 rounded-xl overflow-hidden self-start transition-all duration-700 ease-out hover:transition-transform hover:duration-200 hover:scale-[1.02] cursor-pointer"
          style={{ 
            height: "calc(30vw * 2)",
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'scale(1)' : 'scale(0.95)',
            transitionDelay: isInView ? '400ms' : '0ms',
          }}
        >
          <img
            src={images[0]}
            alt={`${alt} 1`}
            className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
};

