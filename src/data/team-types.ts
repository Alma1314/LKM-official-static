// 团队数据静态类型（对应 src/data/team-members.json 的结构）。
// members.json 是 JSON（无类型），页面 import 后按此类型断言，消除隐式 any。

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

export type MemberLists = Record<string, TeamMember[]>;
export type SubGroupMaps = Record<string, Record<string, TeamSubGroup>>;
