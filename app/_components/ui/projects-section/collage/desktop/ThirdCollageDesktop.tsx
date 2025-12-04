"use client";
import React from "react";
import { TRANSITION_DURATIONS, TRANSITION_TIMINGS } from "@/app/_constants/animations";

interface ThirdCollageDesktopProps {
  images: readonly string[];
  alt: string;
  isInView?: boolean;
  baseDelay?: number;
}

export const ThirdCollageDesktop: React.FC<ThirdCollageDesktopProps> = ({
  images,
  alt,
  isInView = true,
  baseDelay = 0,
}) => {
  const imageDelay1 = baseDelay + 0;    // Lima
  const imageDelay2 = baseDelay + 150;  // Blanco
  const imageDelay3 = baseDelay + 300;  // Naranja
  const imageDelay4 = baseDelay + 450;  // Rosado
  return (
    <div className="flex gap-4 items-start h-[815px]">
      {/* Columna izquierda: Lima y Rosado */}
      <div className="flex flex-col gap-4 self-end">
        {/* Lima image */}
        <div 
          className="group w-[200px] h-[200px] overflow-hidden rounded-[16px] transition-all duration-700 ease-out hover:transition-transform hover:duration-200 hover:scale-105 cursor-pointer"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: isInView ? `${imageDelay1}ms` : '0ms',
          }}
        >
          <img
            src={images[1]}
            alt={`${alt} 2`}
            className="w-full h-full object-cover rounded-[21px] transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        {/* Rosado image */}
        <div 
          className="group w-[200px] h-[400px] overflow-hidden rounded-[16px] transition-all duration-700 ease-out hover:transition-transform hover:duration-200 hover:scale-105 cursor-pointer"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: isInView ? `${imageDelay4}ms` : '0ms',
          }}
        >
          <img
            src={images[3]}
            alt={`${alt} 4`}
            className="w-full h-full object-cover rounded-[21px] transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>

      {/* Centro: Blanco image */}
      <div 
        className="group w-[400px] h-[400px] overflow-hidden rounded-[16px] transition-all duration-700 ease-out mt-[200px] hover:transition-transform hover:duration-200 hover:scale-105 cursor-pointer"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'scale(1)' : 'scale(0.95)',
          transitionDelay: isInView ? `${imageDelay2}ms` : '0ms',
        }}
      >
        <img
          src={images[0]}
          alt={`${alt} 1`}
          className="w-full h-full object-cover rounded-[21px] transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Derecha: Naranja image */}
      <div 
        className="group w-[200px] h-[600px] overflow-hidden rounded-[16px] transition-all duration-700 ease-out self-start hover:transition-transform hover:duration-200 hover:scale-105 cursor-pointer"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0)' : 'translateY(20px)',
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

