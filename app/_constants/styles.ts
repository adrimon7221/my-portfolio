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
  FADE_IN_FROM_RIGHT: (mounted: boolean) =>
    `transition-all duration-700 ease-out transform ${
      mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
    }`,
  FADE_IN_FROM_LEFT: (mounted: boolean) =>
    `transition-all duration-900 transform ${
      mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
    }`,
  FADE_IN_FROM_BOTTOM: (mounted: boolean) =>
    `transition-all duration-700 transform ${
      mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    }`,
} as const;

