"use client";
import React from "react";
import {
  FirstCollageMobile,
  SecondCollageMobile,
  ThirdCollageMobile,
  GenericCollageMobile,
  FirstCollageDesktop,
  SecondCollageDesktop,
  ThirdCollageDesktop,
  DecorativeCircleWrapper,
  getCollageType,
} from "./collage";
import { TRANSITION_DURATIONS, TRANSITION_TIMINGS } from "@/app/_constants/animations";

/**
 * ProjectImageCollage Component
 *
 * Displays a collage of project images with decorative circle background.
 * Automatically selects the appropriate collage layout based on image count and content.
 *
 * @param images - Array of image source URLs
 * @param alt - Alt text for the images
 * @param isInView - Whether the component is in view (for animations)
 * @param transitionDelay - Animation delay in milliseconds
 * @param isReversed - Whether this is a reversed layout (for desktop)
 * @param isMobile - Whether this is the mobile layout
 * @param circlePosition - Position of the circle (for mobile: 'left' | 'right')
 */
interface ProjectImageCollageProps {
  images: readonly string[];
  alt: string;
  isInView?: boolean;
  transitionDelay?: number;
  isReversed?: boolean;
  isMobile?: boolean;
  circlePosition?: "left" | "right";
}

const ProjectImageCollage: React.FC<ProjectImageCollageProps> = React.memo(
  ({
    images,
    alt,
    isInView = true,
    transitionDelay = 0,
    isReversed = false,
    isMobile = false,
    circlePosition,
  }) => {
    // Mobile Layout
    if (isMobile) {
      const collageType = getCollageType(images);

      const mobileProps = {
        images,
        alt,
        isInView,
        circlePosition,
      };

      switch (collageType) {
        case "first":
          return <FirstCollageMobile {...mobileProps} />;
        case "second":
          return <SecondCollageMobile {...mobileProps} />;
        case "third":
          return <ThirdCollageMobile {...mobileProps} />;
        default:
          return <GenericCollageMobile {...mobileProps} />;
      }
    }

    // Desktop Layout
    const desktopProps = {
      images,
      alt,
    };

    const collageType = getCollageType(images);
    const isSecondCollage = collageType === "second" && images.length === 3;

    return (
      <div className="relative flex items-start justify-end min-h-[600px]">
        <DecorativeCircleWrapper
          isMobile={false}
          isInView={isInView}
          isReversed={isReversed}
        />

        <div className={`relative z-10 flex gap-4 ${isSecondCollage ? '-translate-x-15' : ''}`}>
          {collageType === "first" && images.length === 4 ? (
            <FirstCollageDesktop {...desktopProps} isInView={isInView} baseDelay={transitionDelay} />
          ) : collageType === "second" && images.length === 3 ? (
            <SecondCollageDesktop {...desktopProps} isInView={isInView} baseDelay={transitionDelay} />
          ) : collageType === "third" && images.length === 4 ? (
            <ThirdCollageDesktop {...desktopProps} isInView={isInView} baseDelay={transitionDelay} />
          ) : null}
        </div>
      </div>
    );
  }
);

ProjectImageCollage.displayName = "ProjectImageCollage";

export { ProjectImageCollage };
