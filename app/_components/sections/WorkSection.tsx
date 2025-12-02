"use client";
import React from 'react';
import { useInView } from "@/app/_hooks/useInView";
import { ANIMATION_CLASSES } from '@/app/_constants/styles';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';

interface WorkExperience {
  id: number;
  period: string;
  duration: string;
  company: string;
  position: string;
}

const WorkSection: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.2, triggerOnce: true });

  const workExperience: WorkExperience[] = [
    {
      id: 1,
      period: "2022 -",
      duration: "1 year 5 months",
      company: "ITHUB",
      position: "Frontend developer | React & Vue",
    },
    {
      id: 2,
      period: "2021 - 2022",
      duration: "8 months",
      company: "VK Development Lab",
      position: "Frontend developer | React",
    },
    {
      id: 3,
      period: "2020 - 2021",
      duration: "9 months",
      company: "SN Inc.",
      position: "Fullstack developer | JavaScript & Python",
    },
    {
      id: 4,
      period: "2018 - 2020",
      duration: "1 year 11 months",
      company: "Business Up",
      position: "Fullstack developer | JavaScript & Python",
    },
  ];

  const totalYears = 4;
  const totalMonths = 9;

  return (
    <section 
      ref={ref}
      className="relative text-white px-4 sm:px-6 lg:px-8 py-16 sm:py-20 pb-16 sm:pb-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="mb-5 sm:mb-16">
          <h2
            className={`text-5xl sm:text-7xl md:text-8xl font-semibold text-right ${ANIMATION_CLASSES.FADE_IN_FROM_RIGHT(isInView, false)}`}
            style={{ transitionDelay: isInView ? `${ANIMATION_DELAYS.TITLE_DELAY}ms` : '0ms' }}
          >
            Work
          </h2>
        </div>

        {/* Work Items */}
        <div className="space-y-0">
          {workExperience.map((work, index) => {
            const itemDelay = ANIMATION_DELAYS.TITLE_DELAY + 80 + (index * 80);
            const animationClass = ANIMATION_CLASSES.FADE_IN_FROM_LEFT(isInView, false);
            
            return (
              <div
                key={work.id}
                className={`group grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 items-center py-6 sm:py-8 px-4 sm:px-8 lg:px-12 border-t border-white/20 hover:bg-white hover:text-black hover:border-white/0 cursor-pointer ${
                  index === workExperience.length - 1 ? 'border-b' : ''
                } ${animationClass}`}
                style={{ 
                  transitionDelay: isInView ? `${itemDelay}ms` : '0ms',
                  transition: isInView 
                    ? `opacity 800ms cubic-bezier(0.4, 0, 0.2, 1) ${itemDelay}ms, transform 800ms cubic-bezier(0.4, 0, 0.2, 1) ${itemDelay}ms, background-color 300ms ease, color 300ms ease, border-color 300ms ease`
                    : 'opacity 0ms, transform 0ms, background-color 300ms ease, color 300ms ease, border-color 300ms ease',
                }}
              >
              {/* Period and Duration */}
              <div className="text-sm flex flex-col">
                <div className="font-semibold">{work.period}</div>
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors duration-300">
                  {work.duration}
                </div>
              </div>

              {/* Company and Position */}
              <div className="text-sm sm:text-base flex flex-col">
                <div className="text-base sm:text-lg font-medium">
                  {work.company}
                </div>
                <div className="text-gray-300 group-hover:text-gray-700 transition-colors duration-300">
                  {work.position}
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Total Experience */}
        <div
          className={`mt-5 sm:mt-16 text-right px-4 sm:px-8 lg:px-12 ${ANIMATION_CLASSES.FADE_IN_FROM_RIGHT(isInView, false)}`}
          style={{ transitionDelay: isInView ? `${ANIMATION_DELAYS.TITLE_DELAY + 400}ms` : '0ms' }}
        >
          <p className="text-white text-sm sm:text-base">
            Work experience
          </p>
          <p className="text-lg sm:text-xl font-light italic mt-1">
            {totalYears} years {totalMonths} months
          </p>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;