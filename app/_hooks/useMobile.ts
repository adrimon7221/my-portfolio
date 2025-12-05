/**
 * useMobile Hook
 * 
 * Custom hook to detect if the current viewport is mobile size.
 * Uses a configurable breakpoint to determine mobile vs desktop.
 */

import { useState, useEffect } from 'react';

interface UseMobileOptions {
  breakpoint?: number;
}

/**
 * Hook to detect mobile viewport size
 * 
 * @param options - Configuration options
 * @param options.breakpoint - Pixel width breakpoint (default: 768)
 * @returns boolean indicating if viewport is mobile size
 */
export const useMobile = ({ breakpoint = 768 }: UseMobileOptions = {}): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check on mount
    checkMobile();

    // Listen for resize events
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
};

