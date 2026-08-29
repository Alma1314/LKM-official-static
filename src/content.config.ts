// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishDate: z.coerce.date(),
    // 可选：用于兜底标识语言。实际语言优先由 collection entry 的路径前缀 (<lang>/) 推导。
    lang: z.string().optional().default("zh"),
  }),
});

export const collections = { docs };
