'use client';
import React from 'react';
import { useInView } from "@/app/_hooks/useInView";
import { WorkHeader, WorkItem, WorkExperienceSummary } from '@/app/_components/ui/work-section';
import type { WorkExperienceData } from '@/app/_lib/work-experience';

interface WorkSectionProps {
  workExperiences: WorkExperienceData[];
  totalYears: number;
  totalMonths: number;
}

/**
 * WorkSection Component
 * 
 * Displays work experience information with animations and hover effects.
 * Follows the same architectural patterns as HeroSection and AboutSection.
 */
const WorkSection: React.FC<WorkSectionProps> = ({ workExperiences, totalYears, totalMonths }) => {
  const { ref, isInView } = useInView({ threshold: 0.2, triggerOnce: true });

  // Validation
  if (!workExperiences || workExperiences.length === 0) {
    console.warn('WorkSection: No work experience data available');
  }

  return (
    <section 
      ref={ref}
      className="relative text-white px-4 sm:px-6 lg:px-8 py-16 sm:py-20 pb-16 sm:pb-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <WorkHeader isInView={isInView} />

        {/* Work Items */}
        <div className="space-y-0">
          {workExperiences.map((work, index) => (
            <WorkItem
              key={work.id}
              work={work}
              index={index}
              isLast={index === workExperiences.length - 1}
              isInView={isInView}
            />
          ))}
        </div>

        <WorkExperienceSummary 
          isInView={isInView} 
          totalYears={totalYears}
          totalMonths={totalMonths}
        />
      </div>
    </section>
  );
};

export default WorkSection;
