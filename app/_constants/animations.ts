/**
 * Animation constants for consistent timing across components
 */
export const ANIMATION_DELAYS = {
  MOUNT_DELAY: 60,
  TITLE_DELAY: 120,
  BUTTON_DELAY: 220,
  ARROW_DELAY: 300,
  GOAL_TEXT_DELAY: 260,
  DEVELOPER_DELAY: 320,
  SOCIAL_LINKS_DELAY: 400,
  CAROUSEL_DELAY: 400,
  // Mobile layout specific delays
  MOBILE_DEVELOPER_OFFSET: 80,
  MOBILE_GOAL_TEXT_OFFSET: 20,
  MOBILE_BUTTON_OFFSET: 140,
  MOBILE_ARROW_OFFSET: 100,
} as const;

export const TRANSITION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 700,
  CAROUSEL: 600,
} as const;

export const TRANSITION_TIMINGS = {
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',
  CUBIC_BEZIER: 'cubic-bezier(0.2, 0.9, 0.3, 1)',
} as const;

