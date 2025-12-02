import React from 'react';
import { SocialLinkItem } from '@/app/_types/social';

/**
 * Social media links configuration
 */
export const SOCIAL_LINKS: SocialLinkItem[] = [
  {
    href: 'https://github.com/your-username',
    label: 'GitHub',
    svg: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
        <path d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.6-4-1.6-.5-1.1-1.2-1.4-1.2-1.4-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.7 1.6 2.4 2.1 0 .6-.1 1-.1 1.3 0 .3.2.6.8.5A12 12 0 0012 .5z" />
      </svg>
    ),
  },
  {
    href: 'https://linkedin.com/in/your-username',
    label: 'LinkedIn',
    svg: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
        <path d="M4.98 3.5a2.5 2.5 0 11-.001 5.001A2.5 2.5 0 014.98 3.5zM3 9h4v12H3zM10 9h3.8v1.6h.1c.5-.9 1.8-1.8 3.7-1.8 4 0 4.7 2.6 4.7 6V21h-4v-5.1c0-1.2 0-2.7-1.7-2.7-1.7 0-2 1.3-2 2.6V21H10z" />
      </svg>
    ),
  },
  {
    href: 'https://t.me/your-username',
    label: 'Telegram',
    svg: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
        <path d="M21 3L3 10.5l4.5 1.5L19 5l-6.4 9.6L16 21z" />
      </svg>
    ),
  },
  {
    href: 'https://facebook.com/your-username',
    label: 'Facebook',
    svg: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
        <path d="M22 12a10 10 0 10-11.5 9.8v-6.9H8.5v-2.9h2V9.8c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2v1.5h2.2l-.4 2.9h-1.8v6.9A10 10 0 0022 12" />
      </svg>
    ),
  },
  {
    href: 'https://instagram.com/your-username',
    label: 'Instagram',
    svg: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
        <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.2A4.8 4.8 0 1112 17.8 4.8 4.8 0 0112 8.2zM18.5 6a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
      </svg>
    ),
  },
];

