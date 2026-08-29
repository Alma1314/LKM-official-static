// src/data/en/team-data.ts —— 英文版团队数据（阶段一占位；人名/头像键不翻译）
import type { TeamData } from "../team-types";
// 占位：阶段一导出空结构，阶段二按 team-data 结构（memberLists/subGroupMaps）逐组补英文（人名/quote/dream 的英文或拼音）
export const teamData = {
  memberLists: { founderMembers: [], generalMembers: [], eventsMembers: [], newsMembers: [], advisorMembers: [], techMembers: [], alumniMembers: [] },
  subGroupMaps: { affairsSubGroups: {}, newsSubGroups: {}, professionalSubGroups: {}, projectSubGroups: {} },
} as const satisfies TeamData;
