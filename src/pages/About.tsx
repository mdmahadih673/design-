import { motion } from 'motion/react';
import { SectionHeading } from '@/src/components/SectionHeading';
import { usePortfolioData } from '@/src/hooks/usePortfolioData';
import { Button } from '@/src/components/Button';
import { Download, Coffee, Zap, Palette } from 'lucide-react';

export function About() {
  const { about, loading } = usePortfolioData();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
    </div>
  );

  const skills = about?.skills || [
    { name: 'Adobe Photoshop', level: 95 },
    { name: 'Adobe Illustrator', level: 90 },
    { name: 'Adobe InDesign', level: 80 },
    { name: 'Figma', level: 85 },
    { name: 'Canva', level: 90 },
    { name: 'Adobe After Effects', level: 70 },
  ];

  const experience = about?.experience || [
    { year: '2023 - Present', role: 'Senior Graphic Designer', company: 'Creative Studio', description: 'Leading visual design for major branding projects.' },
    { year: '2021 - 2023', role: 'Graphic Designer', company: 'Digital Agency', description: 'Created social media assets and print materials.' }
  ];

  const facts = about?.facts || [
    { text: '500+ cups of coffee consumed' },
    { text: '1000+ hours of designing' },
    { text: 'Favorite tool: Illustrator' },
    { text: 'Dedicated to pixel perfection' }
  ];

  return (
    <div className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* About Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-[4/5] rounded-3xl md:rounded-[3rem] overflow-hidden"
          >
            <img 
              src={about?.photo || "https://images.unsplash.com/photo-1519085184628-66e7371f1140?q=80&w=800&auto=format&fit=crop"} 
              alt="Designer" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block">
              {about?.badge || "Designer since 2021"}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-8">
              {about?.title || "Turning complex ideas into simple visuals."}
            </h1>
            <p className="text-xl text-light-text leading-relaxed mb-8">
              {about?.bio1 || "I'm Alex, a passionate graphic designer with 3+ years of experience creating visual identities that tell compelling stories."}
            </p>
            <p className="text-lg text-light-text leading-relaxed mb-10">
              {about?.bio2 || "Based in London, I'm currently working with global brands and local startups to elevate their visual presence through clean, intentional design."}
            </p>
            {about?.resumeUrl && (
              <a href={about.resumeUrl} target="_blank" rel="noreferrer">
                <Button size="lg" className="gap-2">
                  <Download size={18} /> Download My Resume
                </Button>
              </a>
            )}
          </motion.div>
        </section>

        {/* Skills & Stats */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 mb-20 md:mb-32">
          <div>
            <h2 className="text-3xl font-bold font-heading mb-10">Skills & Tools</h2>
            <div className="space-y-8">
              {skills.map((skill: any) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{skill.name}</span>
                    <span className="text-light-text">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-accent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {facts.map((fact: any, i: number) => (
              <div key={i} className="p-8 rounded-3xl bg-black/5 dark:bg-white/5 relative overflow-hidden flex flex-col items-center justify-center text-center">
                <div className="text-accent mb-4">
                  {i % 3 === 0 ? <Coffee /> : i % 3 === 1 ? <Zap /> : <Palette />}
                </div>
                <p className="font-semibold text-lg">{fact.text}</p>
                {i === facts.length - 1 && <Zap size={80} className="text-accent/10 absolute -right-10 -bottom-10" />}
              </div>
            ))}
          </div>
        </section>

        {/* Experience Timeline */}
        <section>
          <SectionHeading title="Work Experience" align="center" />
          <div className="max-w-3xl mx-auto space-y-12">
            {experience.map((exp: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row gap-8 md:gap-16 border-l-2 border-accent/20 pl-8 relative"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white dark:bg-dark border-4 border-accent" />
                <div className="w-full md:w-32 flex-shrink-0">
                  <span className="text-sm font-bold text-accent whitespace-nowrap">{exp.year}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{exp.role}</h3>
                  <p className="text-accent font-medium mb-4">{exp.company}</p>
                  <p className="text-light-text leading-relaxed">{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
