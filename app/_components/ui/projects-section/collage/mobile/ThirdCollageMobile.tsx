"use client";
import React from "react";
import { DecorativeCircleWrapper } from "../DecorativeCircleWrapper";

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
          <div className="w-full aspect-square overflow-hidden rounded-xl">
            <img
              src={images[1]}
              alt={`${alt} 2`}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* Rosado image */}
          <div className="w-full aspect-[1/2] overflow-hidden rounded-xl">
            <img
              src={images[3]}
              alt={`${alt} 4`}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Main large image - Blanco a la derecha */}
        <div
          className="flex-1 rounded-xl overflow-hidden self-start"
          style={{ height: "calc(30vw * 2)" }}
        >
          <img
            src={images[0]}
            alt={`${alt} 1`}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

