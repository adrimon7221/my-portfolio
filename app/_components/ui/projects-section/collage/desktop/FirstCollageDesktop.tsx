"use client";
import React from "react";
import { CLIP_PATHS } from "@/app/_constants/clipPaths";

interface FirstCollageDesktopProps {
  images: readonly string[];
  alt: string;
}

export const FirstCollageDesktop: React.FC<FirstCollageDesktopProps> = ({
  images,
  alt,
}) => {
  return (
    <>
      <div className="relative w-[600px] h-[608px] flex-shrink-0">
        <div
          className="absolute top-0 left-0 w-full h-[400px] overflow-visible rounded-[16px]"
          style={{
            clipPath: CLIP_PATHS.ROJO_DESKTOP_OUTER,
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
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="absolute bottom-[calc(200px+8px)] right-0 w-[200px] h-[200px] overflow-hidden rounded-[16px] transition-all">
          <img
            src={images[1]}
            alt={`${alt} 2`}
            className="w-full h-full object-cover rounded-[21px]"
          />
        </div>

        <div className="absolute bottom-0 right-[210px] w-[220px] h-[200px] overflow-hidden rounded-[16px] transition-all">
          <img
            src={images[3]}
            alt={`${alt} 4`}
            className="w-full h-full object-cover rounded-[21px]"
          />
        </div>
      </div>

      <div className="w-[200px] h-[400px] overflow-hidden rounded-[16px] transition-all flex-shrink-0">
        <img
          src={images[2]}
          alt={`${alt} 3`}
          className="w-full h-full object-cover rounded-[21px]"
        />
      </div>
    </>
  );
};

