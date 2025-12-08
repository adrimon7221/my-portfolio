/**
 * Types for carousel components
 */
export interface CarouselArticle {
  id: number | string; // Puede ser number (legacy) o string (desde BD)
  title: string;
  description: string;
  url: string;
  image?: string; // Optional image URL for the article
}

export interface ArticleCarouselProps {
  articles: CarouselArticle[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

