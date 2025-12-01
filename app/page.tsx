import HeroSection from './_components/sections/HeroSection';
import ProjectsSection from './_components/sections/ProjectsSection';
import WorkSection from './_components/sections/WorkSection';
import ArticlesSection from './_components/sections/ArticlesSection';
import ContactSection from './_components/sections/ContactSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProjectsSection />
      <WorkSection />
      <ArticlesSection />
      <ContactSection />
    </main>
  );
}