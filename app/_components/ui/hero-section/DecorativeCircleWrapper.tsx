import React from 'react';
import { DecorativeCircle } from './DecorativeCircle';

interface DecorativeCircleWrapperProps {
  mounted: boolean;
}

/**
 * Wrapper component for the decorative circle with responsive positioning and animations
 */
export const DecorativeCircleWrapper: React.FC<DecorativeCircleWrapperProps> = React.memo(({ mounted }) => {
  return (
    <div
      aria-hidden
      className={`absolute top-0 right-0 pointer-events-none transition-transform duration-700 ease-out ${
        mounted
          ? "opacity-100 scale-100"
          : "opacity-0 translate-y-8 scale-95"
      } ${
        // Móvil: en la esquina superior derecha
        "-translate-y-1/2 translate-x-1/2 " +
        // Desktop: posición original
        "lg:translate-x-1/4 lg:-translate-y-[40%]"
      }`}
    >
      {/* Móvil: círculo pequeño */}
      <div className="lg:hidden">
        <DecorativeCircle size="sm" />
      </div>
      {/* Desktop: círculo grande */}
      <div className="hidden lg:block">
        <DecorativeCircle size="lg" />
      </div>
    </div>
  );
});

DecorativeCircleWrapper.displayName = 'DecorativeCircleWrapper';

