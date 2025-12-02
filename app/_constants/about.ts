/**
 * Constants for About Section
 */

export const ABOUT_CONTENT = {
  SECTION_TITLE: '... /About me ...',
  INTRO_TEXT: {
    GREETING: "Hello! I'm",
    NAME: "Nikita",
    ROLE: "full-stack developer",
    EXPERIENCE: "More than",
    YEARS: "5 years",
    EXPERIENCE_TEXT: "experience.",
  },
  DEVOPS_DESCRIPTION: {
    TEXT: "Some of my",
    FAVORITE_TECH: "favorite technologies",
    TOPICS: "topics",
    TOOLS: "tools",
    END_TEXT: "that i worked with",
  },
} as const;

export const ABOUT_ANIMATION_DELAYS = {
  HEADER_TITLE: 0,
  INTRO_FIRST: 80,
  INTRO_SECOND: 160,
  PHOTO_RESPONSIVE: 240,
  PHOTO_DESKTOP: 400,
  FRONTEND: 320,
  STYLES: 400,
  SOCIAL_LINKS: 480,
  BACKEND: 560,
  DEVOPS_DESCRIPTION: 640,
  DEVOPS: 720,
  IMAGE_DELAY_OFFSET: 200,
} as const;

export const ABOUT_PHOTO_CONFIG = {
  RESPONSIVE: {
    MAX_WIDTH: {
      MOBILE: '280px',
      SM: '320px',
    },
    CIRCLE: {
      SIZE: { width: '470px', height: '470px' },
      POSITION: 'top-[35%] left-full -translate-x-1/3',
    },
  },
  DESKTOP: {
    MAX_WIDTH: {
      MOBILE: '350px',
      SM: '400px',
      MD: '450px',
      LG: '500px',
    },
    CIRCLE: {
      MOBILE: { width: '350px', height: '350px' },
      TABLET: { width: '520px', height: '520px' },
      DESKTOP: { width: '650px', height: '650px' },
      POSITION: 'top-[15%] left-1/2 -translate-x-1/2',
    },
  },
} as const;

export const TECH_BOX_CONFIG = {
  ANIMATION: {
    DURATION: '800ms',
    EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
    TRANSLATE_DISTANCE: 10,
    HOVER_DURATION: '300ms',
  },
  STYLES: {
    BASE: 'rounded-2xl sm:rounded-3xl border border-white transition-all duration-300 hover:bg-white hover:border-white hover:text-black cursor-pointer',
  },
} as const;

export const SOCIAL_LINKS_CONFIG = {
  GITHUB_BUTTON: {
    SIZE: 'w-16 h-16',
    ICON_SIZE: '[&_svg]:w-10 [&_svg]:h-10',
  },
  ARROW_BUTTON: {
    SIZE: '!w-14 !h-14',
  },
} as const;

