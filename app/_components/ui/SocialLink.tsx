// app/_components/ui/SocialLink.tsx
import React from 'react';

interface SocialLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, label, icon }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group relative p-3 bg-white/5 border border-white/10 rounded-lg hover:border-purple-500 hover:bg-purple-500/10 transition-all"
    >
      <div className="w-6 h-6 text-gray-400 group-hover:text-purple-400 group-hover:scale-110 transition-all">
        {icon}
      </div>
    </a>
  );
};

export default SocialLink;