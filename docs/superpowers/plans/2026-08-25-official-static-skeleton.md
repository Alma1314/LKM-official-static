# LKM 独立静态官网（最小可跑骨架）实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: 使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实施。步骤用 `- [ ]` 复选框跟踪。

**Goal:** 在 `C:\Project\LKM-Website\LKM-official-static` 新建一个独立、纯静态（SSG）的 Astro 官网最小骨架，复用现有官网设计语言的 token，页面内容来自本地 content collections，不依赖后端 API。

**Architecture:** 全新 Astro `output: static` 单包项目（非 monorepo）。从现有 `LKM-official-website` 定向提取样式 token（`variables.css` + `tailwind.css` 的 `@theme`），其余布局/组件/内容从零写成精简静态版。用 Astro content collections（zod schema）承载占位 markdown，`getCollection()` 渲染。构建产物为纯 `dist/client`，无 node adapter。

**Tech Stack:** Astro 7, Tailwind CSS v4（CSS-first, `@tailwindcss/vite`）, TypeScript, pnpm (>=11), Node (>=24)。

## Global Constraints

- 项目只用中文文案（骨架阶段不做 i18n 平铺，图标用内联 `<svg>`，不引入 astro-icon / iconify）
- `output: "static"`，**禁用** `@astrojs/node` adapter、禁用 SSR middleware、禁用任何 fetch 后端取数
- 依赖通过 pnpm 安装；需匹配 node >=24 与现有官网 main 依赖版本口径（astro 7、tailwindcss 4）
- 提交信息用中文；沿用仓库初始提交风格
- 所有页面最终能通过 `pnpm build` 产出纯静态目录，无 `dist/server`

---

### Task 1: 初始化 Astro 静态项目骨架

用 scaffolding 工具生成项目基础文件（astro.config.ts、tsconfig、package.json、src/ 结构），并与设计文档对齐。

**Files:**
- Create: `package.json`
- Create: `astro.config.ts`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `.npmrc`（pnpm 与 tailwind 许可）

**Interfaces:**
- Produces: 顶层配置与源目录骨架，后续任务的入口。
- 说明：本任务用 `npm create astro` 的非交互式模板太繁琐，改为**手写最小文件**，与设计文档目录对齐，避免脚手架附带 astro-icon/vercel 等多余集成。

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "lkm-official-static",
  "version": "0.1.0",
  "description": "LiKeMi Official Static Website",
  "license": "AGPL-3.0-or-later",
  "type": "module",
  "engines": {
    "node": ">=24.0.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "check": "astro check",
    "compile": "tsc --noEmit"
  },
  "dependencies": {
    "astro": "^7.1.3",
    "@astrojs/sitemap": "^3.7.3",
    "tailwindcss": "^4.3.3",
    "@tailwindcss/vite": "^4.3.3",
    "@tailwindcss/typography": "^0.5.20"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.9",
    "typescript": "^6.0.3"
  },
  "packageManager": "pnpm@11.21.0"
}
```

- [ ] **Step 2: 创建 astro.config.ts（纯静态 + tailwind + sitemap）**

```ts
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // 纯静态输出：构建产物只含静态 HTML/CSS/JS，不依赖 node adapter
  output: "static",
  site: "http://124.220.55.235",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/base",
  "compilerOptions": {
    "strictNullChecks": true,
    "allowJs": true,
    "paths": {
      "~/*": ["./src/*"],
      "~/layouts/*": ["./src/layouts/*"],
      "~/components/*": ["./src/components/*"]
    }
  },
  "include": [".astro/types.d.ts", "src/**/*"]
}
```

- [ ] **Step 4: 创建 .gitignore 和 .npmrc**

`.gitignore`:
```
node_modules/
dist/
.astro/
.env
.env.*
!.env.example
.DS_Store
*.local
```

`.npmrc`（tailwind v4 与原生依赖许可）:
```
node-linker=hoisted
```

- [ ] **Step 5: 创建基础 src 目录结构（空占位目录保留 .gitkeep）**

```bash
cd "C:\Project\LKM-Website\LKM-official-static"
mkdir -p src/pages src/layouts src/components src/styles src/content/docs src/data src/assets
touch src/pages/.gitkeep
```

- [ ] **Step 6: 安装依赖并验证基线构建**

运行（在 `LKM-official-static` 目录）：
```bash
pnpm install
pnpm build
```

> 预期：`astro build` 因 src/pages 无内容会提示"未发现页面"但**不致命**；若报 error 则先放置一个占位页（见 Task 6）再构建。此步只要 `pnpm install` 成功即可继续，页面在 Task 6 补齐。

- [ ] **Step 7: 提交**

```bash
git add .
git commit -m "chore: 初始化独立静态官网项目骨架（astro 7 + tailwind v4）"
```

---

### Task 2: 提取设计语言 token（variables.css + tailwind @theme）

从现有官网定向提取**样式 token 层**（不搬 daisyUI 组件），作为骨架视觉基础。复制 `variables.css` 全文，并从 `tailwind.css` 提取 `@theme` 核心（字体/圆角/颜色语义 token），去掉后端/编辑器专用部分。

**Files:**
- Create: `src/styles/variables.css`
- Create: `src/styles/tailwind.css`
- Modify: `src/styles/.gitkeep`（删除）

**Interfaces:**
- Consumes: Task 1 的 `src/styles/` 目录。
- Produces: `src/styles/tailwind.css`（含 `@import "tailwindcss"`、`@theme` token、`@custom-variant dark`），被 Task 3 的布局与 Task 6 的页面 import。
- 说明：现有 `tailwind.css` 860 行里含大量 daisyUI 复刻组件；骨架只保留 `@theme`/`@custom-variant`/排版基础，组件待内容填充阶段按需补充。

- [ ] **Step 1: 复制 variables.css 到骨架**

从 `C:\Project\LKM-Website\LKM-official-website\src\styles\variables.css` 复制完整内容到 `LKM-official-static\src\styles\variables.css`（194 行，浅/深主题 CSS 变量，无外部依赖，可直接复用）。

```bash
cp "C:\Project\LKM-Website\LKM-official-website\src\styles\variables.css" "C:\Project\LKM-Website\LKM-official-static\src\styles\variables.css"
```

- [ ] **Step 2: 创建剪裁版 tailwind.css**

从现有官网 `tailwind.css` 截取其 `@import`, `@plugin`, `@custom-variant`, 和 `@theme{...}` 块（截至 `--color-*`/`--font-*`/`--radius-*` token 结束处，不含 daisyUI 组件层）。写入骨架：

```css
@import "tailwindcss";

/* 确保 --hue 始终有初始值，防止 primary 色因 var(--hue) 未定义而失效 */
@property --hue {
  syntax: "<number>";
  initial-value: 250;
  inherits: true;
}

@plugin '@tailwindcss/typography';

/* 暗色模式变体 — 使用 :root.dark / [data-theme='dark'] */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* ── 字体系统 ── */
  --font-sans:
    "Noto Sans SC", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "Microsoft YaHei", sans-serif;
  --font-heading:
    "Noto Sans SC", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "Microsoft YaHei", sans-serif;
  --font-mono:
    "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    monospace;

  /* ── 圆角 Linear 阶梯 ── */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-pill: 9999px;
}
```

> 注：`--color-*` 语义 token 用到 variables.css 里的原始变量（`--base-100` 等），骨架在 Task 2 Step 1 已引入 variables.css，后续若加颜色工具类可补全 `@theme` 的颜色映射，本骨架范围先只到字体/圆角。

- [ ] **Step 3: 建立全局样式入口 main.css**

骨架统一从 `main.css` 引入 token 与 tailwind，供布局引用。

```css
@import "./variables.css";
@import "./tailwind.css";
```

- [ ] **Step 4: 验证构建仍可通过**

运行（在 `LKM-official-static`）：
```bash
pnpm build
```
> 若因无页面报错属预期；此步只验证 CSS 无语法错误。可在 Task 6 页面就绪后复核。

- [ ] **Step 5: 提交**

```bash
git add src/styles
git commit -m "feat: 提取复用现有官网样式 token（variables + tailwind @theme）"
```

---

### Task 3: 精简 BaseLayout 与 Header/Footer

写一个干净的 `BaseLayout.astro`（含 `<head>`、SEO 基础、导入 main.css），以及静态 `Header.astro`/`Footer.astro`。**不**从 features/shell 搬运（其依赖 i18n/图标/脚本太重）。

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/data/config.ts`（站点元数据常量）

**Interfaces:**
- Consumes: Task 2 的 `src/styles/main.css`。
- Produces:
  - `BaseLayout({ title, description })` — 页面包裹布局，接受 `title: string`、`description?: string` 两个 props。
  - `Header` / `Footer` — 无 props 组件，可被任何页面使用。
  - `src/data/config.ts` 导出 `SITE_NAME: string`。
  - 后续 Task 6 页面 `index.astro`/`about.astro`/`services.astro`/`404.astro` 都使用 `BaseLayout` 作为根布局。

- [ ] **Step 1: 创建站点元数据**

```ts
// src/data/config.ts
export const SITE_NAME = "理科迷";
export const SITE_TITLE = SITE_NAME;
export const SITE_DESCRIPTION =
  "理科迷 (LKM) — 创立于 2014 年的科技爱好者社区。让科学回归每一个人。";
```

- [ ] **Step 2: 创建 BaseLayout.astro**

```astro
---
import "../styles/main.css";
import Header from "~/components/Header.astro";
import Footer from "~/components/Footer.astro";

interface Props {
  title: string;
  description?: string;
}
const { title, description = "理科迷 (LKM) 独立官网" } = Astro.props;
---

<!doctype html>
<html lang="zh-cn" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    <meta name="generator" content={Astro.generator} />
  </head>
  <body class="min-h-screen flex flex-col bg-white text-[#1d1d1f]">
    <Header />
    <main class="flex-1 w-full max-w-[var(--page-width)] mx-auto px-6">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 3: 创建 Header.astro**

```astro
---
import { SITE_NAME } from "~/data/config";
const nav = [
  { href: "/", label: "首页" },
  { href: "/about", label: "关于" },
  { href: "/services", label: "服务" },
];
---

<header class="sticky top-0 z-40 border-b border-[#e0e0e0] bg-white/90 backdrop-blur">
  <nav class="w-full max-w-[var(--page-width)] mx-auto px-6 flex items-center justify-between h-14">
    <a href="/" class="font-heading font-bold text-[1.05rem]">{SITE_NAME}</a>
    <ul class="flex items-center gap-6">
      {nav.map((item) => (
        <li>
          <a
            href={item.href}
            class:list={[
              "text-sm transition-colors",
              Astro.url.pathname === item.href
                ? "text-[var(--primary)]"
                : "text-[#1d1d1f] hover:text-[var(--primary)]",
            ]}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
</header>
```

- [ ] **Step 4: 创建 Footer.astro**

```astro
---
import { SITE_NAME } from "~/data/config";
---

<footer class="border-t border-[#e0e0e0] py-8">
  <div class="w-full max-w-[var(--page-width)] mx-auto px-6 text-center text-sm text-[#7a7a7a]">
    <p>
      © {new Date().getFullYear()} {SITE_NAME} · 让科学回归每一个人
    </p>
  </div>
</footer>
```

- [ ] **Step 5: 提交**

```bash
git add src/layouts src/components src/data
git commit -m "feat: 添加精简 BaseLayout 与 Header/Footer 静态组件"
```

---

### Task 4: 定义 content collection（docs）

从零定义 `docs` collection（zod schema），替换空的默认 `content.config.ts`。此 collection 承载占位 markdown，供列表/详情页与首页使用。

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/docs/_desc.md`（示意，可空或含 frontmatter 占位示例）

**Interfaces:**
- Consumes: Task 1 的 tsconfig（`content.config.ts` 在 include 中）。
- Produces:
  - `docs` collection，entry frontmatter 字段：`title: string`、`description?: string`、`publishDate: Date`。
  - 后续 Task 6 的 `index.astro`（首页展示最近 docs）与任意详情页通过 `import { getCollection } from "astro:content"` 读取。

- [ ] **Step 1: 创建 content.config.ts**

```ts
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishDate: z.coerce.date(),
  }),
});

export const collections = { docs };
```

- [ ] **Step 2: 创建占位文档**

`src/content/docs/intro.md`：
```markdown
---
title: 欢迎使用 LKM
description: 理科迷独立静态官网的第一篇文章
publishDate: 2026-08-25
---

这里是 **LKM 独立静态官网**的最小骨架内容。本页验证了 Astro content collections
的本地 markdown → 静态 HTML 链路。
```

- [ ] **Step 3: 类型与构建验证**

运行：
```bash
pnpm exec astro sync
pnpm exec astro check
```
预期：无类型错误，说明 `docs` collection schema 与 markdown frontmatter 对齐。

> 注：`astro check` 若因页面缺失报"无页面"错误，可先继续（Task 6 补齐页面后再跑完整 check）。

- [ ] **Step 4: 提交**

```bash
git add src/content.config.ts src/content
git commit -m "feat: 定义 docs content collection（zod schema + 占位文档）"
```

---

### Task 5: 首页与占位业务页

创建首页（展示最近 docs 列表）、`about.astro`、`services.astro`、`404.astro`，全部套用 BaseLayout。首页用 `getCollection("docs")` 渲染列表，验证 SSG 取数链路。

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/services.astro`
- Create: `src/pages/404.astro`

**Interfaces:**
- Consumes: Task 3 `BaseLayout(title, description)` / `Header` / `Footer`；Task 4 `docs` collection。
- Produces: 可路由的 `index`、`/about`、`/services`、404 页面（纯静态）。

- [ ] **Step 1: 创建首页 index.astro**

```astro
---
import BaseLayout from "~/layouts/BaseLayout.astro";
import { getCollection } from "astro:content";
import { SITE_DESCRIPTION } from "~/data/config";

const docs = (await getCollection("docs")).sort(
  (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
);
---

<BaseLayout title="首页" description={SITE_DESCRIPTION}>
  <section class="py-16">
    <h1 class="font-heading text-4xl font-bold mb-4">欢迎来到理科迷 (LKM)</h1>
    <p class="text-lg text-[#7a7a7a] max-w-2xl">
      {SITE_DESCRIPTION}
    </p>
  </section>

  <section class="py-8">
    <h2 class="font-heading text-2xl font-semibold mb-6">最新文章</h2>
    <ul class="grid gap-4 md:grid-cols-2">
      {
        docs.map((post) => (
          <li class="border border-[#e0e0e0] rounded-lg p-5 transition hover:border-[var(--primary)]">
            <a href={`/docs/${post.id}`} class="block">
              <h3 class="font-heading text-lg font-semibold mb-1">
                {post.data.title}
              </h3>
              {post.data.description && (
                <p class="text-sm text-[#7a7a7a]">{post.data.description}</p>
              )}
            </a>
          </li>
        ))
      }
    </ul>
  </section>
</BaseLayout>
```

- [ ] **Step 2: 创建 about.astro / services.astro / 404.astro**

`src/pages/about.astro`：
```astro
---
import BaseLayout from "~/layouts/BaseLayout.astro";
---
<BaseLayout title="关于" description="关于理科迷社区">
  <section class="py-16 max-w-2xl">
    <h1 class="font-heading text-3xl font-bold mb-4">关于理科迷</h1>
    <p class="text-[#7a7a7a]">
      理科迷 (LKM) 创立于 2014 年，是科技爱好者社区，覆盖数学、物理、化学、生物、信息技术等学科。
    </p>
  </section>
</BaseLayout>
```

`src/pages/services.astro`：
```astro
---
import BaseLayout from "~/layouts/BaseLayout.astro";
---
<BaseLayout title="服务" description="LKM 提供的服务">
  <section class="py-16 max-w-2xl">
    <h1 class="font-heading text-3xl font-bold mb-4">服务</h1>
    <p class="text-[#7a7a7a]">
      骨架占位页。服务介绍内容将在后续阶段填充。
    </p>
  </section>
</BaseLayout>
```

`src/pages/404.astro`：
```astro
---
import BaseLayout from "~/layouts/BaseLayout.astro";
---
<BaseLayout title="页面未找到">
  <section class="py-24 text-center">
    <h1 class="font-heading text-2xl font-bold mb-4">404</h1>
    <p class="text-[#7a7a7a]">你访问的页面不存在。</p>
    <a href="/" class="mt-4 inline-block text-[var(--primary)]">返回首页</a>
  </section>
</BaseLayout>
```

- [ ] **Step 3: 添加 docs 详情页（可选，验证 collection 路由）**

若骨架需要展示单篇文档，创建 `src/pages/docs/[...slug].astro`：
```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "~/layouts/BaseLayout.astro";

export async function getStaticPaths() {
  const docs = await getCollection("docs");
  return docs.map((doc) => ({ params: { slug: doc.id }, props: { doc } }));
}

const { doc } = Astro.props;
const { Content } = await doc.render();
---
<BaseLayout title={doc.data.title} description={doc.data.description}>
  <article class="py-12 max-w-2xl">
    <h1 class="font-heading text-3xl font-bold mb-2">{doc.data.title}</h1>
    <p class="text-sm text-[#7a7a7a] mb-6">
      {doc.data.publishDate.toLocaleDateString("zh-CN")}
    </p>
    <div class="prose prose-neutral max-w-none">
      <Content />
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 4: 构建并预览验证**

运行：
```bash
pnpm build
pnpm preview
```
验证：
- 构建零报错，`dist/` 下**无** `dist/server`（纯静态）
- 本地打开 `http://localhost:4321` 首页正常，Header/Footer 渲染
- `/about`、`/services`、`/docs/intro` 可访问
- 返回 404 页正常

- [ ] **Step 5: 提交**

```bash
git add src/pages
git commit -m "feat: 添加首页/about/服务/404 与 docs 详情页，接入 content collection"
```

---

### Task 6: 完整验证与 CI（check 门禁）

骨架收尾：跑完整 `astro check` + `build` 双门禁，确认纯静态产物，加一条最简 GitHub Actions 只跑构建（可选后置到内容填充阶段）。

**Files:**
- Modify: `package.json`（`check` 脚本已存在）
- Create: `.github/workflows/static-build.yml`

**Interfaces:**
- Consumes: 全部前序任务的产物。
- Produces: 可通过的 check/build 结果与可选 CI。

- [ ] **Step 1: 运行完整 check**

```bash
pnpm check
```
预期：0 error、0 warning。

- [ ] **Step 2: 复核纯静态产物**

```bash
pnpm build
ls dist        # 应只显示 client 等静态产物，无 server/ 目录
```
若出现 `dist/server` 或 node adapter 痕迹，回到 astro.config.ts 确认 `output` 未设 `node({mode})`。

- [ ] **Step 3: 创建最简 CI（可选）**

`.github/workflows/static-build.yml`：
```yaml
name: Static Build

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 11.21.0
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
```

- [ ] **Step 4: 最终提交**

```bash
git add .
git commit -m "chore: 骨架收尾，补 CI 静态构建"
```

- [ ] **Step 5: 汇报验证结果**

向用户汇报：
- `dist/` 纯静态产物确认
- 页面前往 `/`、`/about`、`/services`、`/docs/intro` 的访问结果
- check/build 通过情况
- 遗留待后续填充项（服务/新闻/教程等板块的具体内容与 daisyUI 组件样式）

---

## Self-Review 记录

- **Spec 覆盖**：目标(独立仓库+静态)→Task1；复用设计语言(提取 token)→Task2；精简布局→Task3；本地 content collections→Task4；最小可跑骨架页→Task5；验证静态产物→Task6。全部覆盖。
- **占位符扫描**：页面内容用 `SITE_DESCRIPTION`/中文占位文案，均为有实际值的实现代码，非 TBD。
- **类型一致性**：`BaseLayout` 的 props 签名（`title: string`, `description?: string`）在 Task3 定义、Task5 使用一致；`getCollection("docs")` 与 `doc.render()`/`doc.id`/`doc.data` 与 Task4 schema 一致；`config.ts` 导出的 `SITE_NAME`/`SITE_DESCRIPTION` 在 Header/首页一致引用。
- **风险说明**：在 Task2 Step 中说明剪裁了 daisyUI 组件层，避免骨架膨胀；`astro check` 在页面缺失时可能先报错，已在 Task4/Task6 提醒先做后续任务。`$page-width` 等变量在 BaseLayout/Header/Footer 中被引用，来自 variables.css 中已定义（`--page-width:1280px`）。
