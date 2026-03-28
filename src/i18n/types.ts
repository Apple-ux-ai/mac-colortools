/**
 * 多语言模块 - 类型与常量
 * 与业务解耦，仅在本模块内使用
 */

/** 支持的 locale 码，与语言列表一一对应 */
export type LocaleCode =
  | 'zh-CN'
  | 'zh-TW'
  | 'en'
  | 'ar'
  | 'bn'
  | 'de'
  | 'es'
  | 'fa'
  | 'fr'
  | 'he'
  | 'hi'
  | 'id'
  | 'it'
  | 'ja'
  | 'ko'
  | 'ms'
  | 'nl'
  | 'pl'
  | 'pt'
  | 'pt-BR'
  | 'ru'
  | 'sw'
  | 'ta'
  | 'th'
  | 'fil'
  | 'tr'
  | 'uk'
  | 'ur'
  | 'vi';

/** 语言显示名（用于下拉列表），key 为 LocaleCode */
export const LANGUAGE_NAMES: Record<LocaleCode, string> = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  en: 'English',
  ar: 'العربية',
  bn: 'বাংলা',
  de: 'Deutsch',
  es: 'Español',
  fa: 'فارسی',
  fr: 'Français',
  he: 'עברית',
  hi: 'हिन्दी',
  id: 'Bahasa Indonesia',
  it: 'Italiano',
  ja: '日本語',
  ko: '한국어',
  ms: 'Bahasa Melayu',
  nl: 'Nederlands',
  pl: 'Polski',
  pt: 'Português',
  'pt-BR': 'Português (Brasil)',
  ru: 'Русский',
  sw: 'Kiswahili',
  ta: 'தமிழ்',
  th: 'ไทย',
  fil: 'Filipino',
  tr: 'Türkçe',
  uk: 'Українська',
  ur: 'اردو',
  vi: 'Tiếng Việt',
};

export const SUPPORTED_LOCALES: LocaleCode[] = [
  'zh-CN', 'zh-TW', 'en', 'ar', 'bn', 'de', 'es', 'fa', 'fr', 'he', 'hi',
  'id', 'it', 'ja', 'ko', 'ms', 'nl', 'pl', 'pt', 'pt-BR', 'ru', 'sw',
  'ta', 'th', 'fil', 'tr', 'uk', 'ur', 'vi',
];

export const DEFAULT_LOCALE: LocaleCode = 'zh-CN';
