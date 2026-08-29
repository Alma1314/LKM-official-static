// src/i18n/paths.ts —— [lang] 动态段静态路径 + 语言前缀 URL 辅助
import type { GetStaticPaths } from "astro";
import { SUPPORTED_LANGS } from "./index";

/** [lang] 段静态路径：为每个语言生成一条静态路由，让 output:static 可构建。 */
export const getStaticPathsForLang: GetStaticPaths = () =>
  SUPPORTED_LANGS.map((lang) => ({ params: { lang } }));

/**
 * 把内部站点路径(如 /team)转为当前语言带前缀的绝对路径(如 /zh/team)。
 * 锚点 / 外链 / 静态资源(RSS、/images、/_astro 构建资源)原样返回，不加前缀。
 */
export function langUrl(lang: string, path: string): string {
  if (
    !path ||
    path.startsWith("http") ||
    path.startsWith("#") ||
    path.startsWith("/images") ||
    path.startsWith("/_astro")
  ) {
    return path; // 外链、锚点、资源路径不加前缀
  }
  const p = path === "/" ? "" : path;
  return `/${lang}${p}`;
}
