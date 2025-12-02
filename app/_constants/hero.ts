/**
 * Hero Section Constants
 */
export const HERO_CONTENT = {
  TITLE: 'Full-stack',
  SUBTITLE: 'Developer',
  GOAL_TEXT: {
    PREFIX: 'My goal is to',
    EMPHASIS_1: 'write maintainable, clean',
    CONNECTOR: 'and',
    EMPHASIS_2: 'understandable code',
    SUFFIX: 'so that development was enjoyable.',
  },
  BUTTONS: {
    PROJECTS: {
      LABEL: 'Projects',
      HREF: '/projects',
      ARIA_LABEL: 'Ver proyectos',
    },
    ARROW: {
      ARIA_LABEL: 'Ir a Projects',
    },
  },
} as const;

export const HERO_COLORS = {
  BUTTON_BG: '#FFF',
  BUTTON_TEXT: '#000',
} as const;
