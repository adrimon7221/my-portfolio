import { useState, useEffect } from 'react';
import { ANIMATION_DELAYS } from '@/app/_constants/animations';

interface UseMountAnimationOptions {
  delay?: number;
}

/**
 * Custom hook for handling mount animations
 */
export const useMountAnimation = (options: UseMountAnimationOptions = {}) => {
  const { delay = ANIMATION_DELAYS.MOUNT_DELAY } = options;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return mounted;
};

