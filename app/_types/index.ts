export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
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