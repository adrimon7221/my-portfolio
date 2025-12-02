"use client";
import React from "react";
import Navbar from "../ui/Navbar";
import SocialLinks from "../ui/SocialLinks";
import { DesktopLayout, MobileLayout, ArticleCarousel, DecorativeCircleWrapper } from "../ui/hero-section";
import { useMountAnimation } from "@/app/_hooks/useMountAnimation";
import { ANIMATION_DELAYS } from "@/app/_constants/animations";
import { HERO_ARTICLES } from "@/app/_data/heroArticles";
import "@/app/_styles/hero-animations.css";

const HeroSection = () => {
  const mounted = useMountAnimation();

  return (
    <section className="relative min-h-screen text-white overflow-hidden">
      <Navbar />

      {/* Círculo decorativo - responsive */}
      <DecorativeCircleWrapper mounted={mounted} />

      <div className="relative z-10 max-w-7xl mt-20 md:mt-32 lg:mt-40 mx-auto px-8 pt-8 md:pt-12 lg:pt-16 pb-4 flex items-start min-h-[calc(100vh-4rem)]">
        <div className="w-full">
          <DesktopLayout mounted={mounted} />
          <MobileLayout mounted={mounted} />

          <div
            className={`mt-8 md:mt-12 lg:mt-20 flex justify-center pointer-events-auto transition-opacity duration-700 ease-out ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            <SocialLinks />
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
