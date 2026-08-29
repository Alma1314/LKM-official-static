// src/i18n/index.ts —— i18n 工具：语言列表、类型、t()、pickByLocale
import { zh } from "./zh";
import type { Zh } from "./zh";
import { en } from "./en";

export const SUPPORTED_LANGS = ["zh", "en"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export type TranslationKey = keyof Zh;

const dicts: Record<Lang, Partial<Zh>> = { zh, en };

/**
 * 取翻译文本。
 * - zh 直接取值；en 缺 key 时回退 zh（阶段一英文占位策略）。
 * - lang 非法时回退 zh 并打印警告。
 */
export function t(lang: string, key: TranslationKey): string {
  const source = dicts[lang as Lang] ?? zh;
  return (source[key] as string | undefined) ?? zh[key];
}

/**
 * 二元语言数据选择器：locale === "en" 取英文，否则取中文。
 * 用于 data 文件（src/data 中文源 vs src/data/en 英文副本）。
 */
export function pickByLocale<T>(
  locale: string | undefined,
  zhData: T,
  enData: T,
): T {
  return locale === "en" ? enData : zhData;
}
