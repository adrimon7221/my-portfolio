"use client";
import React from "react";
import { CLIP_PATHS } from "@/app/_constants/clipPaths";

interface SecondCollageDesktopProps {
  images: readonly string[];
  alt: string;
}

export const SecondCollageDesktop: React.FC<SecondCollageDesktopProps> = ({
  images,
  alt,
}) => {
  return (
    <div className="relative w-[816px] h-[605px] flex-shrink-0">
      {/* Yellow image - with cutouts */}
      <div
        className="absolute bottom-0 left-0 w-full h-[400px] overflow-visible rounded-[16px]"
        style={{
          clipPath: CLIP_PATHS.AMARILLO_DESKTOP_OUTER,
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
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Gris image - top-left corner */}
      <div className="absolute top-[205px] left-0 w-[200px] h-[200px] overflow-hidden rounded-[16px] transition-all">
        <img
          src={images[2]}
          alt={`${alt} 3`}
          className="w-full h-full object-cover rounded-[21px]"
        />
      </div>

      {/* Celeste image - bottom-right corner */}
      <div className="absolute top-0 left-[210px] w-[200px] h-[200px] overflow-hidden rounded-[16px] transition-all">
        <img
          src={images[1]}
          alt={`${alt} 2`}
          className="w-full h-full object-cover rounded-[21px]"
        />
      </div>
    </div>
  );
};

