'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import SocialLinks from '../ui/SocialLinks';
import Navbar from '../ui/Navbar';
import { DecorativeCircle } from '../ui/hero-section/DecorativeCircle';

const ContactSection: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const circleWrapperRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted || !containerRef.current || !circleWrapperRef.current) return;

    const updatePosition = () => {
      if (!containerRef.current || !circleWrapperRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Mover 140px a la izquierda desde el centro
      const offsetX = -140;
      circleWrapperRef.current.style.left = `${centerX}px`;
      circleWrapperRef.current.style.top = `${centerY}px`;
      circleWrapperRef.current.style.transform = `translate(calc(-50% + ${offsetX}px), -50%)`;
    };

    const tryUpdate = () => {
      if (containerRef.current && circleWrapperRef.current) {
        updatePosition();
      } else {
        setTimeout(tryUpdate, 50);
      }
    };

    const timeoutId = setTimeout(tryUpdate, 0);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [mounted]);

  const circlePortal = mounted ? (
    createPortal(
      <div
        ref={circleWrapperRef}
        style={{
          position: 'fixed',
          width: '750px',
          height: '750px',
          zIndex: 999,
          pointerEvents: 'none',
          display: 'block',
          visibility: 'visible'
        }}
      >
        <DecorativeCircle 
          customSize={{ width: '750px', height: '750px' }}
          className="opacity-50"
        />
      </div>,
      document.body
    )
  ) : null;

  return (
    <>
      {circlePortal}
      <section id="contact" className="text-white px-4 overflow-hidden relative" style={{ zIndex: 100, position: 'relative', transform: 'translateZ(0)', paddingTop: '150px', paddingBottom: '50px' }}>
        <div className="max-w-7xl mx-auto rounded-3xl px-6 relative" style={{ zIndex: 10, position: 'relative' }}>
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 mb-0 relative">
            <div 
              ref={containerRef}
              className="text-center md:text-left rounded-2xl p-4 md:w-1/2 relative overflow-visible flex flex-col justify-end" 
              style={{ zIndex: 20 }} 
              id="nikita-container"
            >
              <div className="relative" style={{ zIndex: 1000, position: 'relative' }}>
                <div className="flex flex-col">
                  <h1 className="text-5xl sm:text-7xl md:text-8xl font-semibold text-white leading-tight">
                    Lupe
                  </h1>
                  <div className="flex flex-col md:flex-row md:items-center md:gap-6 ">
                    <p className="text-white text-base md:text-lg font-normal leading-snug">
                      Full-stack<br />developer
                    </p>
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-semibold text-white leading-tight md:ml-auto">
                      Montes
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6 md:w-1/2 flex flex-col justify-center">
              <h3 className="text-2xl font-semibold mb-6">.../Contacts ...</h3>
              <div className="mb-6 relative [&_nav]:!fixed [&_nav]:!static [&_nav]:!relative [&_nav]:!z-auto">
                <Navbar />
              </div>

            </div>
          </div>

          <div className="flex justify-center mt-6">
            <SocialLinks />
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactSection;
