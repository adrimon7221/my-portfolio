import { useInView } from '@/app/_hooks/useInView';
import { PROJECTS_ANIMATION_DELAYS } from '@/app/_constants/projects';

/**
 * Hook for managing project item animations
 * Handles scroll-triggered animations and calculates animation delays
 */
interface UseProjectAnimationOptions {
  index: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseProjectAnimationReturn {
  ref: React.RefObject<HTMLDivElement>;
  isInView: boolean;
  textAnimationDelay: number;
  imageAnimationDelay: number;
}

export const useProjectAnimation = ({
  index,
  threshold = 0.1,
  rootMargin = '150px',
  triggerOnce = true,
}: UseProjectAnimationOptions): UseProjectAnimationReturn => {
  const { ref, isInView } = useInView({
    threshold,
    rootMargin,
    triggerOnce,
  });

  const textAnimationDelay = PROJECTS_ANIMATION_DELAYS.PROJECT_BASE + 
    (index * PROJECTS_ANIMATION_DELAYS.PROJECT_INCREMENT);
  const imageAnimationDelay = textAnimationDelay + PROJECTS_ANIMATION_DELAYS.IMAGE;

  return {
    ref,
    isInView,
    textAnimationDelay,
    imageAnimationDelay,
  };
};

