// app/_components/ui/WorkItem.tsx
import React from 'react';

interface WorkItemProps {
  year: string;
  company: string;
  position: string;
  location?: string;
  description?: string;
  technologies?: string[];
}

const WorkItem: React.FC<WorkItemProps> = ({
  year,
  company,
  position,
  location,
  description,
  technologies,
}) => {
  return (
    <div className="group relative border-l-2 border-white/10 pl-8 pb-12 last:pb-0 hover:border-purple-500/50 transition-colors">
      {/* Punto en la línea de tiempo */}
      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-600 border-4 border-black group-hover:scale-125 transition-transform" />
      
      {/* Año */}
      <div className="text-sm text-purple-400 font-semibold mb-2">
        {year}
      </div>

      {/* Posición y Empresa */}
      <h3 className="text-2xl font-bold mb-1 group-hover:text-purple-400 transition-colors">
        {position}
      </h3>
      <div className="text-lg text-gray-300 mb-2">
        {company}
        {location && <span className="text-gray-500"> • {location}</span>}
      </div>

      {/* Descripción */}
      {description && (
        <p className="text-gray-400 mb-4 leading-relaxed">
          {description}
        </p>
      )}

      {/* Tecnologías */}
      {technologies && technologies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkItem;