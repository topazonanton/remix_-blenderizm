import React, { useState, useEffect } from 'react';
import { Menu, X, Mail, Layers, Compass, Cpu, Briefcase } from 'lucide-react';
import { useTranslation } from '../i18n';

interface HeaderProps {
  onContactClick: () => void;
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export default function Header({ onContactClick, activeSection, onSectionChange }: HeaderProps) {
  const { locale, setLocale, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'portfolio', label: t.nav.portfolio, icon: Compass, href: 'https://www.behance.net/blenderizm' },
    { id: 'process', label: t.nav.process, icon: Layers },
    { id: 'specs', label: t.nav.specs, icon: Cpu },
    { id: 'contact', label: t.nav.contact, icon: Mail },
  ];

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    onSectionChange(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header>
        <nav
          className={`z-50 fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl rounded-full border border-white/10 shadow-2xl flex justify-between items-center px-6 md:px-8 py-3.5 transition-all duration-300 ${
            scrolled 
              ? 'bg-black/85 backdrop-blur-xl border-white/15' 
              : 'bg-black/40 backdrop-blur-md border-white/10'
          }`}
        >
        {/* Logo */}
        <button 
          onClick={() => handleNavClick('portfolio')}
          className="font-sans text-xl md:text-2xl font-black text-on-surface tracking-tighter hover:text-industrial-orange transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="w-2.5 h-2.5 bg-industrial-orange rounded-sm animate-pulse"></span>
          Blenderizm
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 lg:gap-8 items-center font-mono text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            if (item.href) {
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ease-in-out cursor-pointer text-on-surface-variant hover:text-on-surface hover:bg-white/[0.03]"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </a>
                </li>
              );
            }
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ease-in-out cursor-pointer ${
                    isActive
                      ? 'text-industrial-orange font-bold bg-white/[0.06] border border-white/5'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* CTA button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setLocale(locale === 'uk' ? 'en' : 'uk')}
            className="text-xs font-mono uppercase tracking-[0.2em] text-on-surface-variant border border-white/10 bg-white/[0.03] px-3 py-2 rounded-full hover:text-white transition-colors"
          >
            {locale === 'uk' ? 'EN' : 'UA'}
          </button>
          <button
            onClick={onContactClick}
            className="bg-industrial-orange text-foreground font-sans text-sm font-bold px-5 py-2 rounded-full hover:bg-primary-accent hover:shadow-[0_0_20px_rgba(204,120,92,0.35)] transition-all duration-300 ease-in-out hover:scale-[1.03] active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            {t.common.hireMe}
          </button>

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-on-surface hover:text-industrial-orange p-1.5 bg-white/5 rounded-full border border-white/10 cursor-pointer"
            aria-label={t.nav.toggleMenu}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col justify-center px-8 transition-all duration-300">
          <div className="flex flex-col gap-6 text-center">
            <h2 className="text-2xl font-black text-on-surface tracking-widest uppercase mb-4">
              Blenderizm
            </h2>
            <div className="w-12 h-0.5 bg-industrial-orange mx-auto mb-6"></div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              if (item.href) {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-3 text-xl font-mono py-3.5 px-6 rounded-xl border border-white/5 transition-all duration-300 text-on-surface-variant hover:text-on-surface hover:bg-white/[0.03]"
                  >
                    <Icon className="w-5 h-5 text-industrial-orange" />
                    {item.label}
                  </a>
                );
              }
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-center gap-3 text-xl font-mono py-3.5 px-6 rounded-xl border border-white/5 transition-all duration-300 ${
                    isActive
                      ? 'text-industrial-orange bg-white/[0.07] font-semibold border-industrial-orange/20 shadow-[0_0_15px_rgba(204,120,92,0.1)]'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className="w-5 h-5 text-industrial-orange" />
                  {item.label}
                </button>
              );
            })}
            
            <button
              onClick={() => {
                setIsOpen(false);
                onContactClick();
              }}
              className="mt-8 bg-industrial-orange text-foreground font-sans text-base font-bold py-4 rounded-xl hover:bg-primary-accent transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(204,120,92,0.3)]"
            >
              <Mail className="w-5 h-5" />
              {t.common.getInTouch}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
