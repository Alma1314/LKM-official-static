/**
 * 一次性：同步团队页成员头像到静态站并 ASCII 化命名。
 *
 * 读 src/data/team-members.json 收集所有 avatarKey，把对应 webp 从
 * LKM-service/static/avatars/ 复制到 public/images/avatars/，命名 t01..tNN.webp，
 * 生成 src/data/avatar-map.json { avatarKey: "tNN.webp" }。
 *
 * 用法：node scripts/sync-team-avatars.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC_AVATARS = path.join(
  ROOT,
  "..",
  "LKM-service",
  "static",
  "avatars",
);
const DST_DIR = path.join(ROOT, "public", "images", "avatars");
const DATA_FILE = path.join(ROOT, "src", "data", "team-members.json");
const MAP_FILE = path.join(ROOT, "src", "data", "avatar-map.json");

const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

// 收集 avatarKey（memberLists: 数组；subGroupMaps: key→group 对象）
const keys = new Set();
for (const lst of Object.values(data.memberLists ?? {})) {
  for (const m of lst) if (m?.avatarKey) keys.add(m.avatarKey);
}
for (const gs of Object.values(data.subGroupMaps ?? {})) {
  for (const g of Object.values(gs ?? {})) {
    for (const m of g?.members ?? []) if (m?.avatarKey) keys.add(m.avatarKey);
  }
}

fs.mkdirSync(DST_DIR, { recursive: true });

// avatarKey（如 "七月千寻.jpg"）→ 源 webp 名（"七月千寻.webp"）
function baseName(key) {
  return key.replace(/\.(jpe?g|png|webp)$/i, "");
}

let idx = 0;
const map = {};
const missing = [];
const sorted = [...keys].filter(Boolean).sort();
for (const key of sorted) {
  const srcName = `${baseName(key)}.webp`;
  const src = path.join(SRC_AVATARS, srcName);
  if (!fs.existsSync(src)) {
    missing.push(srcName);
    continue;
  }
  idx += 1;
  const dstName = `t${String(idx).padStart(2, "0")}.webp`;
  fs.copyFileSync(src, path.join(DST_DIR, dstName));
  map[key] = dstName;
}

fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2));
console.log(`copied ${idx} avatars → public/images/avatars/`);
console.log(`missing sources (${missing.length}):`, missing.join(", ") || "-");
console.log(`avatar-map.json written with ${Object.keys(map).length} entries`);
