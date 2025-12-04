"use client";
import React from "react";
import { DecorativeCircleWrapper } from "../DecorativeCircleWrapper";
import { CLIP_PATHS } from "@/app/_constants/clipPaths";

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
          <div className="w-[30%] aspect-square overflow-hidden rounded-xl -translate-x-2">
            <img
              src={images[1]}
              alt={`${alt} 2`}
              className="w-full h-full object-cover rounded-xl"
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
            className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-xl"
            style={{ clipPath: "url(#amarillo-mobile-clip)" }}
          >
            <img
              src={images[0]}
              alt={`${alt} 1`}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* Gris image - dentro del recorte superior izquierdo */}
          <div className="absolute top-0 left-0 w-[30%] aspect-square overflow-hidden rounded-xl z-10">
            <img
              src={images[2]}
              alt={`${alt} 3`}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

