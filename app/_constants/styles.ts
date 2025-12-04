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

/**
 * Project-specific style constants
 */
export const PROJECT_STYLES = {
  TAG: {
    BASE: 'bg-white/10 rounded-full border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 cursor-default',
    MOBILE: 'px-2.5 py-0.5 lg:px-3 lg:py-1 text-[10px] lg:text-xs',
    DESKTOP: 'px-3 py-1 text-xs',
  },
  TITLE: {
    MOBILE: 'text-lg lg:text-xl font-semibold mb-2 not-italic',
    DESKTOP: 'text-xl font-semibold mb-8',
  },
  DESCRIPTION: {
    MOBILE: 'text-xs lg:text-sm text-gray-100 leading-relaxed break-all w-full',
    DESKTOP: 'text-sm text-gray-100 leading-relaxed break-all w-full',
  },
  ICONS_MARGIN: {
    MOBILE: 'mt-6',
    DESKTOP: 'mt-8',
  },
  CONTENT_MARGIN: {
    MOBILE: 'mb-4',
    DESKTOP: 'mb-8',
  },
} as const;

