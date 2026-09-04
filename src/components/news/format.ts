/**
 * 文章列表/详情的日期与阅读时长格式化。（离线确定性，不依赖宿主时区/ICU。）
 */

/** 中文：2026 年 8 月 1 日 */
const EN_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** zh: "2026年8月1日"/"2026 年 8 月 1 日" 依 style 而定 */
export function formatDate(d: Date, lang: "zh" | "en"): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  if (lang === "en") {
    return `${EN_MONTHS[m - 1]} ${day}, ${y}`; // August 1, 2026
  }
  return `${y} 年 ${m} 月 ${day} 日`;
}

/**
 * 粗略阅读时长（分钟）。中文按字符 /350、英文按单词 /200，向下取整，至少 1。
 */
export function readingMinutes(markdown: string): number {
  const chars = (markdown.match(/[\u3400-\u9fff\u3040-\u30ff]/g) ?? []).length;
  const words =
    (markdown.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) ?? []).length || 0;
  return Math.max(1, Math.round(chars / 350 + words / 220));
}

/** 由标题得到稳定色相（无封面图时的确定性配色）。 */
function hueFromTitle(title: string): number {
  let h = 0;
  for (let i = 0; i < title.length; i++) {
    h = (h * 31 + title.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

/**
 * 无真实封面时的渐变“占位封面色块”：主 + 补色两档 HSL。
 * 同一标题永远同色（列表刷新稳定），不同文章互相错开。
 */
export function coverGradient(title: string): string {
  const base = hueFromTitle(title);
  return `linear-gradient(135deg, hsl(${base} 74% 55%), hsl(${(base + 48) % 360} 68% 47%))`;
}
