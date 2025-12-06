import { useEffect, useRef, useState } from 'react';
import { CONTACT_CIRCLE_CONFIG, CONTACT_RESPONSIVE_BREAKPOINT } from '@/app/_constants/contact';

/**
 * Hook for managing decorative circle positioning in ContactSection
 * 
 * Handles responsive positioning and updates based on scroll/resize events
 */
interface UseDecorativeCircleOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isInView: boolean;
}

interface UseDecorativeCircleReturn {
  circleWrapperRef: React.RefObject<HTMLDivElement | null>;
  mounted: boolean;
}

export const useDecorativeCircle = ({
  containerRef,
  isInView,
}: UseDecorativeCircleOptions): UseDecorativeCircleReturn => {
  const circleWrapperRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current || !circleWrapperRef.current) return;

    const updatePosition = () => {
      if (!containerRef.current || !circleWrapperRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const isMobile = window.innerWidth < CONTACT_RESPONSIVE_BREAKPOINT;

      if (isMobile) {
        // Mobile: position to show only right half of circle
        const viewportWidth = window.innerWidth;
        const circleWidth = parseInt(CONTACT_CIRCLE_CONFIG.SIZE.width);
        const xPosition = viewportWidth - circleWidth / 2;

        circleWrapperRef.current.style.left = `${xPosition}px`;
        circleWrapperRef.current.style.right = '';
        circleWrapperRef.current.style.top = `${centerY}px`;
        circleWrapperRef.current.style.transform = 'translateY(-50%)';
      } else {
        // Desktop: offset from center
        const centerX = rect.left + rect.width / 2;
        const offsetX = CONTACT_CIRCLE_CONFIG.DESKTOP.OFFSET_X;

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
  }, [mounted, containerRef]);

  return {
    circleWrapperRef,
    mounted,
  };
};

