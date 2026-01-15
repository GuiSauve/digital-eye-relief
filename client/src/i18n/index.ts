import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import de from './de.json';

export const translations = { en, es, fr, de } as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof en;

export const languages: Language[] = ['en', 'es', 'fr', 'de'];

export const languageNames: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
};

export const defaultLanguage: Language = 'en';

export function getTranslations(lang: Language) {
  return translations[lang] || translations.en;
}

export function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return defaultLanguage;
  
  const browserLang = navigator.language.split('-')[0];
  if (languages.includes(browserLang as Language)) {
    return browserLang as Language;
  }
  return defaultLanguage;
}

export function getLanguageFromPath(path: string): Language {
  const match = path.match(/^\/(en|es|fr|de)(\/|$)/);
  if (match && languages.includes(match[1] as Language)) {
    return match[1] as Language;
  }
  return defaultLanguage;
}

export function getPathWithLanguage(path: string, lang: Language): string {
  const cleanPath = path.replace(/^\/(en|es|fr|de)/, '') || '/';
  if (lang === defaultLanguage) {
    return cleanPath;
  }
  return `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
}
