"use client";
import React from "react";
import { ArrowButton } from "../ui/hero-section";
import { SOCIAL_LINKS } from "@/app/_data/socialLinks";

const FRONTEND_TECHNOLOGIES = [
  "TypeScript",
  "React",
  "Vue",
  "Vuex",
  "Redux Toolkit",
  "NextJs",
  "Nuxt",
  "Jest",
  "GraphQL",
  "React Native",
  "Puppeteer",
  "Enzyme",
];

const STYLES_TECHNOLOGIES = [
  "SCSS",
  "SASS",
  "PostCSS",
  "Ant.d",
  "MUI",
  "Material UI",
];

const BACKEND_TECHNOLOGIES = [
  "Golang",
  "Gin",
  "GORM",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "gRPC",
  "Redis",
  "Kafka",
  "Node",
  "Nest",
  "TypeORM",
  "Microservices",
];

const DEVOPS_TECHNOLOGIES = [
  "Nginx",
  "Brotli",
  "Docker",
  "(CI/CD)",
  "k8s",
  "Bash",
];

const AboutSection: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen text-white py-12 mt-10 sm:py-16 md:py-20 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title and Intro in same row */}
        <div className="mb-12 sm:mb-14 md:mb-16 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
          <h2 className="text-xs sm:text-sm text-white">... /About me ...</h2>
          <div className="lg:flex-1 lg:ml-12 lg:text-center">
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              Hello! I'm{" "}
              <span className="text-white font-semibold italic">Nikita</span>, I'm a{" "}
              <span className="italic text-white">full-stack developer</span>.
            </p>
            <p className="text-base sm:text-lg text-gray-300 mt-2">
              More than{" "}
              <span className="text-white font-semibold italic">5 years</span>{" "}
              experience.
            </p>
          </div>
        </div>

        {/* Photo in responsive - below intro text */}
        <div className="mb-8 lg:hidden flex justify-center">
          <div className="relative w-full max-w-[280px] sm:max-w-[320px]">
            {/* Decorative Circle */}
            <div
              aria-hidden
              className={`absolute top-[35%] left-full -translate-x-1/3 -translate-y-1/2 pointer-events-none transition-opacity duration-700 ease-out -z-10 overflow-hidden ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                style={{ width: "470px", height: "470px" }}
                className="rounded-full border-2 border-white/20"
              />
            </div>

            <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
              <img
                src="/images/profile.jpg"
                alt="Nikita - Full-stack Developer"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-20 items-start">
          {/* Left Column - Tech Stack */}
          <div className="space-y-6 sm:space-y-8">
            {/* Front-end Box */}
            <div className="rounded-2xl sm:rounded-3xl border border-white transition-all duration-300 hover:bg-white hover:border-white hover:text-black cursor-pointer mt-8 sm:mt-0">
              <p className="text-base sm:text-lg font-normal mb-3 sm:mb-4 px-5 sm:px-6 pt-5 sm:pt-6">
                Front-end
              </p>
              <h4 className="text-xs sm:text-sm leading-relaxed px-5 sm:px-6 pb-5 sm:pb-6">
                {FRONTEND_TECHNOLOGIES.join(" / ")}
              </h4>
            </div>

            {/* Styles Box with external buttons */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="rounded-2xl sm:rounded-3xl border border-white transition-all duration-300 hover:bg-white hover:border-white hover:text-black cursor-pointer">
                <p className="text-base sm:text-lg font-normal mb-3 sm:mb-4 px-5 sm:px-6 pt-5 sm:pt-6">
                  Styles
                </p>
                <h4 className="text-xs sm:text-sm leading-relaxed px-5 sm:px-6 pb-5 sm:pb-6">
                  {STYLES_TECHNOLOGIES.join(" / ")}
                </h4>
              </div>
              <div className="flex items-center justify-center relative">
                {(() => {
                  const githubLink = SOCIAL_LINKS.find(
                    (link) => link.label === "GitHub"
                  );
                  return githubLink ? (
                    <a
                      href={githubLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={githubLink.label}
                      className="group flex items-center justify-center w-16 h-16 rounded-full bg-black/30 hover:bg-black/0 transition-all duration-300 hover:rotate-12 flex-shrink-0 [&_svg]:w-10 [&_svg]:h-10 relative z-10"
                    >
                      {githubLink.svg}
                    </a>
                  ) : null;
                })()}
                <div className="absolute left-1/2 top-1/2 translate-x-1/4 -translate-y-1/2 z-20">
                  <ArrowButton
                    href="/projects"
                    mounted={mounted}
                    size="lg"
                    className="!w-14 !h-14"
                  />
                </div>
              </div>
            </div>

            {/* Back-end Box */}
            <div className="rounded-2xl sm:rounded-3xl border border-white transition-all duration-300 hover:bg-white hover:border-white hover:text-black cursor-pointer">
              <p className="text-base sm:text-lg font-normal mb-3 sm:mb-4 px-5 sm:px-6 pt-5 sm:pt-6">
                Back-end
              </p>
              <h4 className="text-xs sm:text-sm leading-relaxed px-5 sm:px-6 pb-5 sm:pb-6">
                {BACKEND_TECHNOLOGIES.join(" / ")}
              </h4>
            </div>

            {/* DevOps Box */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="flex items-center justify-center relative">
                <p>
                  Some of my <span className="font-bold italic">favorite technologies</span>, <span className="font-bold italic">topics</span>, or <span className="font-bold italic">tools</span> that i
                  worked with
                </p>
              </div>
              <div className="rounded-2xl sm:rounded-3xl border border-white transition-all duration-300 hover:bg-white hover:border-white hover:text-black cursor-pointer">
                <p className="text-base sm:text-lg font-normal mb-3 sm:mb-4 px-5 sm:px-6 pt-5 sm:pt-6">
                  DevOps
                </p>
                <h4 className="text-xs sm:text-sm leading-relaxed px-5 sm:px-6 pb-5 sm:pb-6">
                  {DEVOPS_TECHNOLOGIES.join(" / ")}
                </h4>
              </div>
            </div>
          </div>

          {/* Right Column - Photo (Desktop only) */}
          <div className="hidden lg:flex mt-8 lg:mt-20 justify-center lg:justify-end">
            <div className="relative w-full max-w-[350px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px]">
              {/* Decorative Circle - Always behind the image */}
              <div
                aria-hidden
                className={`absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-700 ease-out -z-10 ${
                  mounted ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Móvil: círculo pequeño */}
                <div className="md:hidden">
                  <div
                    style={{ width: "350px", height: "350px" }}
                    className="rounded-full border-2 border-white/20"
                  />
                </div>
                {/* Tablet: círculo mediano */}
                <div className="hidden md:block lg:hidden">
                  <div
                    style={{ width: "520px", height: "520px" }}
                    className="rounded-full border-2 border-white/20"
                  />
                </div>
                {/* Desktop: círculo grande */}
                <div className="hidden lg:block">
                  <div
                    style={{ width: "650px", height: "650px" }}
                    className="rounded-full border-2 border-white/20"
                  />
                </div>
              </div>

              <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
                <img
                  src="/images/profile.jpg"
                  alt="Nikita - Full-stack Developer"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
