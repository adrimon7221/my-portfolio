/**
 * Project interface
 * 
 * Represents a project in the portfolio.
 * All fields are readonly for immutability.
 */
export interface Project {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly images?: readonly string[]; // Optional array for image collage
  readonly tags: readonly string[];
  readonly demoUrl?: string;
  readonly githubUrl?: string;
}

export interface WorkExperience {
  id: number;
  year: string;
  company: string;
  position: string;
  location?: string;
  description?: string;
  technologies?: string[];
}

export interface Article {
  id: number;
  title: string;
  description: string;
  date: string;
  readTime: string;
  url: string;
  tags: string[];
}

export interface Skill {
  name: string;
  category?: string;
}

/**
 * Circle position type for project layouts
 */
export type CirclePosition = 'left' | 'right';