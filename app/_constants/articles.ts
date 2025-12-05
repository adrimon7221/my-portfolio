/**
 * Articles Section Constants
 */

export const ARTICLES_CONFIG = {
  PAGINATION: {
    MOBILE_ITEMS_PER_PAGE: 3,
    DESKTOP_ITEMS_PER_PAGE: 4,
    MOBILE_BREAKPOINT: 768, // md breakpoint
  },
  ANIMATION: {
    TITLE_DELAY_OFFSET: 200,
    BORDER_DELAY_OFFSET: 200,
    BUTTONS_DELAY_OFFSET: 300,
    ARTICLE_DELAY_INCREMENT: 80,
    TRANSITION_DURATION: 150,
    TRANSITION_RESET_DELAY: 30,
    FADE_DURATION: 200,
  },
  LAYOUT: {
    PAGINATION_WIDTH: '15%',
    ARTICLES_WIDTH: '85%',
  },
} as const;

export const ARTICLES_CONTENT = {
  SECTION_TITLE: 'Articles',
  PAGINATION: {
    PAGE_1_LABEL: 'Página 1',
    PAGE_2_LABEL: 'Página 2',
    NEXT_LABEL: 'Siguiente',
  },
} as const;

