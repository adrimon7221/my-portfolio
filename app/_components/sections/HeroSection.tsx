import React from 'react';
import SkillTag from '../ui/SkillTag';

const HeroSection: React.FC = () => {
  return (
    <section className="min-h-screen bg-red-500 text-white flex items-center px-4 py-16">
      <div className="max-w-7xl mx-auto w-full">
        {/* Título y nombre */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            Full-stack
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Developer
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            I&apos;m a full-stack <span className="text-purple-400 font-semibold">web developer</span> with 
            experience building responsive web applications using modern technologies.
          </p>
        </div>

        {/* Skills/Technologies */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Tech Stack</h3>
          <div className="flex flex-wrap gap-3">
            <SkillTag name="React" />
            <SkillTag name="Next.js" />
            <SkillTag name="TypeScript" />
            <SkillTag name="Node.js" />
            <SkillTag name="Tailwind CSS" />
            <SkillTag name="PostgreSQL" />
            <SkillTag name="MongoDB" />
            <SkillTag name="Git" />
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg font-semibold hover:-translate-y-1 transition-transform">
            View My Work
          </button>
          <button className="px-8 py-3 border-2 border-white/20 rounded-lg font-semibold hover:border-purple-500 hover:bg-purple-500/10 transition-all">
            Contact Me
          </button>
        </div>

        {/* Imagen o ilustración (opcional) */}
        <div className="mt-12">
          <div className="w-full max-w-lg aspect-square bg-white/5 rounded-3xl border border-white/10">
            {/* Aquí va tu imagen o ilustración */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;