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

