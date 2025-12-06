'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { useInView } from '@/app/_hooks/useInView';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';
import SocialLinks from '../ui/SocialLinks';
import Navbar from '../ui/Navbar';
import { DecorativeCircle } from '../ui/hero-section/DecorativeCircle';

const ContactSection: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const circleWrapperRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);
  const { ref: inViewRef, isInView } = useInView({ threshold: 0.2, triggerOnce: true });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted || !containerRef.current || !circleWrapperRef.current) return;

    const updatePosition = () => {
      if (!containerRef.current || !circleWrapperRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        // En móvil: posicionar para que solo se vea la mitad derecha del círculo
        const viewportWidth = window.innerWidth;
        const circleWidth = 750;
        // Posicionar el centro del círculo en el borde derecho de la pantalla
        // Esto hace que la mitad izquierda quede fuera y solo se vea la mitad derecha
        const xPosition = viewportWidth - (circleWidth / 2);
        
        circleWrapperRef.current.style.left = `${xPosition}px`;
        circleWrapperRef.current.style.right = '';
        circleWrapperRef.current.style.top = `${centerY}px`;
        circleWrapperRef.current.style.transform = 'translateY(-50%)';
      } else {
        // En desktop: mover 140px a la izquierda desde el centro
        const centerX = rect.left + rect.width / 2;
        const offsetX = -140;
        circleWrapperRef.current.style.left = `${centerX}px`;
        circleWrapperRef.current.style.right = '';
        circleWrapperRef.current.style.top = `${centerY}px`;
        circleWrapperRef.current.style.transform = `translate(calc(-50% + ${offsetX}px), -50%)`;
      }
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
          zIndex: 1,
          pointerEvents: 'none',
          display: 'block',
          visibility: 'visible',
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'scale(1)' : 'scale(0.95)',
          transition: 'opacity 700ms ease-out, transform 700ms ease-out',
          transitionDelay: `${ANIMATION_DELAYS.TITLE_DELAY}ms`,
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
      <section 
        id="contact" 
        ref={inViewRef as React.RefObject<HTMLElement>}
        className="text-white px-4 overflow-hidden relative pt-[100px] pb-[100px] md:pt-[150px] md:pb-[50px]" 
        style={{ zIndex: 10, position: 'relative', transform: 'translateZ(0)', isolation: 'isolate' }}
      >
        <div className="max-w-7xl mx-auto rounded-3xl px-6 relative" style={{ zIndex: 10, position: 'relative' }}>
          <div className="flex flex-col md:flex-row gap-0 md:gap-12 mb-0 relative py-2 md:py-0">
            <div 
              ref={containerRef}
              className="text-center md:text-left rounded-2xl p-4 md:w-1/2 relative overflow-visible flex flex-col justify-end order-2 md:order-1" 
              style={{ zIndex: 20 }} 
              id="nikita-container"
            >
              <div className="relative" style={{ zIndex: 1000, position: 'relative' }}>
                <div className="flex flex-col">
                  <h1 
                    className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold text-white leading-tight text-left transition-all duration-700 ease-out ${
                      isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${ANIMATION_DELAYS.TITLE_DELAY}ms` }}
                  >
                    Adribell
                  </h1>
                  <div className="flex flex-row items-center gap-4 md:gap-6 mt-4 md:mt-0">
                    <p 
                      className={`text-white text-sm sm:text-base md:text-lg font-normal leading-snug transition-all duration-700 ease-out ${
                        isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                      }`}
                      style={{ transitionDelay: `${ANIMATION_DELAYS.TITLE_DELAY + 150}ms` }}
                    >
                      Full-stack<br />developer
                    </p>
                    <h1 
                      className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold text-white leading-tight ml-auto md:ml-auto md:translate-x-4 transition-all duration-700 ease-out ${
                        isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                      }`}
                      style={{ transitionDelay: `${ANIMATION_DELAYS.TITLE_DELAY + 250}ms` }}
                    >
                      Montes
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-4 sm:p-6 md:w-1/2 flex flex-col justify-center order-1 md:order-2">
              <h3 
                className={`text-xl sm:text-2xl font-semibold mb-6 transition-all duration-700 ease-out ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${ANIMATION_DELAYS.TITLE_DELAY + 100}ms` }}
              >
                .../Contacts ...
              </h3>
              <div 
                className={`mb-6 relative hidden md:block [&_nav]:!fixed [&_nav]:!static [&_nav]:!relative [&_nav]:!z-auto transition-all duration-700 ease-out ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${ANIMATION_DELAYS.TITLE_DELAY + 200}ms` }}
              >                <Navbar />
              </div>

            </div>
          </div>

          <div 
            className={`flex justify-center mt-6 relative transition-all duration-700 ease-out ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ zIndex: 1000, position: 'relative', transitionDelay: `${ANIMATION_DELAYS.SOCIAL_LINKS_DELAY}ms` }}
          >
            <SocialLinks />
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactSection;
