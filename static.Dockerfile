# LKM 纯静态官网 Dockerfile: node 构建 → nginx 起静态文件
# 独立端口对外访问(compose 里 ${LKM_STATIC_PORT:-8082}:80),
# 不与 SSR 前端(4321) 或主 nginx(80/443) 冲突。

FROM node:24-alpine AS builder
WORKDIR /app
# pnpm 11 需要 workspace allowBuilds(esbuild) 与 .npmrc(node-linker=hoisted) 才能装依赖
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
# 全部源码与配置(src 内含 components/content/data/layouts/pages/styles)
COPY src/ ./src/
COPY astro.config.ts tsconfig.json ./
RUN corepack enable && pnpm install --frozen-lockfile && pnpm run build

# 仅取构建产物, 用 nginx 直接 serve 静态文件
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
