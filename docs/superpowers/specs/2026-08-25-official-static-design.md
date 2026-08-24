# LKM 独立静态官网 — 设计（最小可跑骨架）

> 日期：2026-08-25
> 状态：已确认、待实施
> 仓库：`C:\Project\LKM-Website\LKM-official-static`（新独立 git 仓库，未 push）

## 1. 背景与目标

当前官网前端在 `LKM-official-website`（Aspeto SSR 应用），含社区/后台/编辑器等大量非官网功能，
且靠 SSR 从后端拉取内容。本次把**公开官网**分离为**独立、纯静态**的 Astro 网站。

已澄清的决策：
1. **目标**：官网静态化，其余（社区/后台/编辑器）保持 SSR 在现有应用。
2. **形态**：全新独立 git 仓库，与 `LKM-service` 平级（非子目录、非 monorepo 内）。
3. **内容源**：本地 content collections（markdown + 数据文件），纯静态，不依赖后端 API。
4. **内容规模**：最小可跑骨架，先验证静态构建与托管可行，内容后逐步填充。
5. **技术栈/视觉**：复用现有官网设计语言（Tailwind v4 CSS-first + 现有 styles/布局组件）。

## 2. 范围

### 包含（本次骨架范围）
- 新建独立 Astro 静态项目（`output: static`）+ git init
- 精简 BaseLayout，Header/Footer 少量基础组件
- 本地 content collections（`docs` collection，zod schema）
- 2~3 篇占位 markdown + 首页/关于/服务骨架页
- 复用现有官网 `src/styles/*` 与 Tailwind v4 集成
- 验证：dev/build/preview、astrop check、纯静态产物无 node adapter

### 不包含（范围外，避免膨胀）
- 迁移社区/后台/编辑器/后端 SSR 取数
- 接入真实后端 API / 迁移现有 27 个 SSR 页面
- SEO/性能预算/CI 部署（留待内容填充阶段）

## 3. 新仓库骨架目录

```
LKM-official-static/
├── astro.config.ts          # output:static + tailwind + icon + mdx + sitemap
├── package.json / tsconfig.json
├── .gitignore
├── src/
│   ├── content.config.ts    # docs collection schema
│   ├── content/docs/        # 骨架 markdown
│   ├── layouts/BaseLayout.astro
│   ├── components/{Header,Footer}.astro ...
│   ├── data/config.yaml     # 站点元数据
│   ├── styles/              # 从官网提取
│   ├── pages/{index, about, services, 404}.astro
│   └── assets/ public/
└── docs/superpowers/specs/  # 本设计文档
```

## 4. 从现有官网提取映射

| 来源 (LKM-official-website)         | 去向（新骨架）        | 说明 |
| ----------------------------------- | --------------------- | ---- |
| `src/styles/*`                      | `src/styles/*`        | 设计语言核心，Tailwind v4 CSS-first |
| astro.config.ts 的 `@tailwindcss/vite` | astro.config.ts     | 复制 |
| `src/layouts/BaseLayout/OfficialLayout` | 精简为单 BaseLayout | 去除 SSR/locale 注入 |
| Header/Footer/导航组件              | `src/components/*`    | 只留静态链接版本 |
| i18n 词典 / astro-icon              | 按需                 | 骨架先用中文，图标机制后置 |

**不提取**：SSR 中间件、fetch-ssr、graphql client、pinia store、编辑器、社区/后台任何代码。

## 5. 静态数据与验证标准

内容集合：`docs` collection（zod），骨架内 2~3 篇 markdown，用 `getCollection()` 渲染，
验证 collections + SSG 管线。现有 `content.config.ts` 已核实为空的，新定义不受束缚。

验证 "可跑"：
1. `pnpm install` + `pnpm dev` 能打开首页
2. `pnpm build` 零报错，产出 `dist/client` 纯静态，无 `dist/server`、无 node adapter
3. `pnpm preview` 服务产物，首页 + 集合页可访问
4. `astro check` 通过（可选后置 CI）

## 6. 技术风险与注意

- Tailwind v4 走 CSS-first（无 tailwind.config），需核对 `variables.css`/`main.css` 的 `@import` 引用链，单独搬运时缺失引用会构建失败。
- astro-icon 需 iconify 集合 + 生成脚本，骨架阶段可简化为直接内联 `<svg>`。
- 现有 styles 为全局 CSS，搬运时按实际依赖裁剪，避免无关样式（如编辑器/preview 专用类）。

