import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Cpu, 
  Layers, 
  HardDrive, 
  CheckCircle, 
  MapPin, 
  Monitor, 
  Mail, 
  ExternalLink,
  Sliders,
  Boxes,
  Compass,
  Briefcase,
  Printer,
  User,
  Home,
  Play
} from 'lucide-react';

// Data and components
import { PROJECTS, SPECS, PROCESS_STEPS, HERO_IMAGE } from './data';
import { Project } from './types';
import Header from './components/Header';
import CompareSlider from './components/CompareSlider';
import MaterialInspector from './components/MaterialInspector';
import RenderSimulator from './components/RenderSimulator';
import ContactForm from './components/ContactForm';
import ProjectDetailsModal from './components/ProjectDetailsModal';
import ScrollIntro from './components/ScrollIntro';
import { useTranslation } from './i18n';

const SEO_SERVICE_DEFINITIONS = [
  { key: 'modeling', icon: Boxes },
  { key: 'printing', icon: Printer },
  { key: 'pbr', icon: Layers },
  { key: 'assets', icon: Cpu },
  { key: 'custom', icon: Sparkles },
  { key: 'freelance', icon: Briefcase },
  { key: 'design', icon: Sliders },
  { key: 'rendering', icon: Monitor },
  { key: 'animation', icon: Play },
  { key: 'characters', icon: User },
  { key: 'architecture', icon: Home },
  { key: 'polycount', icon: HardDrive },
] as const;

export default function App() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('portfolio');
  const [activeCategory, setActiveCategory] = useState<'all' | 'modeling' | 'texturing' | 'rendering'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // References for scroll spy
  const portfolioRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const specsRef = useRef<HTMLElement>(null);
  const studioRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Scroll Spy Logic
      const scrollPos = window.scrollY + 200;
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;

      if (isAtBottom) {
        setActiveSection('contact');
      } else if (portfolioRef.current && scrollPos >= portfolioRef.current.offsetTop && scrollPos < portfolioRef.current.offsetTop + portfolioRef.current.offsetHeight) {
        setActiveSection('portfolio');
      } else if (processRef.current && scrollPos >= processRef.current.offsetTop && scrollPos < processRef.current.offsetTop + processRef.current.offsetHeight) {
        setActiveSection('process');
      } else if (specsRef.current && scrollPos >= specsRef.current.offsetTop && scrollPos < specsRef.current.offsetTop + specsRef.current.offsetHeight) {
        setActiveSection('specs');
      } else if (contactRef.current && scrollPos >= contactRef.current.offsetTop) {
        setActiveSection('contact');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const localizedProjects = useMemo(() => PROJECTS.map((project) => {
    const projectTranslations: Record<string, { title: string; description: string }> = {
      'smart-planter': t.projects.smartPlanter,
      'tactical-drone': t.projects.tacticalDrone,
      'headphones': t.projects.headphones,
      'cutting-mat-files': t.projects.cuttingMatFiles,
      'studio-art-room': t.projects.studioArtRoom,
      'industrial-valves': t.projects.industrialValves,
      'timber-window': t.projects.timberWindow,
      'sword-model': t.projects.swordModel,
      'abandoned-hall': t.projects.abandonedHall,
    };
    const localizedProject = projectTranslations[project.id];

    return {
      ...project,
      title: localizedProject?.title ?? project.title,
      description: localizedProject?.description ?? project.description,
    };
  }), [t]);

  const filteredProjects = activeCategory === 'all'
    ? localizedProjects
    : localizedProjects.filter((project: Project) => project.category === activeCategory);

  const workflowSteps = useMemo(() => [
    { number: '01', title: t.workflow.blockout.title, description: t.workflow.blockout.description },
    { number: '02', title: t.workflow.sculpting.title, description: t.workflow.sculpting.description },
    { number: '03', title: t.workflow.retopology.title, description: t.workflow.retopology.description },
    { number: '04', title: t.workflow.baking.title, description: t.workflow.baking.description },
    { number: '05', title: t.workflow.udim.title, description: t.workflow.udim.description },
    { number: '06', title: t.workflow.rendering.title, description: t.workflow.rendering.description },
  ], [t]);

  const skillCards = useMemo(() => [
    { key: 'blenderModeling', level: 95, category: 'software', iconName: 'Cuboid', details: t.specs.blenderModeling.details },
    { key: 'substancePainter', level: 90, category: 'software', iconName: 'Layers', details: t.specs.substancePainter.details },
    { key: 'vRay', level: 88, category: 'software', iconName: 'Eye', details: t.specs.vRay.details },
    { key: 'photoshop', level: 85, category: 'software', iconName: 'Cpu', details: t.specs.photoshop.details },
    { key: 'inkscape', level: 85, category: 'software', iconName: 'Layers', details: t.specs.inkscape.details },
    { key: 'illustrator', level: 88, category: 'software', iconName: 'Layers', details: t.specs.illustrator.details },
    { key: 'vsCode', level: 90, category: 'software', iconName: 'Cpu', details: t.specs.vsCode.details },
    { key: 'fSpy', level: 92, category: 'software', iconName: 'Eye', details: t.specs.fSpy.details },
    { key: 'cad', level: 84, category: 'software', iconName: 'Cuboid', details: t.specs.cad.details },
    { key: 'bambu', level: 94, category: 'software', iconName: 'HardDrive', details: t.specs.bambu.details },
  ], [t]);

  const seoServices = useMemo(() => SEO_SERVICE_DEFINITIONS.map((service) => ({
    ...service,
    title: t.services[service.key as keyof typeof t.services].title,
    subTitle: t.services[service.key as keyof typeof t.services].subTitle,
    description: t.services[service.key as keyof typeof t.services].description,
    keywords: t.services[service.key as keyof typeof t.services].keywords,
  })), [t]);

  return (
<div className="bg-background text-on-surface font-sans antialiased selection:bg-industrial-orange selection:text-white overflow-x-hidden relative">
        <main className="relative min-h-screen">
        {/* Background Tech filament ambient vector effect */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      {/* Scrolled animated intro (every 4th frame from /frames) */}
      <ScrollIntro />

      {/* Dynamic ambient bottom warm light */}
      <div className="fixed bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-industrial-orange/5 to-transparent pointer-events-none z-0 mix-blend-screen"></div>

      {/* Floating Header */}
      <Header 
        onContactClick={() => setContactModalOpen(true)} 
        activeSection={activeSection}
        onSectionChange={(id) => setActiveSection(id)}
      />

      {/* HERO SECTION */}
      <section 
        id="portfolio"
        ref={portfolioRef}
        className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      >
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center select-none transform scale-105"
            style={{ 
              backgroundImage: `url(${HERO_IMAGE})`
            }}
          />
          {/* Real ambient gradients from mockup layout */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/95 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80"></div>
        </div>

        {/* Floating edge cards for high-fidelity portfolio presentation */}
        <div className="relative z-10 w-full h-full max-w-7xl mx-auto p-6 md:p-12 flex flex-col justify-between pointer-events-none">
          
          {/* Top Status Indicators Row */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mt-24">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-panel p-4 rounded-xl pointer-events-auto shadow-2xl border border-white/15 max-w-xs flex gap-3.5 items-center backdrop-blur-md"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-printer-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-printer-green"></span>
              </span>
              <div>
                <span className="font-mono text-[10px] text-printer-green uppercase tracking-widest block font-bold">{t.common.artistStatus}</span>
                <span className="font-sans text-sm font-black text-white">{t.common.availableForProjects}</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-panel p-4 rounded-xl pointer-events-auto shadow-2xl border border-white/15 max-w-xs flex gap-3.5 items-center md:text-right backdrop-blur-md"
            >
              <div className="md:order-1 order-2">
                <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest block font-bold">{t.common.locationSpec}</span>
                <span className="font-sans text-sm font-black text-white">{t.common.locationValue}</span>
              </div>
              <div className="p-2 bg-white/5 border border-white/10 rounded-lg md:order-2 order-1">
                <MapPin className="w-4 h-4 text-industrial-orange" />
              </div>
            </motion.div>
          </div>

          {/* Central Slogan and Categories */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pointer-events-auto max-w-2xl"
            >
              <h1 className="font-sans font-black text-5xl md:text-7xl text-foreground mb-3 tracking-tight drop-shadow-2xl leading-tight">
                {t.hero.headlinePart1} <br />
                {t.hero.headlinePart2} <span className="text-industrial-orange">{t.hero.headlineAccent}</span>
              </h1>
              <p className="text-xs md:text-sm text-on-surface-variant/90 max-w-lg mb-5 leading-relaxed font-sans">
                {t.hero.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {t.hero.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="font-mono text-[10px] md:text-xs text-white bg-black/60 border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm shadow-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="https://www.upwork.com/freelancers/~01f5c09465b2df56f2?mp_source=share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-industrial-orange px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-500"
                >
                  {t.hero.upworkCta}
                </a>
                <a
                  href="https://freelancehunt.com/freelancer/topazonanton.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {t.hero.fhCta}
                </a>
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              onClick={() => {
                const gallery = document.getElementById('work-gallery');
                gallery?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="pointer-events-auto flex flex-col items-end gap-3.5 cursor-pointer hover:scale-105 transition-transform"
            >
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                {t.common.scrollToExplore}
              </span>
              <div className="w-[1.5px] h-16 bg-gradient-to-b from-industrial-orange to-transparent animate-pulse" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* MOTTO BANNER */}
      <section className="bg-surface-dark border-y border-white/5 py-14 flex items-center justify-center">
        <div className="text-center max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-industrial-orange animate-spin" />
            <span className="font-mono text-[10px] text-industrial-orange uppercase tracking-widest font-bold">
              {t.motto.badge}
            </span>
          </motion.div>
          <p className="font-sans text-xl md:text-2xl text-on-surface leading-relaxed font-light">
            {t.motto.text}
          </p>
        </div>
      </section>

      {/* PORTFOLIO GRID GALLERY */}
      <section id="work-gallery" className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <span className="font-mono text-xs text-industrial-orange uppercase tracking-widest font-bold">
              {t.portfolio.sectionLabel}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white font-sans mt-1">
              {t.portfolio.title}
            </h2>
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {([
              { id: 'all', label: t.portfolio.categories.all },
              { id: 'modeling', label: t.portfolio.categories.modeling },
              { id: 'texturing', label: t.portfolio.categories.texturing },
              { id: 'rendering', label: t.portfolio.categories.rendering }
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-lg border transition-all duration-300 cursor-pointer font-bold ${
                  activeCategory === tab.id
                    ? 'bg-industrial-orange border-industrial-orange text-foreground shadow-lg shadow-industrial-orange/15'
                    : 'bg-white/[0.02] border-white/5 text-on-surface-variant hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.article
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => setSelectedProject(project)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedProject(project);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={t.portfolio.viewDetails.replace('{{title}}', project.title)}
                className="group relative h-80 rounded-2xl overflow-hidden border border-white/10 bg-surface-card cursor-pointer shadow-xl hover:border-white/20 hover:shadow-2xl transition-all duration-300"
              >
                {/* Image */}
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <span className="bg-black/85 backdrop-blur-md px-2.5 py-1 rounded text-[9px] font-mono border border-white/10 text-industrial-orange uppercase tracking-wider font-bold">
                      {project.category}
                    </span>
                    <span className="text-on-surface-variant/40 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>

                  <div>
                    <h3 className="font-sans text-lg font-black text-white group-hover:text-industrial-orange transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mt-1.5">
                      {project.description}
                    </p>
                    
                    {/* Tiny stats info */}
                    <div className="flex gap-4 mt-3 pt-3 border-t border-white/5 font-mono text-[9px] text-on-surface-variant/70">
                      {project.specs.triangles && (
                        <span>{t.portfolio.stats.tris}: {project.specs.triangles.split(' ')[0]}</span>
                      )}
                      {project.specs.textures && (
                        <span>{t.portfolio.stats.maps}: {project.specs.textures}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* SECTION 2: BLENDER 3D MODELING */}
      <section 
        id="process"
        ref={processRef}
        className="py-24 border-t border-white/5 bg-gradient-to-b from-surface-dark to-background"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] w-fit">
              <Boxes className="w-3.5 h-3.5 text-industrial-orange" />
              <span className="font-mono text-[10px] text-industrial-orange uppercase tracking-widest font-bold">
                {t.processSection.label}
              </span>
            </div>

            <h2 className="font-sans text-4xl md:text-5xl font-black text-foreground tracking-tight leading-none">
              {t.processSection.title} <br />
              <span className="text-industrial-orange">{t.processSection.titleAccent}</span>
            </h2>

            <p className="text-base text-on-surface-variant leading-relaxed max-w-xl">
              {t.processSection.description}
            </p>

            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {t.processSection.tags.map((tag) => (
                <span key={tag} className="px-3.5 py-1.5 bg-white/[0.03] rounded-lg text-on-surface border border-white/5">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Interactive Compare Slider Column */}
          <div className="relative">
            <div className="absolute inset-0 bg-industrial-orange/5 blur-[120px] rounded-full pointer-events-none" />
            <CompareSlider 
              leftImage={PROJECTS[1].imageUrl}
              rightImage={PROJECTS[1].wireframeUrl || PROJECTS[1].imageUrl}
              leftLabel={t.processSection.compare.leftLabel}
              rightLabel={t.processSection.compare.rightLabel}
              title={t.processSection.compare.title}
              subtitle={t.processSection.compare.subtitle}
              isBlenderViewport={true}
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: V-RAY RENDERING */}
      <section 
        id="specs"
        ref={specsRef}
        className="py-24 border-t border-white/5 bg-background"
      >
        <div className="max-w-5xl mx-auto px-6 flex flex-col gap-12 items-center">
          
          {/* Top Text Block */}
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] w-fit">
              <Sparkles className="w-3.5 h-3.5 text-tertiary-accent" />
              <span className="font-mono text-[10px] text-tertiary-accent uppercase tracking-widest font-bold">
                {t.specsSection.label}
              </span>
            </div>

            <h2 className="font-sans text-4xl md:text-5xl font-black text-foreground tracking-tight leading-none">
              {t.specsSection.title} <span className="text-tertiary-accent">{t.specsSection.titleAccent}</span>
            </h2>

            <p className="text-base text-on-surface-variant leading-relaxed">
              {t.specsSection.description}
            </p>

            <div className="flex flex-wrap justify-center gap-2 font-mono text-xs">
              {t.specsSection.tags.map((tag) => (
                <span key={tag} className="px-3.5 py-1.5 bg-white/[0.03] rounded-lg text-on-surface border border-white/5">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Optics Simulator */}
          <div className="w-full relative">
            <div className="absolute inset-0 bg-tertiary-accent/5 blur-[120px] rounded-full pointer-events-none" />
            <RenderSimulator />
          </div>

        </div>
      </section>

      {/* SECTION 4: SUBSTANCE TEXTURING & PHOTOSHOP */}
      <section 
        id="studio"
        ref={studioRef}
        className="py-24 border-t border-white/5 bg-gradient-to-b from-background to-surface-dark relative"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-16">
          
          {/* Header block */}
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3">
            <h2 className="font-sans text-4xl md:text-5xl font-black text-foreground tracking-tight">
              {t.studioSection.title}
            </h2>
            <p className="text-base text-on-surface-variant leading-relaxed">
              {t.studioSection.description}
            </p>
          </div>

          {/* Interactive Material Channel Visualizer */}
          <MaterialInspector />

          {/* Sword Post-Processing Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-6">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] w-fit">
                <Sliders className="w-3.5 h-3.5 text-industrial-orange" />
                <span className="font-mono text-[10px] text-industrial-orange uppercase tracking-widest font-bold">
                  {t.studioSection.postProcessing.label}
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-white font-sans tracking-tight">
                {t.studioSection.postProcessing.title}
              </h3>

              <p className="text-sm text-on-surface-variant leading-relaxed">
                {t.studioSection.postProcessing.description}
              </p>

              <div className="flex flex-wrap gap-2.5 font-mono text-xs">
                {t.studioSection.postProcessing.tags.map((item) => (
                  <span 
                    key={item} 
                    className="border border-white/15 px-3 py-1.5 rounded-lg text-on-surface bg-white/[0.01]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzltYkHnrAlOlZWGD6HtnBxYsz2q8qugTz3C7BMjyz-xU8jGIgL6ilkAB7uRVXFsRX6VRCuTdg92kQrtyPSoM1LgeC3NTgGdjbviwscTd3XLMoqRN-WkDxYkFQzE1A33oyaNymRHcphnwobqfSDRa_hsU4yMfHJzw1b6GFNEzQK2si5lrw6f_-t0u1bQQfzPkBk70iivLOcqoaMfnMdJCcHD1ODL5JV9TLNk9c1SlWfirVt04FAJ-Ji_N7FfZlxiHaqI2U4YxUtvQ" 
                alt="Sword composition illustration"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SOFTWARE SUITE & CORE SKILL LEVELS */}
      <section className="py-24 border-t border-white/5 bg-surface-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs text-industrial-orange uppercase tracking-widest font-bold">
              {t.skillsSection.label}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white font-sans mt-1">
              {t.skillsSection.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCards.map((item, index) => {
              const isHardware = item.category === 'hardware';
              return (
                <div 
                  key={item.name}
                  className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between gap-5 relative hover:border-white/10 transition-colors"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className={`px-2.5 py-1 rounded text-[9px] font-mono border ${
                        isHardware 
                          ? 'border-printer-green/20 bg-printer-green/5 text-printer-green' 
                          : 'border-industrial-orange/20 bg-industrial-orange/5 text-industrial-orange'
                      }`}>
                        {item.category.toUpperCase()}
                      </span>
                      <span className="font-mono text-xs text-white/50">{t.skillsSection.level}{index + 1}</span>
                    </div>

                    <h4 className="font-sans font-bold text-lg text-white">
                      {item.key === 'blenderModeling' ? t.specs.blenderModeling.name : item.key === 'substancePainter' ? t.specs.substancePainter.name : item.key === 'vRay' ? t.specs.vRay.name : item.key === 'photoshop' ? t.specs.photoshop.name : item.key === 'inkscape' ? t.specs.inkscape.name : item.key === 'illustrator' ? t.specs.illustrator.name : item.key === 'vsCode' ? t.specs.vsCode.name : item.key === 'fSpy' ? t.specs.fSpy.name : item.key === 'cad' ? t.specs.cad.name : t.specs.bambu.name}
                    </h4>

                    <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                      {item.details}
                    </p>
                  </div>

                  {/* Level Slider Bar */}
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
                    <div 
                      className={`h-full rounded-full ${
                        isHardware ? 'bg-printer-green' : 'bg-industrial-orange'
                      }`}
                      style={{ width: `${item.level}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PIPELINE WORKFLOW STEPS */}
      <section className="py-24 border-t border-white/5 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs text-industrial-orange uppercase tracking-widest font-bold">
              {t.workflowSection.label}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white font-sans mt-1">
              {t.workflowSection.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workflowSteps.map((step) => (
              <div 
                key={step.number}
                className="relative p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] transition-colors group"
              >
                <div className="absolute top-4 right-6 text-4xl font-sans font-black text-white/5 group-hover:text-industrial-orange/10 transition-colors select-none">
                  {step.number}
                </div>
                <h3 className="font-sans font-bold text-lg text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO CORE SPECIALTIES & 3D SERVICES SECTION */}
      <section className="py-24 border-t border-white/5 bg-surface-dark/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-industrial-orange/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-xs text-industrial-orange uppercase tracking-widest font-bold">
              {t.servicesSection.label}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white font-sans mt-2 tracking-tight">
              {t.servicesSection.title} <span className="text-industrial-orange">{t.servicesSection.titleAccent}</span>
            </h2>
            <p className="text-sm md:text-base text-on-surface-variant mt-4 leading-relaxed">
              {t.servicesSection.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {seoServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <article 
                  key={index}
                  className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-industrial-orange/30 transition-all duration-300 flex flex-col justify-between gap-4 group hover:-translate-y-1"
                >
                  <div className="flex flex-col gap-3">
                    <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl w-fit group-hover:bg-industrial-orange/10 group-hover:border-industrial-orange/20 transition-colors">
                      <Icon className="w-5 h-5 text-industrial-orange" />
                    </div>
                    <div>
                      <h3 className="font-sans font-black text-white text-base tracking-tight group-hover:text-industrial-orange transition-colors">
                        {service.title}
                      </h3>
                      <p className="font-mono text-[9px] text-on-surface-variant/50 uppercase mt-0.5 tracking-wider">
                        {service.subTitle}
                      </p>
                    </div>
                    <p className="text-xs text-on-surface-variant/90 leading-relaxed font-sans">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                    {service.keywords.map((kw, kwIdx) => (
                      <span 
                        key={kwIdx}
                        className="font-mono text-[8px] md:text-[9px] bg-white/5 border border-white/5 px-2 py-0.5 rounded-md text-on-surface-variant group-hover:border-industrial-orange/10 group-hover:text-white transition-colors"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CONTACT CTA */}
      <section id="contact" ref={contactRef} className="py-24 max-w-5xl mx-auto px-6 relative z-10">
        <ContactForm />
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-surface-dark/90 py-12 px-6 md:px-12 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Logo & Description */}
          <div className="flex flex-col gap-4">
            <span className="font-sans text-2xl font-black text-white tracking-tighter flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-industrial-orange rounded-sm"></span>
              Blenderizm
            </span>
            <p className="text-on-surface-variant text-xs max-w-xs leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          {/* Links Column */}
          <div className="flex flex-col gap-2.5 font-mono text-xs">
            <h4 className="text-white font-bold tracking-wider mb-2 uppercase">{t.footer.linksTitle}</h4>
            <a href="https://www.behance.net/blenderizm" target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-industrial-orange transition-colors flex items-center gap-1.5">
              {t.nav.behance} <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://www.upwork.com/freelancers/~01f5c09465b2df56f2?mp_source=share" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-industrial-orange transition-colors">{t.nav.upwork}</a>
            <a href="https://freelancehunt.com/freelancer/topazonanton.html" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-industrial-orange transition-colors">{t.nav.freelancehunt}</a>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col gap-2.5 font-mono text-xs">
            <h4 className="text-white font-bold tracking-wider mb-2 uppercase">{t.footer.contactTitle}</h4>
            <span className="text-on-surface-variant flex items-center gap-2">
              <Mail className="w-4 h-4 text-industrial-orange" />
              {t.footer.email}
            </span>
            <span className="text-on-surface-variant flex items-center gap-2">
              <MapPin className="w-4 h-4 text-industrial-orange" />
              {t.footer.location}
            </span>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-on-surface-variant/70">
          <p>{t.footer.copyright}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-industrial-orange transition-colors">{t.footer.privacy}</a>
            <a href="#" className="hover:text-industrial-orange transition-colors">{t.footer.terms}</a>
          </div>
        </div>
      </footer>

        </main>

      {/* ALL MODALS */}
      <AnimatePresence>
        {/* Project Details Modal */}
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <ProjectDetailsModal 
              project={selectedProject} 
              onClose={() => setSelectedProject(null)} 
            />
          </motion.div>
        )}

        {/* Sticky Contact Form Modal */}
        {contactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setContactModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-dark border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setContactModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-white bg-white/5 hover:bg-white/10 rounded-full cursor-pointer transition-colors"
              >
                ✕
              </button>
              <ContactForm isModal onSuccessClose={() => setContactModalOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
