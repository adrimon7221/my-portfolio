// app/_components/sections/ProjectsSection.tsx
import React from 'react';
import ProjectCard from '../ui/ProjectCard';

// Define el tipo para los proyectos
interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
}

const ProjectsSection: React.FC = () => {
  // Datos de ejemplo - después los puedes mover a un archivo separado o base de datos
  const projects: Project[] = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-featured e-commerce platform with cart functionality, payment integration, and admin dashboard built with Next.js and Stripe.",
      image: "", // Deja vacío por ahora o agrega una ruta de imagen
      tags: ["Next.js", "TypeScript", "Stripe", "Tailwind"],
      demoUrl: "https://example.com",
      githubUrl: "https://github.com/yourusername/project",
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, team collaboration features, and drag-and-drop interface.",
      image: "",
      tags: ["React", "Node.js", "Socket.io", "MongoDB"],
      demoUrl: "https://example.com",
      githubUrl: "https://github.com/yourusername/project",
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "Real-time weather dashboard with forecasts, interactive maps, and location-based alerts using external weather APIs.",
      image: "",
      tags: ["React", "API Integration", "Charts.js", "CSS"],
      demoUrl: "https://example.com",
      githubUrl: "https://github.com/yourusername/project",
    },
  ];

  return (
    <section id="projects" className="min-h-screen bg-blue-800 text-white px-4 py-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Featured <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Here are some of my recent projects that showcase my skills in web development, 
            from concept to deployment.
          </p>
        </div>

        {/* Grid de proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              image={project.image}
              tags={project.tags}
              demoUrl={project.demoUrl}
              githubUrl={project.githubUrl}
            />
          ))}
        </div>

        {/* Call to action opcional */}
        <div className="mt-16 text-center">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 border-2 border-white/20 rounded-lg font-semibold hover:border-purple-500 hover:bg-purple-500/10 transition-all"
          >
            View All Projects on GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;