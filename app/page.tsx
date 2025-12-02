import HeroSection from './_components/sections/HeroSection';
import ProjectsSection from './_components/sections/ProjectsSection';
import WorkSection from './_components/sections/WorkSection';
import ArticlesSection from './_components/sections/ArticlesSection';
import ContactSection from './_components/sections/ContactSection';
import Navbar from './_components/ui/Navbar';
import AboutSection from './_components/sections/AboutSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <WorkSection />
      <ArticlesSection />
      <ContactSection />
    </main>
  );
}