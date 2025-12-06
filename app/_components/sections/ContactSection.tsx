/**
 * ContactSection Component
 * 
 * Main section displaying contact information, name, role, and social links.
 * Features responsive design, scroll-triggered animations, and decorative circle.
 * 
 * Architecture:
 * - Separated constants, hooks, and UI components for maintainability
 * - Custom hooks for decorative circle positioning
 * - Reusable UI components with animations
 * - Type-safe with TypeScript interfaces
 */

'use client';

import React from 'react';
import { useInView } from '@/app/_hooks/useInView';
import { useDecorativeCircle } from '@/app/_hooks/useDecorativeCircle';
import { CONTACT_SECTION_CONFIG } from '@/app/_constants/contact';
import {
  ContactHeader,
  ContactInfo,
  ContactNavbar,
  DecorativeCirclePortal,
  ContactSocialLinks,
} from '../ui/contact-section';

const ContactSection: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { ref: inViewRef, isInView } = useInView({
    threshold: CONTACT_SECTION_CONFIG.ANIMATION.THRESHOLD,
    triggerOnce: true,
  });

  const { circleWrapperRef, mounted } = useDecorativeCircle({
    containerRef,
    isInView,
  });

  return (
    <>
      <DecorativeCirclePortal
        circleWrapperRef={circleWrapperRef}
        isInView={isInView}
        mounted={mounted}
      />

      <section
        id="contact"
        ref={inViewRef as React.RefObject<HTMLElement>}
        className="text-white px-4 overflow-hidden relative pt-[100px] pb-[100px] md:pt-[150px] md:pb-[50px]"
        style={{
          zIndex: CONTACT_SECTION_CONFIG.Z_INDEX.SECTION,
          position: 'relative',
          transform: 'translateZ(0)',
          isolation: 'isolate',
        }}
      >
        <div
          className="max-w-7xl mx-auto rounded-3xl px-6 relative"
          style={{
            zIndex: CONTACT_SECTION_CONFIG.Z_INDEX.CONTAINER,
            position: 'relative',
          }}
        >
          <div className="flex flex-col md:flex-row gap-0 md:gap-12 mb-0 relative py-2 md:py-0">
            {/* Contact Info Section */}
            <div
              ref={containerRef}
              className="text-center md:text-left rounded-2xl p-4 md:w-1/2 relative overflow-visible flex flex-col justify-end order-2 md:order-1"
              style={{
                zIndex: CONTACT_SECTION_CONFIG.Z_INDEX.CONTENT,
              }}
              id="nikita-container"
            >
              <ContactInfo isInView={isInView} />
            </div>

            {/* Contacts Header and Navbar Section */}
            <div className="rounded-2xl p-4 sm:p-6 md:w-1/2 flex flex-col justify-center order-1 md:order-2">
              <ContactHeader isInView={isInView} />
              <ContactNavbar isInView={isInView} />
            </div>
          </div>

          {/* Social Links */}
          <ContactSocialLinks isInView={isInView} />
        </div>
      </section>
    </>
  );
};

export default ContactSection;
