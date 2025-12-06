'use client';
import React from 'react';
import { CONTACT_CONTENT, CONTACT_ANIMATION_DELAYS } from '@/app/_constants/contact';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';
import { TRANSITION_DURATIONS, TRANSITION_TIMINGS } from '@/app/_constants/animations';

interface ContactHeaderProps {
  isInView: boolean;
}

/**
 * ContactHeader Component
 * 
 * Displays the contact section header with scroll-triggered animations.
 * 
 * @param isInView - Whether the component is in viewport
 */
export const ContactHeader: React.FC<ContactHeaderProps> = React.memo(({ isInView }) => {
  const delay = isInView ? ANIMATION_DELAYS.TITLE_DELAY + CONTACT_ANIMATION_DELAYS.CONTACTS_HEADER : 0;

  return (
    <h3
      className={`text-xl sm:text-2xl font-semibold mb-6 transition-all duration-700 ${TRANSITION_TIMINGS.EASE_OUT} ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {CONTACT_CONTENT.SECTION_TITLE}
    </h3>
  );
});

ContactHeader.displayName = 'ContactHeader';

