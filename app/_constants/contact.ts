/**
 * Constants for Contact Section
 * 
 * Centralized configuration for contact section components,
 * animations, and styling.
 */

export const CONTACT_CONTENT = {
  SECTION_TITLE: '.../Contacts ...',
  NAME: {
    FIRST: 'Adribell',
    LAST: 'Montes',
  },
  ROLE: {
    TEXT: 'Full-stack',
    SUBTEXT: 'developer',
  },
} as const;

export const CONTACT_ANIMATION_DELAYS = {
  CIRCLE: 120,
  TITLE: 120,
  CONTACTS_HEADER: 220,
  FULLSTACK_TEXT: 270,
  LAST_NAME: 370,
  NAVBAR: 320,
  SOCIAL_LINKS: 400,
} as const;

export const CONTACT_CIRCLE_CONFIG = {
  SIZE: {
    width: '750px',
    height: '750px',
  },
  MOBILE: {
    OFFSET_X: 0, // Calculado dinámicamente
    OFFSET_Y: 0, // Calculado dinámicamente
  },
  DESKTOP: {
    OFFSET_X: -140,
    OFFSET_Y: 0, // Calculado dinámicamente
  },
  OPACITY: 0.5,
  Z_INDEX: 1,
} as const;

export const CONTACT_SECTION_CONFIG = {
  PADDING: {
    MOBILE: {
      TOP: '100px',
      BOTTOM: '100px',
    },
    DESKTOP: {
      TOP: '150px',
      BOTTOM: '50px',
    },
  },
  Z_INDEX: {
    SECTION: 10,
    CONTAINER: 10,
    CONTENT: 20,
    OVERLAY: 1000,
  },
  ANIMATION: {
    DURATION: 700,
    TIMING: 'ease-out',
    THRESHOLD: 0.2,
  },
} as const;

export const CONTACT_RESPONSIVE_BREAKPOINT = 768;

