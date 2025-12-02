/**
 * Constants for Work Section
 */

export const WORK_CONTENT = {
  SECTION_TITLE: 'Work',
  SUMMARY: {
    LABEL: 'Work experience',
  },
} as const;

export const WORK_ANIMATION_DELAYS = {
  TITLE: 0,
  ITEM_BASE: 80,
  ITEM_INCREMENT: 80,
  SUMMARY: 400,
} as const;

export const WORK_STYLES = {
  ITEM: {
    BASE: 'group grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 items-center py-6 sm:py-8 px-4 sm:px-8 lg:px-12 border-t border-white/20 hover:bg-white hover:text-black hover:border-white/0 cursor-pointer',
    MOBILE_GRID_CLASS: 'work-item-mobile-grid',
  },
  HOVER: {
    DURATION: '300ms',
  },
  ANIMATION: {
    DURATION: '800ms',
    EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  TYPOGRAPHY: {
    POSITION_FONT: "'Fira Code', monospace",
  },
} as const;

