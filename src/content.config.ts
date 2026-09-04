// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishDate: z.coerce.date(),
    // 文章分类 / 标签：/news 文章列表按 category === "news" 过滤展示。
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    // 文章配图（外部图源 URL；用于列表封面色卡与详情页 hero。）
    image: z.string().url().optional(),
    // 可选：用于兜底标识语言。实际语言优先由 collection entry 的路径前缀 (<lang>/) 推导。
    lang: z.string().optional().default("zh"),
  }),
});

export const collections = { docs };
