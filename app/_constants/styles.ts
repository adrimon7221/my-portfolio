/**
 * Shared style constants and utilities
 */

export const BUTTON_STYLES = {
  PROJECT: {
    backgroundColor: '#FFF',
    color: '#000',
  },
} as const;

export const ANIMATION_CLASSES = {
  FADE_IN_FROM_RIGHT: (mounted: boolean, fast = false) =>
    `transition-all ${fast ? 'duration-1000' : 'duration-[1500ms]'} ease-in-out transform ${
      mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
    }`,
  FADE_IN_FROM_LEFT: (mounted: boolean, fast = false) =>
    `transition-all ${fast ? 'duration-1000' : 'duration-[1500ms]'} ease-in-out transform ${
      mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
    }`,
  FADE_IN_FROM_BOTTOM: (mounted: boolean, fast = false) =>
    `transition-all ${fast ? 'duration-1000' : 'duration-[1500ms]'} ease-in-out transform ${
      mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`,
} as const;

/**
 * Border radius constants used throughout the project
 */
export const BORDER_RADIUS = {
  SMALL: 'rounded-[16px]',        // 16px - Used in project collages
  MEDIUM: 'rounded-xl',            // 12px - Default medium radius
  LARGE: 'rounded-[21px]',         // 21px - Used in project images
  EXTRA_LARGE: 'rounded-2xl',      // 16px - Used in cards
  HUGE: 'rounded-3xl',             // 24px - Used in containers
  PROPORTIONAL: '10.5%',           // Proportional for responsive images
  // Tailwind defaults
  DEFAULT: 'rounded-lg',           // 8px
  FULL: 'rounded-full',            // 9999px
} as const;

/**
 * Spacing constants for consistent gaps and margins
 */
export const SPACING = {
  COLLAGE_GAP: 'gap-4',            // 16px gap in collages
  SECTION_PADDING: 'px-6',         // Horizontal padding
  MOBILE_MARGIN: 'mb-6',           // Mobile margin bottom
  CONTAINER_ROUNDED: 'rounded-3xl', // Container border radius
} as const;

