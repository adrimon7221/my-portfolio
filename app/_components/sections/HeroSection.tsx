"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import DecorativeCircle from "../ui/DecorativeCircle";
import Navbar from "../ui/Navbar";
import SocialLinks from "../ui/SocialLinks";
import ArticleCarousel from "../ui/ArticleCarousel";

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen text-white overflow-hidden">
      <Navbar />

      {/* Círculo decorativo - responsive */}
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

      <div className="relative z-10 max-w-7xl mt-20 md:mt-32 lg:mt-40 mx-auto px-8 pt-8 md:pt-12 lg:pt-16 pb-4 flex items-start min-h-[calc(100vh-4rem)]">
        <div className="w-full">
          {/* Desktop layout */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between mb-8">
              <h1
                aria-label="Full-stack"
                className={`text-1xl lg:text-[8rem] font-bold leading-none transition-all duration-700 ease-out transform ${
                  mounted
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-20"
                }`}
                style={{ transitionDelay: mounted ? "120ms" : "0ms" }}
              >
                Full-stack
              </h1>

              <div className="flex items-center gap-4 self-center">
                <Link
                  href="/projects"
                  aria-label="Ver proyectos"
                  className={`project-btn inline-flex items-center justify-center px-20 py-4 rounded-full font-medium text-lg transform transition-transform duration-300 ${
                    mounted
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-6 scale-95"
                  } hover:-translate-y-1 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/20`}
                  style={{
                    backgroundColor: "#FFF",
                    color: "#000",
                    transitionDelay: mounted ? "220ms" : "0ms",
                  }}
                >
                  <span className="italic">Projects</span>
                </Link>

                <Link
                  href="/projects"
                  aria-label="Ir a Projects"
                  className={`arrow-btn w-12 h-12 flex items-center justify-center rounded-full text-xl bg-white text-black transform transition-transform duration-300 shadow-md ${
                    mounted
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6 scale-95"
                  } hover:-translate-y-1 hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/20`}
                  style={{ transitionDelay: mounted ? "300ms" : "0ms" }}
                >
                  <span className="sr-only">Ir a Projects</span>
                  <span className="pointer-events-none arrow">→</span>
                </Link>
              </div>
            </div>

            <div className="flex items-start justify-between">
              <div className="max-w-xs">
                <p
                  className={`text-m text-gray-400 leading-relaxed transition-all duration-700 transform ${
                    mounted
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: mounted ? "260ms" : "0ms" }}
                >
                  My goal is to{" "}
                  <span className="italic">write maintainable, clean</span>
                  <br />
                  and <span className="italic">understandable code</span> to
                  process
                  <br />
                  development was enjoyable.
                </p>
              </div>

              <h2
                className={`text-8xl lg:text-[8rem] font-bold leading-none transition-all duration-900 transform ${
                  mounted
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-20"
                }`}
                style={{ transitionDelay: mounted ? "320ms" : "0ms" }}
              >
                Developer
              </h2>
            </div>
          </div>

          {/* Mobile layout - apilado verticalmente */}
          <div className="lg:hidden flex flex-col">
            <h1
              aria-label="Full-stack"
              className={`text-4xl md:text-6xl font-bold leading-none mb-4 transition-all duration-700 ease-out transform ${
                mounted
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-20"
              }`}
              style={{ transitionDelay: mounted ? "120ms" : "0ms" }}
            >
              Full-stack
            </h1>

            <h2
              className={`text-4xl md:text-6xl font-bold leading-none mb-6 transition-all duration-900 transform ${
                mounted
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-20"
              }`}
              style={{ transitionDelay: mounted ? "200ms" : "0ms" }}
            >
              Developer
            </h2>

            <p
              className={`text-sm md:text-base text-gray-400 leading-relaxed mb-6 transition-all duration-700 transform ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: mounted ? "280ms" : "0ms" }}
            >
              My goal is to{" "}
              <span className="italic">write maintainable, clean</span>
              <br />
              and <span className="italic">understandable code</span> to
              process
              <br />
              development was enjoyable.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="/projects"
                aria-label="Ver proyectos"
                className={`project-btn inline-flex items-center justify-center px-6 md:px-10 py-3 md:py-4 rounded-full font-medium text-base md:text-lg transform transition-transform duration-300 ${
                  mounted
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-6 scale-95"
                } hover:-translate-y-1 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/20`}
                style={{
                  backgroundColor: "#FFF",
                  color: "#000",
                  transitionDelay: mounted ? "360ms" : "0ms",
                }}
              >
                <span className="italic">Projects</span>
              </Link>

              <Link
                href="/projects"
                aria-label="Ir a Projects"
                className={`arrow-btn w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full text-lg md:text-xl bg-white text-black transform transition-transform duration-300 shadow-md ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6 scale-95"
                } hover:-translate-y-1 hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/20`}
                style={{ transitionDelay: mounted ? "400ms" : "0ms" }}
              >
                <span className="sr-only">Ir a Projects</span>
                <span className="pointer-events-none arrow">→</span>
              </Link>
            </div>
          </div>

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
            style={{ transitionDelay: mounted ? "400ms" : "0ms" }}
          >
            <ArticleCarousel
              articles={[
                {
                  id: 1,
                  title: "The simplest example is kafka + golang",
                  description:
                    "This article presents a simple way to implement a micro-service architecture using Kafka, Golang and Docker.",
                  url: "#",
                  gradientColors: ["#3b82f6", "#8b5cf6", "#ec4899"],
                },
                {
                  id: 2,
                  title: "Building Scalable Applications with Next.js 14",
                  description:
                    "Learn how to leverage the latest features in Next.js 14 to build high-performance, scalable web applications.",
                  url: "#",
                  gradientColors: ["#10b981", "#3b82f6", "#8b5cf6"],
                },
                {
                  id: 3,
                  title: "TypeScript Best Practices for React Developers",
                  description:
                    "A comprehensive guide to writing type-safe React applications with patterns and utilities.",
                  url: "#",
                  gradientColors: ["#f59e0b", "#ef4444", "#ec4899"],
                },
              ]}
              autoPlay={true}
              autoPlayInterval={5000}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        /* arrow movement only on hover/focus of its button */
        .arrow {
          display: inline-block;
          transition: transform 0.18s ease, opacity 0.18s ease;
          will-change: transform;
        }

        /* arrow moves when arrow button is hovered / focused */
        .arrow-btn:hover .arrow,
        .arrow-btn:focus .arrow {
          transform: translateX(6px) rotate(3deg) scale(1.02);
        }

        /* project button hover/focus */
        .project-btn {
          transition: transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1),
            box-shadow 0.18s ease;
          will-change: transform;
        }
        .project-btn:hover,
        .project-btn:focus {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
          outline: none;
        }

        /* arrow button hover/focus (separate) */
        .arrow-btn {
          transition: transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1),
            box-shadow 0.18s ease;
          will-change: transform;
        }
        .arrow-btn:hover,
        .arrow-btn:focus {
          transform: translateY(-6px) scale(1.04);
          box-shadow: 0 10px 36px rgba(0, 0, 0, 0.35);
          outline: none;
        }

        /* remove idle/floting animations — no animation unless hovered */
      `}</style>
    </section>
  );
};

export default HeroSection;
