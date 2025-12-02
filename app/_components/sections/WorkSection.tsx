'use client';
import React from 'react';
import { useInView } from "@/app/_hooks/useInView";
import { WORK_EXPERIENCE } from '@/app/_data/workExperience';
import { WorkHeader, WorkItem, WorkExperienceSummary } from '@/app/_components/ui/work-section';

/**
 * WorkSection Component
 * 
 * Displays work experience information with animations and hover effects.
 * Follows the same architectural patterns as HeroSection and AboutSection.
 */
const WorkSection: React.FC = () => {
  const { ref, isInView } = useInView({ threshold: 0.2, triggerOnce: true });

  // Validation
  if (!WORK_EXPERIENCE || WORK_EXPERIENCE.length === 0) {
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
          {WORK_EXPERIENCE.map((work, index) => (
            <WorkItem
              key={work.id}
              work={work}
              index={index}
              isLast={index === WORK_EXPERIENCE.length - 1}
              isInView={isInView}
            />
          ))}
        </div>

        <WorkExperienceSummary isInView={isInView} />
      </div>
    </section>
  );
};

export default WorkSection;
