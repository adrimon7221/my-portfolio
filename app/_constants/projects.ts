/**
 * Projects Section Constants
 * 
 * Configuration constants for the ProjectsSection component.
 */

/**
 * Animation delays for projects section components (in milliseconds).
 */
export const PROJECTS_ANIMATION_DELAYS = {
  TITLE: 0,
  PROJECT_BASE: 100,
  PROJECT_INCREMENT: 100,
  IMAGE: 200,
} as const;

/**
 * Desktop layout configuration.
 */
export const DESKTOP_CONFIG = {
  CIRCLE: {
    SIZE: { width: '750px', height: '750px' },
    POSITION: {
      NORMAL: { top: '45%', left: '50%', translateX: '-40%' },
      REVERSED: { top: '45%', right: '0', translateX: '-20%' },
    },
  },
  IMAGE: {
    WIDTH: '830px',
    HEIGHT: '555px',
  },
  GRID: {
    NORMAL: 'lg:grid-cols-[0.8fr_2.2fr]',
    REVERSED: 'lg:grid-cols-[2.2fr_0.8fr]',
    GAP: 'lg:gap-20',
  },
  SPACING: {
    BETWEEN_PROJECTS: 'space-y-32',
    PROJECT_PADDING: 'pb-32 lg:pb-40',
  },
} as const;

/**
 * Mobile layout configuration.
 */
export const MOBILE_CONFIG = {
  CIRCLE: {
    SIZE: { width: '500px', height: '500px' },
    POSITION: {
      FIRST_LAST: { side: 'right', translate: '1/2' },
      MIDDLE: { side: 'left', translate: '-1/2' },
    },
  },
  SPACING: {
    BETWEEN_PROJECTS: 'space-y-28',
    IMAGE_MARGIN: 'mb-6',
    TEXT_MARGIN: 'mb-4',
    ICONS_MARGIN: 'mt-6',
  },
} as const;

/**
 * Project that should have reversed layout (image on left, text on right).
 * Currently set to index 1 (CloudSync).
 */
export const REVERSED_PROJECT_INDEX = 1;

