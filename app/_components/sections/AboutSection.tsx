"use client";
import React from "react";
import { useInView } from "@/app/_hooks/useInView";
import { ANIMATION_DELAYS } from "@/app/_constants/animations";
import {
  TechBox,
  AboutHeader,
  AboutPhoto,
  SocialLinksContainer,
  DevOpsDescription,
} from "../ui/about-section";
import {
  FRONTEND_TECHNOLOGIES,
  STYLES_TECHNOLOGIES,
  BACKEND_TECHNOLOGIES,
  DEVOPS_TECHNOLOGIES,
} from "@/app/_data/aboutTechnologies";

const AboutSection: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section 
      ref={ref}
      className="relative min-h-screen text-white py-12 mt-10 sm:py-16 md:py-20 px-4 sm:px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <AboutHeader isInView={isInView} />

        <AboutPhoto isInView={isInView} isResponsive={true} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-20 items-start">
          {/* Left Column - Tech Stack */}
          <div className="space-y-6 sm:space-y-8">
            <TechBox
              title="Front-end"
              technologies={FRONTEND_TECHNOLOGIES}
              isInView={isInView}
              transitionDelay={ANIMATION_DELAYS.TITLE_DELAY + 320}
              className="mt-8 sm:mt-0"
            />

            {/* Styles Box with external buttons */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <TechBox
                title="Styles"
                technologies={STYLES_TECHNOLOGIES}
                isInView={isInView}
                transitionDelay={ANIMATION_DELAYS.TITLE_DELAY + 400}
              />
              <SocialLinksContainer 
                isInView={isInView}
                transitionDelay={ANIMATION_DELAYS.TITLE_DELAY + 480}
              />
            </div>

            <TechBox
              title="Back-end"
              technologies={BACKEND_TECHNOLOGIES}
              isInView={isInView}
              transitionDelay={ANIMATION_DELAYS.TITLE_DELAY + 560}
            />

            {/* DevOps Box */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <DevOpsDescription isInView={isInView} />
              <TechBox
                title="DevOps"
                technologies={DEVOPS_TECHNOLOGIES}
                isInView={isInView}
                transitionDelay={ANIMATION_DELAYS.TITLE_DELAY + 720}
              />
            </div>
          </div>

          {/* Right Column - Photo (Desktop only) */}
          <AboutPhoto isInView={isInView} isResponsive={false} />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
