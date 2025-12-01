import React from 'react';
import WorkItem from '../ui/WorkItem';

interface WorkExperience {
  id: number;
  year: string;
  company: string;
  position: string;
  location?: string;
  description?: string;
  technologies?: string[];
}

const WorkSection: React.FC = () => {
  const workExperience: WorkExperience[] = [
    {
      id: 1,
      year: "2023 - Present",
      company: "Tech Innovation Inc.",
      position: "Senior Full-stack Developer",
      location: "Remote",
      description: "Leading development of enterprise web applications, mentoring junior developers, and implementing best practices for code quality and performance. Reduced page load times by 40% through optimization.",
      technologies: ["React", "Next.js", "Node.js", "PostgreSQL", "AWS"],
    },
    {
      id: 2,
      year: "2021 - 2023",
      company: "Digital Solutions Co.",
      position: "Full-stack Developer",
      location: "San Francisco, CA",
      description: "Developed and maintained multiple client-facing applications. Collaborated with design team to create responsive, accessible interfaces. Implemented CI/CD pipelines for automated testing and deployment.",
      technologies: ["React", "TypeScript", "Express", "MongoDB", "Docker"],
    },
    {
      id: 3,
      year: "2020 - 2021",
      company: "StartupXYZ",
      position: "Frontend Developer",
      location: "New York, NY",
      description: "Built user interfaces for a SaaS product serving 10,000+ users. Worked closely with UX designers to implement pixel-perfect designs. Participated in agile development processes.",
      technologies: ["JavaScript", "React", "Redux", "CSS", "REST APIs"],
    },
    {
      id: 4,
      year: "2019 - 2020",
      company: "Freelance",
      position: "Web Developer",
      location: "Remote",
      description: "Delivered custom web solutions for small businesses and startups. Managed complete project lifecycle from client consultation to deployment and maintenance.",
      technologies: ["HTML", "CSS", "JavaScript", "WordPress", "PHP"],
    },
  ];

  return (
    <section id="work" className="min-h-screen bg-green-800 text-white px-4 py-24">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Work <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Experience</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            My professional journey in software development, from startups to enterprise solutions.
          </p>
        </div>

        <div className="relative">
          {workExperience.map((work) => (
            <WorkItem
              key={work.id}
              year={work.year}
              company={work.company}
              position={work.position}
              location={work.location}
              description={work.description}
              technologies={work.technologies}
            />
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400">
              Want to know more about my experience?
            </p>
            <a
              href="/resume.pdf"
              download
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
            >
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;