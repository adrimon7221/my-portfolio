"use client";
import React from "react";
import { DecorativeCircleWrapper } from "../DecorativeCircleWrapper";
import { CLIP_PATHS } from "@/app/_constants/clipPaths";

interface FirstCollageMobileProps {
  images: readonly string[];
  alt: string;
  isInView?: boolean;
  circlePosition?: "left" | "right";
}

export const FirstCollageMobile: React.FC<FirstCollageMobileProps> = ({
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
        {/* Main large image in L shape - Rojo */}
        <div className="relative w-full aspect-[5/3] rounded-xl overflow-hidden">
          <svg className="absolute inset-0 w-0 h-0">
            <defs>
              <clipPath
                id="rojo-mobile-clip"
                clipPathUnits="objectBoundingBox"
              >
                <path d={CLIP_PATHS.ROJO_MOBILE} />
              </clipPath>
            </defs>
          </svg>
          <div
            className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-xl"
            style={{ clipPath: "url(#rojo-mobile-clip)" }}
          >
            <img
              src={images[0]}
              alt={`${alt} 1`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Small image in bottom-right corner - Verde */}
          <div
            className="absolute bottom-0 right-[2%] w-[30%] aspect-square overflow-hidden z-10"
            style={{ borderRadius: "10.5%" }}
          >
            <img
              src={images[1]}
              alt={`${alt} 2`}
              className="w-full h-full object-cover"
              style={{ borderRadius: "10.5%" }}
            />
          </div>
        </div>

        {/* Azul image - debajo del rojo y verde, centrada */}
        <div className="flex justify-center -mt-[11px]">
          <div className="w-[30%] aspect-square overflow-hidden rounded-xl">
            <img
              src={images[3]}
              alt={`${alt} 4`}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

