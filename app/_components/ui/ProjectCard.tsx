import React from 'react';
import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  image,
  tags,
  demoUrl,
  githubUrl,
}) => {
  return (
    <article className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300">
      <div className="relative w-full aspect-video overflow-hidden bg-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Project Image
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-400 mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
            >
              Live Demo
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-white/20 hover:border-purple-500 hover:bg-purple-500/10 rounded-lg text-sm font-medium transition-all"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;