"use client";
import React from "react";
import Navbar from "../ui/Navbar";
import { SocialLinksClient } from "../ui/SocialLinks";
import { DesktopLayout, MobileLayout, ArticleCarousel, DecorativeCircleWrapper } from "../ui/hero-section";
import { useMountAnimation } from "@/app/_hooks/useMountAnimation";
import { ANIMATION_DELAYS } from "@/app/_constants/animations";
import { HERO_ARTICLES } from "@/app/_data/heroArticles";
import type { SocialLinkItem } from "@/app/_types/social";
import "@/app/_styles/hero-animations.css";

/**
 * HeroSection Component (Client Component)
 * 
 * Main hero section displaying title, goal text, buttons, and article carousel.
 * Uses mount-triggered animations for all child components.
 * 
 * Recibe los enlaces sociales como props desde el Server Component padre.
 */
interface HeroSectionProps {
  socialLinks: SocialLinkItem[];
}

const HeroSection = ({ socialLinks }: HeroSectionProps) => {
  const mounted = useMountAnimation();

  return (
    <section className="relative text-white overflow-hidden">
      <Navbar />

      {/* Círculo decorativo - responsive */}
      <DecorativeCircleWrapper mounted={mounted} />

      <div className="relative z-10 max-w-7xl mt-20 md:mt-32 lg:mt-40 mx-auto px-8 pt-8 md:pt-12 lg:pt-16 pb-12 md:pb-16 lg:pb-20 flex items-start">
        <div className="w-full">
          <DesktopLayout mounted={mounted} />
          <MobileLayout mounted={mounted} />

          <div
            className={`mt-8 md:mt-12 lg:mt-20 flex justify-center pointer-events-auto transition-opacity duration-700 ease-out ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            <SocialLinksClient socialLinks={socialLinks} />
          </div>
          <div
            className={`relative z-10 transition-opacity duration-700 ease-out mt-20 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: mounted ? `${ANIMATION_DELAYS.CAROUSEL_DELAY}ms` : "0ms" }}
          >
            <ArticleCarousel articles={HERO_ARTICLES} />
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
