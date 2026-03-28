/**
 * 多语言模块 - 初始化入口
 * 独立模块：仅负责 i18next 配置与资源注册，不依赖业务路由/状态
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LOCALE, type LocaleCode } from './types';

const SUPPORTED_LOCALES: LocaleCode[] = [
  'zh-CN', 'zh-TW', 'en', 'ar', 'bn', 'de', 'es', 'fa', 'fr', 'he', 'hi',
  'id', 'it', 'ja', 'ko', 'ms', 'nl', 'pl', 'pt', 'pt-BR', 'ru', 'sw',
  'ta', 'th', 'fil', 'tr', 'uk', 'ur', 'vi',
];

function getStoredLocale(): LocaleCode | null {
  try {
    const raw = typeof localStorage !== 'undefined' && localStorage.getItem('kunqiong-locale');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const locale = parsed?.state?.locale;
    return locale && SUPPORTED_LOCALES.includes(locale) ? locale : null;
  } catch {
    return null;
  }
}

import zhCN from './locales/zh-CN.json';
import en from './locales/en.json';
import zhTW from './locales/zh-TW.json';
import ar from './locales/ar.json';
import bn from './locales/bn.json';
import de from './locales/de.json';
import es from './locales/es.json';
import fa from './locales/fa.json';
import fr from './locales/fr.json';
import he from './locales/he.json';
import hi from './locales/hi.json';
import id from './locales/id.json';
import it from './locales/it.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import ms from './locales/ms.json';
import nl from './locales/nl.json';
import pl from './locales/pl.json';
import pt from './locales/pt.json';
import ptBR from './locales/pt-BR.json';
import ru from './locales/ru.json';
import sw from './locales/sw.json';
import ta from './locales/ta.json';
import th from './locales/th.json';
import fil from './locales/fil.json';
import tr from './locales/tr.json';
import uk from './locales/uk.json';
import ur from './locales/ur.json';
import vi from './locales/vi.json';

const resources: Record<string, { translation: Record<string, unknown> }> = {
  'zh-CN': { translation: zhCN as Record<string, unknown> },
  en: { translation: en as Record<string, unknown> },
  'zh-TW': { translation: zhTW as Record<string, unknown> },
  ar: { translation: ar as Record<string, unknown> },
  bn: { translation: bn as Record<string, unknown> },
  de: { translation: de as Record<string, unknown> },
  es: { translation: es as Record<string, unknown> },
  fa: { translation: fa as Record<string, unknown> },
  fr: { translation: fr as Record<string, unknown> },
  he: { translation: he as Record<string, unknown> },
  hi: { translation: hi as Record<string, unknown> },
  id: { translation: id as Record<string, unknown> },
  it: { translation: it as Record<string, unknown> },
  ja: { translation: ja as Record<string, unknown> },
  ko: { translation: ko as Record<string, unknown> },
  ms: { translation: ms as Record<string, unknown> },
  nl: { translation: nl as Record<string, unknown> },
  pl: { translation: pl as Record<string, unknown> },
  pt: { translation: pt as Record<string, unknown> },
  'pt-BR': { translation: ptBR as Record<string, unknown> },
  ru: { translation: ru as Record<string, unknown> },
  sw: { translation: sw as Record<string, unknown> },
  ta: { translation: ta as Record<string, unknown> },
  th: { translation: th as Record<string, unknown> },
  fil: { translation: fil as Record<string, unknown> },
  tr: { translation: tr as Record<string, unknown> },
  uk: { translation: uk as Record<string, unknown> },
  ur: { translation: ur as Record<string, unknown> },
  vi: { translation: vi as Record<string, unknown> },
};

const initialLng = getStoredLocale() || DEFAULT_LOCALE;

i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  // 禁止运行时自动回退英文，缺失项应在构建阶段直接补齐或报错
  fallbackLng: false,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
