// app/_components/sections/ArticlesSection.tsx
import React from 'react';
import ArticleCard from '../ui/ArticleCard';

// Define el tipo para los artículos
interface Article {
  id: number;
  title: string;
  description: string;
  date: string;
  readTime: string;
  url: string;
  tags: string[];
}

const ArticlesSection: React.FC = () => {
  // Datos de ejemplo - personaliza con tus artículos reales
  const articles: Article[] = [
    {
      id: 1,
      title: "Building Scalable Applications with Next.js 14",
      description: "Learn how to leverage the latest features in Next.js 14 to build high-performance, scalable web applications. We'll cover server components, streaming, and optimization techniques.",
      date: "March 15, 2024",
      readTime: "8 min read",
      url: "https://medium.com/@yourusername/article-1",
      tags: ["Next.js", "React", "Performance"],
    },
    {
      id: 2,
      title: "TypeScript Best Practices for React Developers",
      description: "A comprehensive guide to writing type-safe React applications. Discover patterns, utilities, and tips that will make your TypeScript code more maintainable and robust.",
      date: "February 28, 2024",
      readTime: "10 min read",
      url: "https://dev.to/yourusername/article-2",
      tags: ["TypeScript", "React", "Best Practices"],
    },
    {
      id: 3,
      title: "State Management in Modern React Applications",
      description: "Exploring different state management solutions for React apps. From Context API to Zustand and Jotai, find the right tool for your project's needs.",
      date: "January 20, 2024",
      readTime: "12 min read",
      url: "https://hashnode.dev/@yourusername/article-3",
      tags: ["React", "State Management", "Architecture"],
    },
    {
      id: 4,
      title: "CSS-in-JS vs Tailwind: Making the Right Choice",
      description: "An in-depth comparison of different styling approaches in modern web development. Learn the pros and cons of each solution to make informed decisions.",
      date: "December 10, 2023",
      readTime: "7 min read",
      url: "https://medium.com/@yourusername/article-4",
      tags: ["CSS", "Tailwind", "Styling"],
    },
    {
      id: 5,
      title: "Building Real-time Features with WebSockets",
      description: "Step-by-step guide to implementing real-time functionality in your web applications using WebSockets and Socket.io. Perfect for chat apps and live updates.",
      date: "November 5, 2023",
      readTime: "15 min read",
      url: "https://dev.to/yourusername/article-5",
      tags: ["WebSockets", "Real-time", "Node.js"],
    },
    {
      id: 6,
      title: "Database Design Patterns for Scalable Applications",
      description: "Essential database design patterns every developer should know. Learn how to structure your data for optimal performance and scalability.",
      date: "October 18, 2023",
      readTime: "11 min read",
      url: "https://hashnode.dev/@yourusername/article-6",
      tags: ["Database", "PostgreSQL", "Architecture"],
    },
  ];

  return (
    <section id="articles" className="min-h-screen bg-black text-white px-4 py-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Latest <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Articles</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            I write about web development, software architecture, and everything in between. 
            Here are some of my recent articles.
          </p>
        </div>

        {/* Grid de artículos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              description={article.description}
              date={article.date}
              readTime={article.readTime}
              url={article.url}
              tags={article.tags}
            />
          ))}
        </div>

        {/* Call to action opcional */}
        <div className="mt-16 text-center">
          <a
            href="https://medium.com/@yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 border-2 border-white/20 rounded-lg font-semibold hover:border-purple-500 hover:bg-purple-500/10 transition-all"
          >
            View All Articles
          </a>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;