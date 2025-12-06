'use client';
import React from 'react';
import SocialLinks from '../SocialLinks';
import { CONTACT_ANIMATION_DELAYS } from '@/app/_constants/contact';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';
import { CONTACT_SECTION_CONFIG } from '@/app/_constants/contact';

interface ContactSocialLinksProps {
  isInView: boolean;
}

/**
 * ContactSocialLinks Component
 * 
 * Wrapper for SocialLinks component with scroll-triggered animations.
 * 
 * @param isInView - Whether the component is in viewport
 */
export const ContactSocialLinks: React.FC<ContactSocialLinksProps> = React.memo(({ isInView }) => {
  const delay = isInView ? ANIMATION_DELAYS.TITLE_DELAY + CONTACT_ANIMATION_DELAYS.SOCIAL_LINKS : 0;

  return (
    <div
      className={`flex justify-center mt-6 relative transition-all duration-700 ease-out ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{
        zIndex: CONTACT_SECTION_CONFIG.Z_INDEX.OVERLAY,
        position: 'relative',
        transitionDelay: `${delay}ms`,
      }}
    >
      <SocialLinks />
    </div>
  );
});

ContactSocialLinks.displayName = 'ContactSocialLinks';

