'use client'
import React from 'react';
import { DecorativeCircle } from '../ui/hero-section';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

const ProjectsSection: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const projects: Project[] = [
    {
      id: 1,
      title: "Gostat",
      description: "GOStat: a cutting-edge microservice-based application designed to handle HTTP request authentication and statistics with finesse. This project comprises several key microservices, each contributing to its overall functionality and prowess. The architecture leverages modern design patterns and ensures high availability and scalability across distributed systems.",
      image: "/images/img2.jpg",
      tags: ["Golang", "TypeScript", "Gin", "NextJs", "PostgreSQL", "Redis"]
    },
    {
      id: 2,
      title: "CloudSync",
      description: "CloudSync is a powerful cloud synchronization platform that enables seamless data transfer across multiple devices and cloud providers. Built with modern architecture principles, it ensures data integrity, security, and real-time synchronization capabilities for enterprise-level applications.",
      image: "/images/img2.jpg",
      tags: ["Golang", "TypeScript", "Gin", "NextJs", "PostgreSQL", "Redis"]
    },
    {
      id: 3,
      title: "DataFlow",
      description: "DataFlow provides advanced data processing and analytics solutions. It streamlines complex data pipelines, enabling organizations to transform raw data into actionable insights efficiently.",
      image: "/images/img2.jpg",
      tags: ["Golang", "TypeScript", "Gin", "NextJs", "PostgreSQL", "Redis"]
    }
  ];

  return (
    <section className="relative min-h-screen text-white py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-20">
        {/* Section Title */}
        <div className="relative mb-12 lg:mb-20">
          <h2 className="absolute text-xs text-white -top-8 left-0 lg:-top-[63px] lg:left-40 lg:left-80 xl:left-96 lg:text-sm">... /Projects ...</h2>
        </div>

        {/* Projects Layout */}
        <div className="relative min-h-[800px] lg:min-h-[900px]">
          {/* Desktop Layout */}
          <div className="hidden lg:block space-y-32">
            {projects.map((project, index) => {
              const isReversed = index === 1; // CloudSync (segundo proyecto)
              const gridCols = isReversed ? 'lg:grid-cols-[2.2fr_0.8fr]' : 'lg:grid-cols-[0.8fr_2.2fr]';
              
              return (
                <div key={project.id} className={`grid ${gridCols} lg:gap-20 lg:items-center pb-32 lg:pb-40`}>
                  {/* Columna Izquierda - Texto o Imagen según el proyecto */}
                  {isReversed ? (
                    /* Columna Izquierda - Círculo e Imagen (para CloudSync) */
                    <div className="relative flex items-start justify-start min-h-[600px]">
                      {/* Decorative Circle */}
                      <div
                        className={`absolute top-[45%] right-0 -translate-x-[20%] -translate-y-1/2 pointer-events-none transition-all duration-1000 ease-out z-0 ${
                          mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                      >
                        <DecorativeCircle customSize={{ width: '750px', height: '750px' }} className="border-white/10" />
                      </div>

                      {/* Imagen principal */}
                      <div className={`relative z-10 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} transition-all duration-700 delay-200`}>
                        <div className="rounded-3xl overflow-hidden border-2 border-white/20 hover:border-white/40 transition-all w-[830px] h-[555px]">
                          <img src={project.image} alt={`${project.title} Dashboard`} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Columna Izquierda - Texto (para otros proyectos) */
                    <div className={`py-8 w-full overflow-hidden ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'} transition-all duration-700 delay-100`}>
                      <div className="group w-full">
                        {/* Info del proyecto */}
                        <div className="mb-8 w-full">
                          <div className="text-xl font-semibold mb-8">{project.title}</div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="px-3 py-1 text-xs bg-white/10 rounded-full border border-white/20">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2 mb-8">
                            {project.tags.slice(3).map((tag) => (
                              <span key={tag} className="px-3 py-1 text-xs bg-white/10 rounded-full border border-white/20">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed break-all w-full" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                            {project.description}
                          </p>
                        </div>
                        {/* Iconos */}
                        <div className="flex gap-2 mt-8">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                            </svg>
                          </div>
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="black">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Columna Derecha - Imagen o Texto según el proyecto */}
                  {isReversed ? (
                    /* Columna Derecha - Texto (para CloudSync) */
                    <div className={`py-8 w-full overflow-hidden ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'} transition-all duration-700 delay-100`}>
                      <div className="group w-full">
                        {/* Info del proyecto */}
                        <div className="mb-8 w-full">
                          <div className="text-xl font-bold not-italic mb-2">{project.title}</div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="px-3 py-1 text-xs bg-white/10 rounded-full border border-white/20">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.slice(3).map((tag) => (
                              <span key={tag} className="px-3 py-1 text-xs bg-white/10 rounded-full border border-white/20">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed break-all w-full" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                            {project.description}
                          </p>
                        </div>
                        {/* Iconos */}
                        <div className="flex gap-2 mt-8">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                            </svg>
                          </div>
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="black">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Columna Derecha - Círculo e Imagen (para otros proyectos) */
                    <div className="relative flex items-start justify-end min-h-[600px]">
                      {/* Decorative Circle */}
                      <div
                        className={`absolute top-[45%] left-1/2 -translate-x-[40%] -translate-y-1/2 pointer-events-none transition-all duration-1000 ease-out z-0 ${
                          mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                      >
                        <DecorativeCircle customSize={{ width: '750px', height: '750px' }} className="border-white/10" />
                      </div>

                      {/* Imagen principal */}
                      <div className={`relative z-10 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} transition-all duration-700 delay-200`}>
                        <div className="rounded-3xl overflow-hidden border-2 border-white/20 hover:border-white/40 transition-all w-[830px] h-[555px]">
                          <img src={project.image} alt={`${project.title} Dashboard`} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-28">
            {projects.map((project, index) => (
              <div key={project.id} className="relative">
                <div className={`relative z-10 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`} style={{ transitionDelay: mounted ? `${index * 100}ms` : '0ms' }}>
                  {/* Imagen primero */}
                  <div className="relative mb-6 rounded-3xl overflow-visible border-2 border-white/20">
                    {/* Decorative Circle - detrás de cada imagen, más pequeño */}
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-1000 ease-out z-0 ${
                        index === 0 || index === projects.length - 1
                          ? 'right-0 translate-x-1/2' // Primer y último: derecha, mitad visible
                          : 'left-0 -translate-x-1/2' // Segundo: izquierda, mitad visible
                      } ${
                        mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      }`}
                    >
                      <DecorativeCircle customSize={{ width: '500px', height: '500px' }} className="!border !border-white/10" />
                    </div>
                    <div className="relative z-10 rounded-3xl overflow-hidden">
                      <img src={project.image} alt={project.title} className="w-full h-64 object-cover" />
                    </div>
                  </div>
                  
                  {/* Texto después */}
                  <div className="mb-4">
                    <div className="text-lg lg:text-xl font-semibold mb-2 not-italic">{project.title}</div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2.5 py-0.5 lg:px-3 lg:py-1 text-[10px] lg:text-xs bg-white/10 rounded-full border border-white/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(3).map((tag) => (
                        <span key={tag} className="px-2.5 py-0.5 lg:px-3 lg:py-1 text-[10px] lg:text-xs bg-white/10 rounded-full border border-white/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs lg:text-sm text-gray-400 leading-relaxed break-all w-full" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      {project.description}
                    </p>
                  </div>
                  {/* Iconos */}
                  <div className="flex gap-2 mt-6">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="black">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;