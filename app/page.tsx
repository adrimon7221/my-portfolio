import HeroSection from './_components/sections/HeroSection';
import ProjectsSection from './_components/sections/ProjectsSection';
import WorkSection from './_components/sections/WorkSection';
import ArticlesSection from './_components/sections/ArticlesSection';
import ContactSection from './_components/sections/ContactSection';
import Navbar from './_components/ui/Navbar';
import AboutSection from './_components/sections/AboutSection';
import { getSocialLinksFromDB } from './_lib/social-links';
import { getArticlesFromDB, getFeaturedArticlesFromDB } from './_lib/articles';

/**
 * Home Page (Server Component)
 * 
 * Obtiene los datos de enlaces sociales y artículos desde la base de datos
 * y los pasa como props a los Client Components hijos.
 * 
 * Esto sigue las mejores prácticas de Next.js 13+ App Router:
 * - Los datos se obtienen en el Server Component (esta página)
 * - Los datos se pasan como props a los Client Components
 * - Esto evita problemas de hidratación y mejora el rendimiento
 */
export default async function Home() {
  // Obtener enlaces sociales y artículos desde la base de datos (Server Component)
  const socialLinks = await getSocialLinksFromDB();
  const articles = await getArticlesFromDB();
  const featuredArticles = await getFeaturedArticlesFromDB();

  return (
    <main>
      {/* <HeroSection socialLinks={socialLinks} featuredArticles={featuredArticles} /> */}
      <AboutSection socialLinks={socialLinks} />
      <WorkSection />
      <ProjectsSection />
      {/* <ArticlesSection articles={articles} /> */}
      {/* <ContactSection socialLinks={socialLinks} /> */}
    </main>
  );
}