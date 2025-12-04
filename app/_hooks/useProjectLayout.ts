import { REVERSED_PROJECT_INDEX, DESKTOP_CONFIG } from '@/app/_constants/projects';

/**
 * Hook for determining project layout configuration
 */
interface UseProjectLayoutOptions {
  index: number;
  totalProjects: number;
}

interface UseProjectLayoutReturn {
  isReversed: boolean;
  gridCols: string;
  isLastProject: boolean;
  circlePosition: 'left' | 'right';
}

export const useProjectLayout = ({
  index,
  totalProjects,
}: UseProjectLayoutOptions): UseProjectLayoutReturn => {
  const isReversed = index === REVERSED_PROJECT_INDEX;
  const gridCols = isReversed 
    ? DESKTOP_CONFIG.GRID.REVERSED 
    : DESKTOP_CONFIG.GRID.NORMAL;
  
  const isLastProject = index === totalProjects - 1;
  
  // Determine circle position: first and last projects have circle on right, middle on left
  const isFirstOrLast = index === 0 || index === totalProjects - 1;
  const circlePosition: 'left' | 'right' = isFirstOrLast ? 'right' : 'left';

  return {
    isReversed,
    gridCols,
    isLastProject,
    circlePosition,
  };
};

