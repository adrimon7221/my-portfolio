"use client";
import React from "react";
import { DecorativeCircle } from "../../hero-section";
import { DESKTOP_CONFIG, MOBILE_CONFIG } from "@/app/_constants/projects";
import { TRANSITION_DURATIONS, TRANSITION_TIMINGS } from "@/app/_constants/animations";

interface DecorativeCircleWrapperProps {
  isMobile?: boolean;
  isInView?: boolean;
  circlePosition?: 'left' | 'right';
  isReversed?: boolean;
}

export const DecorativeCircleWrapper: React.FC<DecorativeCircleWrapperProps> = ({
  isMobile = false,
  isInView = true,
  circlePosition,
  isReversed = false,
}) => {
  if (isMobile) {
    const positionClasses =
      circlePosition === "right"
        ? "right-0 translate-x-1/2"
        : "left-0 -translate-x-1/2";

    return (
      <div
        className={`absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all z-0 ${positionClasses} ${
          isInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          transitionDuration: `${TRANSITION_DURATIONS.NORMAL}ms`,
          transitionTimingFunction: TRANSITION_TIMINGS.EASE_OUT,
        }}
      >
        <DecorativeCircle
          customSize={MOBILE_CONFIG.CIRCLE.SIZE}
          className="!border !border-white/10"
        />
      </div>
    );
  }

  // Desktop
  const circleStyle = isReversed
    ? {
        top: DESKTOP_CONFIG.CIRCLE.POSITION.REVERSED.top,
        right: DESKTOP_CONFIG.CIRCLE.POSITION.REVERSED.right,
        transform: `translate(${DESKTOP_CONFIG.CIRCLE.POSITION.REVERSED.translateX}, -50%)`,
      }
    : {
        top: DESKTOP_CONFIG.CIRCLE.POSITION.NORMAL.top,
        left: DESKTOP_CONFIG.CIRCLE.POSITION.NORMAL.left,
        transform: `translate(${DESKTOP_CONFIG.CIRCLE.POSITION.NORMAL.translateX}, -50%)`,
      };

  return (
    <div
      className="absolute pointer-events-none transition-all z-0"
      style={{
        ...circleStyle,
        opacity: isInView ? 1 : 0,
        transform: `${circleStyle.transform} scale(${isInView ? 1 : 0.95})`,
        transitionDuration: `${TRANSITION_DURATIONS.NORMAL}ms`,
        transitionTimingFunction: TRANSITION_TIMINGS.EASE_OUT,
      }}
    >
      <DecorativeCircle
        customSize={DESKTOP_CONFIG.CIRCLE.SIZE}
        className="border-white/10"
      />
    </div>
  );
};

