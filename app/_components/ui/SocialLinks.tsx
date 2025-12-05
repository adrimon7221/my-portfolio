'use client'
import React, { useEffect, useState } from 'react';
import { SOCIAL_LINKS } from '@/app/_data/socialLinks';

export default function SocialLinks({ className = '' }: { className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <nav aria-label="Redes sociales" className={className}>
      <ul className="grid grid-cols-2 lg:flex gap-6 max-w-md lg:max-w-none mx-auto lg:mx-0">
        {SOCIAL_LINKS.map((item, i) => (
          <li
            key={item.href}
            style={{ transitionDelay: `${i * 60}ms` }}
            className={`transform transition-all duration-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="group flex items-center gap-3 px-6 py-2 border border-white/10 rounded-full bg-black/40 backdrop-blur-md text-sm text-gray-200 hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 w-full lg:w-auto"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black/30 group-hover:bg-black/0 transition-all duration-300 group-hover:rotate-12 flex-shrink-0">
                {item.svg}
              </span>
              <span className="inline-block transition-all duration-300 group-hover:font-semibold">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}