// 团队数据静态类型（对应 src/data/team-data.ts 的结构）。
// data 用 as const satisfies 校验，页面引用时获得字面量 key 的补全与校验。

export interface TeamMember {
  name?: string;
  role?: string;
  avatarKey?: string;
  desc?: string;
  dream?: string;
  quote?: string;
}

export interface TeamSubGroup {
  label?: string;
  desc?: string;
  members?: TeamMember[];
}

/** memberLists 的顶层分组成员（founder/general/events/news/advisor/tech/alumni）。 */
export const memberListKeys = [
  "founderMembers",
  "generalMembers",
  "eventsMembers",
  "newsMembers",
  "advisorMembers",
  "techMembers",
  "alumniMembers",
] as const;
export type MemberListKey = (typeof memberListKeys)[number];

/** subGroupMaps 的顶层分组（affairs/news/professional/project）。 */
export const subGroupMapKeys = [
  "affairsSubGroups",
  "newsSubGroups",
  "professionalSubGroups",
  "projectSubGroups",
] as const;
export type SubGroupMapKey = (typeof subGroupMapKeys)[number];

export type MemberLists = Record<MemberListKey, TeamMember[]>;
export type SubGroupMaps = Record<SubGroupMapKey, Record<string, TeamSubGroup>>;

/** 完整数据对象类型，供 as const satisfies 校验。 */
export interface TeamData {
  memberLists: MemberLists;
  subGroupMaps: SubGroupMaps;
}
