'use client';
import React from 'react';
import { CONTACT_CONTENT, CONTACT_ANIMATION_DELAYS } from '@/app/_constants/contact';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';
import { TRANSITION_DURATIONS, TRANSITION_TIMINGS } from '@/app/_constants/animations';

interface ContactInfoProps {
  isInView: boolean;
}

/**
 * ContactInfo Component
 * 
 * Displays name and role information with staggered animations.
 * 
 * @param isInView - Whether the component is in viewport
 */
export const ContactInfo: React.FC<ContactInfoProps> = React.memo(({ isInView }) => {
  const titleDelay = isInView ? ANIMATION_DELAYS.TITLE_DELAY + CONTACT_ANIMATION_DELAYS.TITLE : 0;
  const fullstackDelay = isInView ? ANIMATION_DELAYS.TITLE_DELAY + CONTACT_ANIMATION_DELAYS.FULLSTACK_TEXT : 0;
  const lastNameDelay = isInView ? ANIMATION_DELAYS.TITLE_DELAY + CONTACT_ANIMATION_DELAYS.LAST_NAME : 0;

  const baseTransitionClasses = `transition-all duration-700 ${TRANSITION_TIMINGS.EASE_OUT}`;

  return (
    <div className="relative" style={{ zIndex: 1000, position: 'relative' }}>
      <div className="flex flex-col">
        <h1
          className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold text-white leading-tight text-left ${baseTransitionClasses} ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: `${titleDelay}ms` }}
        >
          {CONTACT_CONTENT.NAME.FIRST}
        </h1>
        <div className="flex flex-row items-center gap-4 md:gap-6 mt-4 md:mt-0">
          <p
            className={`text-white text-sm sm:text-base md:text-lg font-normal leading-snug ${baseTransitionClasses} ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
            style={{ transitionDelay: `${fullstackDelay}ms` }}
          >
            {CONTACT_CONTENT.ROLE.TEXT}
            <br />
            {CONTACT_CONTENT.ROLE.SUBTEXT}
          </p>
          <h1
            className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold text-white leading-tight ml-auto md:ml-auto md:translate-x-4 ${baseTransitionClasses} ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
            style={{ transitionDelay: `${lastNameDelay}ms` }}
          >
            {CONTACT_CONTENT.NAME.LAST}
          </h1>
        </div>
      </div>
    </div>
  );
});

ContactInfo.displayName = 'ContactInfo';

