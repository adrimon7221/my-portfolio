/**
 * Articles Data
 * 
 * Centralized data for all articles displayed in the ArticlesSection.
 */

import { Article } from '@/app/_types';

/**
 * Articles array containing all article information.
 * 
 * @constant
 */
export const ARTICLES: readonly Article[] = [
  {
    id: 1,
    title: "The simplest example is Kafka + golang",
    description: "this article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
    url: "https://medium.com/@yourusername/article-1",
    date: "",
    readTime: "",
    tags: [],
  },
  {
    id: 2,
    title: "the simplest is Kafka + golang",
    description: "this article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
    url: "https://dev.to/yourusername/article-2",
    date: "",
    readTime: "",
    tags: [],
  },
  {
    id: 3,
    title: "the simplest is Kafka + golang",
    description: "this article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
    url: "https://hashnode.dev/@yourusername/article-3",
    date: "",
    readTime: "",
    tags: [],
  },
  {
    id: 4,
    title: "the simplest is Kafka + golang",
    description: "this article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
    url: "https://medium.com/@yourusername/article-4",
    date: "",
    readTime: "",
    tags: [],
  },
  {
    id: 5,
    title: "the simplest is Kafka + golang",
    description: "this article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
    url: "https://dev.to/yourusername/article-5",
    date: "",
    readTime: "",
    tags: [],
  },
  {
    id: 6,
    title: "the simplest is Kafka + golang",
    description: "this article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
    url: "https://hashnode.dev/@yourusername/article-6",
    date: "",
    readTime: "",
    tags: [],
  },
  {
    id: 7,
    title: "the simplest is Kafka + golang",
    description: "this article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
    url: "https://medium.com/@yourusername/article-7",
    date: "",
    readTime: "",
    tags: [],
  },
  {
    id: 8,
    title: "the simplest is Kafka + golang",
    description: "this article presents a simple way to implement a micro-service architecture using Kafka, golang and docker.",
    url: "https://dev.to/yourusername/article-8",
    date: "",
    readTime: "",
    tags: [],
  },
] as const;

