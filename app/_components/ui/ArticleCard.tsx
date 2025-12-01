import React from 'react';

interface ArticleCardProps {
  title: string;
  description: string;
  date: string;
  readTime: string;
  url: string;
  tags: string[];
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  description,
  date,
  readTime,
  url,
  tags,
}) => {
  return (
    <article className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
        <time dateTime={date}>{date}</time>
        <span>•</span>
        <span>{readTime}</span>
      </div>

      <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {title}
        </a>
      </h3>

      <p className="text-gray-400 mb-4 line-clamp-3">
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

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-purple-400 font-semibold group-hover:gap-3 transition-all"
      >
        Read article
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M14 5l7 7m0 0l-7 7m7-7H3" 
          />
        </svg>
      </a>
    </article>
  );
};

export default ArticleCard;