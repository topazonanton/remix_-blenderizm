import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import ukTranslations from '../locales/uk.json';
import enTranslations from '../locales/en.json';

export type LocaleCode = 'uk' | 'en';

type Translation = typeof ukTranslations;

interface LocaleContextValue {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  t: Translation;
}

const translations: Record<LocaleCode, Translation> = {
  uk: ukTranslations as Translation,
  en: enTranslations as Translation,
};

const STORAGE_KEY = 'blenderizm-language';
const BASE_URL = 'https://topazonanton.github.io/blenderizm';

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function getInitialLocale(): LocaleCode {
  if (typeof window === 'undefined') {
    return 'uk';
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'uk' || stored === 'en') {
    return stored;
  }

  return 'uk';
}

function setMetaTag(attribute: string, value: string, content: string) {
  if (typeof document === 'undefined') {
    return;
  }

  let element = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
  element.setAttribute('content', content);
}

function setLinkTag(rel: string, attribute: string, value: string, href: string) {
  if (typeof document === 'undefined') {
    return;
  }

  let element = document.querySelector(`link[rel="${rel}"][${attribute}="${value}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }
  element.setAttribute('rel', rel);
  element.setAttribute(attribute, value);
  element.setAttribute('href', href);
}

export function applyLocale(locale: LocaleCode) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const currentTranslations = translations[locale];
  document.documentElement.lang = locale;

  const title = document.querySelector('title');
  if (title) {
    title.textContent = currentTranslations.meta.title;
  }

  setMetaTag('name', 'description', currentTranslations.meta.description);
  setMetaTag('name', 'keywords', currentTranslations.meta.keywords);
  setMetaTag('property', 'og:title', currentTranslations.meta.ogTitle);
  setMetaTag('property', 'og:description', currentTranslations.meta.ogDescription);
  setMetaTag('property', 'twitter:title', currentTranslations.meta.twitterTitle);
  setMetaTag('property', 'twitter:description', currentTranslations.meta.twitterDescription);

  const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  const canonicalUrl = `${BASE_URL}/?lang=${locale}`;
  if (canonical) {
    canonical.setAttribute('href', canonicalUrl);
  } else {
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', canonicalUrl);
    document.head.appendChild(link);
  }

  setLinkTag('alternate', 'hreflang', 'uk', `${BASE_URL}/?lang=uk`);
  setLinkTag('alternate', 'hreflang', 'en', `${BASE_URL}/?lang=en`);

  const ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
  if (ogUrl) {
    ogUrl.setAttribute('content', canonicalUrl);
  } else {
    const link = document.createElement('meta');
    link.setAttribute('property', 'og:url');
    link.setAttribute('content', canonicalUrl);
    document.head.appendChild(link);
  }

  const twitterImage = document.querySelector('meta[property="twitter:image"]') as HTMLMetaElement | null;
  if (twitterImage) {
    twitterImage.setAttribute('content', 'https://topazonanton.github.io/blenderizm/assets/smart_planter_render_1782671885923-Bj4w0wLM.jpg');
  }

  const ogImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;
  if (ogImage) {
    ogImage.setAttribute('content', 'https://topazonanton.github.io/blenderizm/assets/smart_planter_render_1782671885923-Bj4w0wLM.jpg');
  }

  window.history.replaceState({}, '', `/?lang=${locale}`);
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(() => getInitialLocale());

  const setLocale = useCallback((nextLocale: LocaleCode) => {
    setLocaleState(nextLocale);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextLocale);
      applyLocale(nextLocale);
    }
  }, []);

  useEffect(() => {
    applyLocale(locale);
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    setLocale,
    t: translations[locale],
  }), [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useTranslation() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useTranslation must be used inside LocaleProvider');
  }
  return context;
}
