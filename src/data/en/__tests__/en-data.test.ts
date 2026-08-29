import { describe, expect, it } from "vitest";
import { SITE_NAME } from "../config";
import { timelineItems } from "../timeline";
import { timelineItems as zhTimelineItems } from "../../timeline";
import { teamData } from "../team-data";
import { memberListKeys, subGroupMapKeys } from "../../team-types";

describe("en-data/en 英文占位副本", () => {
  it("en/config 品牌名保持「理科迷」不翻译", () => {
    expect(SITE_NAME).toBe("理科迷");
  });

  it("en/timeline 与中文源同为 18 条", () => {
    expect(timelineItems.length).toBe(18);
    expect(zhTimelineItems.length).toBe(18);
  });

  it("en/timeline 每条 year 非空，且与中文源对应 year 一致", () => {
    for (let i = 0; i < timelineItems.length; i++) {
      expect(timelineItems[i].year.trim().length).toBeGreaterThan(0);
      expect(timelineItems[i].year).toBe(zhTimelineItems[i].year);
    }
  });

  it("en/timeline 占位文本含占位标记", () => {
    for (const item of timelineItems) {
      expect(item.title).toContain("(placeholder)");
      expect(item.description).toContain("(placeholder)");
    }
  });

  it("en/team-data 满足基本结构（memberLists 7 键、subGroupMaps 4 键）", () => {
    expect(Object.keys(teamData.memberLists)).toEqual([...memberListKeys]);
    expect(Object.keys(teamData.subGroupMaps)).toEqual([...subGroupMapKeys]);
  });
});
