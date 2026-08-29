// src/data/en/communities.ts —— 英文版社群分类（阶段一占位；群号/群名不可翻译）
export interface Community {
  name: string;
  qqGroup?: string;
  desc?: string;
  isQQChannel?: boolean;
}
export interface CommunityCategory {
  label: string;
  intro?: string;
  groups: Community[];
}
// 占位：label/intro 用英文简短占位，name/qqGroup 照抄中文（群号不可翻译）
export const communityCategories: CommunityCategory[] = []; // 阶段一先留空结构，阶段二按中文源 8 类成型
export const communityNote = "Placeholder EN note (stage 2). (placeholder)";
