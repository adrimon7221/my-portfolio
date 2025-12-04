/**
 * Projects Data
 * 
 * Centralized data for all projects displayed in the ProjectsSection.
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

/**
 * Projects array containing all project information.
 * 
 * @constant
 */
export const PROJECTS: readonly Project[] = [
          {
            id: 1,
            title: "Gostat",
            description: "GOStat: a cutting-edge microservice-based application designed to handle HTTP request authentication and statistics with finesse.\n\nThis project comprises several key microservices, each contributing to its overall functionality and prowess. The architecture leverages modern design patterns and ensures high availability and scalability across distributed systems.",
            image: "/images/img2.jpg",
            images: ["/images/rojo.jpg", "/images/verde.jpg", "/images/morado.jpg", "/images/azul.jpg"] as const,
            tags: ["Golang", "TypeScript", "Gin", "NextJs", "PostgreSQL", "Redis"] as const,
          },
  {
    id: 2,
    title: "CloudSync",
    description: "CloudSync is a powerful cloud synchronization platform that enables seamless data transfer across multiple devices and cloud providers. Built with modern architecture principles, it ensures data integrity, security, and real-time synchronization capabilities for enterprise-level applications.",
    image: "/images/img2.jpg",
    images: ["/images/amarillo.jpg", "/images/celeste.jpg", "/images/gris.jpg"] as const,
    tags: ["Golang", "TypeScript", "Gin", "NextJs", "PostgreSQL", "Redis"] as const,
  },
  {
    id: 3,
    title: "DataFlow",
    description: "DataFlow provides advanced data processing and analytics solutions. It streamlines complex data pipelines, enabling organizations to transform raw data into actionable insights efficiently.",
    image: "/images/img2.jpg",
    tags: ["Golang", "TypeScript", "Gin", "NextJs", "PostgreSQL", "Redis"] as const,
  },
] as const;

