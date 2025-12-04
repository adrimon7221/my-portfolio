/**
 * Project-specific animation constants
 * 
 * Centralized animation configuration for project components
 */

export const PROJECT_ANIMATION_STYLES = {
  ENTRANCE: {
    DURATION: 700,
    TIMING: 'ease-out',
    TRANSFORM: {
      SCALE: { from: 'scale(0.95)', to: 'scale(1)' },
      LEFT: { from: 'translateX(-32px)', to: 'translateX(0)' },
      RIGHT: { from: 'translateX(32px)', to: 'translateX(0)' },
      UP: { from: 'translateY(-32px)', to: 'translateY(0)' },
      DOWN: { from: 'translateY(32px)', to: 'translateY(0)' },
    },
  },
  HOVER: {
    CONTAINER_DURATION: 200,
    IMAGE_DURATION: 300,
    TIMING: 'ease-in-out',
  },
} as const;

export const PROJECT_IMAGE_HOVER = {
  CONTAINER_SCALE: {
    SMALL: 'scale-105',
    MEDIUM: 'scale-[1.02]',
  },
  IMAGE_SCALE: 'scale-110',
} as const;

