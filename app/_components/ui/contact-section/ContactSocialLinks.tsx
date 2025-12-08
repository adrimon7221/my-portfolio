'use client';
import React from 'react';
import { SocialLinksClient } from '../SocialLinks';
import { CONTACT_ANIMATION_DELAYS } from '@/app/_constants/contact';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';
import { CONTACT_SECTION_CONFIG } from '@/app/_constants/contact';
import type { SocialLinkItem } from '@/app/_types/social';

interface ContactSocialLinksProps {
  socialLinks: SocialLinkItem[];
  isInView: boolean;
}

/**
 * ContactSocialLinks Component (Client Component)
 * 
 * Wrapper for SocialLinks component with scroll-triggered animations.
 * 
 * @param socialLinks - Array de enlaces sociales desde la base de datos
 * @param isInView - Whether the component is in viewport
 */
export const ContactSocialLinks: React.FC<ContactSocialLinksProps> = React.memo(({ socialLinks, isInView }) => {
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
      <SocialLinksClient socialLinks={socialLinks} />
    </div>
  );
});

ContactSocialLinks.displayName = 'ContactSocialLinks';

