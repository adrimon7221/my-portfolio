/**
 * Types for social media components
 */
export interface SocialLinkItem {
  id?: string; // ID único del enlace (opcional para compatibilidad)
  href: string;
  label: string;
  svg: React.ReactNode;
}

