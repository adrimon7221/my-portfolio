'use client';
import React from 'react';
import Navbar from '../Navbar';
import { CONTACT_ANIMATION_DELAYS } from '@/app/_constants/contact';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';
import { TRANSITION_DURATIONS, TRANSITION_TIMINGS } from '@/app/_constants/animations';

interface ContactNavbarProps {
  isInView: boolean;
}

/**
 * ContactNavbar Component
 * 
 * Wrapper for Navbar component with scroll-triggered animations.
 * Only visible on desktop breakpoints.
 * 
 * @param isInView - Whether the component is in viewport
 */
export const ContactNavbar: React.FC<ContactNavbarProps> = React.memo(({ isInView }) => {
  const delay = isInView ? ANIMATION_DELAYS.TITLE_DELAY + CONTACT_ANIMATION_DELAYS.NAVBAR : 0;

  return (
    <div
      className={`mb-6 relative hidden md:block [&_nav]:!fixed [&_nav]:!static [&_nav]:!relative [&_nav]:!z-auto transition-all duration-700 ${TRANSITION_TIMINGS.EASE_OUT} ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Navbar />
    </div>
  );
});

ContactNavbar.displayName = 'ContactNavbar';

