"use client";
import React from "react";

/**
 * ClipPathImage Component
 * 
 * Reusable component for displaying images with SVG clipPath.
 */

interface ClipPathImageProps {
  src: string;
  alt: string;
  clipPathId: string;
  clipPathData: string;
  className?: string;
  containerClassName?: string;
}

export const ClipPathImage: React.FC<ClipPathImageProps> = ({
  src,
  alt,
  clipPathId,
  clipPathData,
  className = '',
  containerClassName = '',
}) => {
  return (
    <div className={`relative ${containerClassName}`}>
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <clipPath id={clipPathId} clipPathUnits="objectBoundingBox">
            <path d={clipPathData} />
          </clipPath>
        </defs>
      </svg>
      <div
        className={`absolute top-0 left-0 w-full h-full overflow-hidden rounded-xl ${className}`}
        style={{ clipPath: `url(#${clipPathId})` }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

