"use client";
import React from "react";

interface ThirdCollageDesktopProps {
  images: readonly string[];
  alt: string;
}

export const ThirdCollageDesktop: React.FC<ThirdCollageDesktopProps> = ({
  images,
  alt,
}) => {
  return (
    <div className="flex gap-4 items-start h-[815px]">
      {/* Columna izquierda: Lima y Rosado */}
      <div className="flex flex-col gap-4 self-end">
        {/* Lima image */}
        <div className="w-[200px] h-[200px] overflow-hidden rounded-[16px] transition-all">
          <img
            src={images[1]}
            alt={`${alt} 2`}
            className="w-full h-full object-cover rounded-[21px]"
          />
        </div>
        {/* Rosado image */}
        <div className="w-[200px] h-[400px] overflow-hidden rounded-[16px] transition-all">
          <img
            src={images[3]}
            alt={`${alt} 4`}
            className="w-full h-full object-cover rounded-[21px]"
          />
        </div>
      </div>

      {/* Centro: Blanco image */}
      <div className="w-[400px] h-[400px] overflow-hidden rounded-[16px] transition-all mt-[200px]">
        <img
          src={images[0]}
          alt={`${alt} 1`}
          className="w-full h-full object-cover rounded-[21px]"
        />
      </div>

      {/* Derecha: Naranja image */}
      <div className="w-[200px] h-[600px] overflow-hidden rounded-[16px] transition-all self-start">
        <img
          src={images[2]}
          alt={`${alt} 3`}
          className="w-full h-full object-cover rounded-[21px]"
        />
      </div>
    </div>
  );
};

