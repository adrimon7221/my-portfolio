/**
 * Types for carousel components
 */
export interface CarouselArticle {
  id: number;
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

