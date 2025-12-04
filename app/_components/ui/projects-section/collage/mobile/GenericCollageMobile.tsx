"use client";
import React from "react";
import { DecorativeCircleWrapper } from "../DecorativeCircleWrapper";

interface GenericCollageMobileProps {
  images: readonly string[];
  alt: string;
  isInView?: boolean;
  circlePosition?: "left" | "right";
}

export const GenericCollageMobile: React.FC<GenericCollageMobileProps> = ({
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

      <div className="relative z-10 h-[400px]">
        {/* Main large image in L shape */}
        <div
          className="absolute top-0 left-0 overflow-visible rounded-xl"
          style={{
            width: "100%",
            height: "100%",
            clipPath:
              "polygon(0 0, 100% 0, 100% 68%, 68% 68%, 68% 100%, 0 100%)",
          }}
        >
          <div
            className="absolute inset-[2px] overflow-hidden rounded-xl"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% calc(68% - 2px), calc(68% - 2px) calc(68% - 2px), calc(68% - 2px) calc(100% - 2px), 0 calc(100% - 2px))",
            }}
          >
            <img
              src={images[0]}
              alt={`${alt} 1`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Small image in bottom-right corner */}
        <div className="absolute bottom-0 right-0 w-[30%] aspect-square overflow-hidden rounded-lg">
          <img
            src={images[1]}
            alt={`${alt} 2`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

