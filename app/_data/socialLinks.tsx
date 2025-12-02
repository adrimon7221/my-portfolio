import React from 'react';
import { SocialLinkItem } from '@/app/_types/social';
import { 
  FaGithub, 
  FaLinkedin, 
  FaTelegram, 
  FaFacebook, 
  FaInstagram 
} from 'react-icons/fa';

/**
 * Social media links configuration
 */
export const SOCIAL_LINKS: SocialLinkItem[] = [
  {
    href: 'https://github.com/your-username',
    label: 'GitHub',
    svg: <FaGithub className="w-4 h-4" aria-hidden />,
  },
  {
    href: 'https://linkedin.com/in/your-username',
    label: 'LinkedIn',
    svg: <FaLinkedin className="w-4 h-4" aria-hidden />,
  },
  {
    href: 'https://t.me/your-username',
    label: 'Telegram',
    svg: <FaTelegram className="w-4 h-4" aria-hidden />,
  },
  {
    href: 'https://facebook.com/your-username',
    label: 'Facebook',
    svg: <FaFacebook className="w-4 h-4" aria-hidden />,
  },
  {
    href: 'https://instagram.com/your-username',
    label: 'Instagram',
    svg: <FaInstagram className="w-4 h-4" aria-hidden />,
  },
];

