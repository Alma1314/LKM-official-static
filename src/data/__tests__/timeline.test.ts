import { describe, expect, it } from "vitest";
import { timelineItems } from "../timeline";

describe("data/timeline", () => {
  it("包含 18 条发展历程", () => {
    expect(timelineItems.length).toBe(18);
  });

  it("每条均有非空 year/title/description", () => {
    for (const item of timelineItems) {
      expect(item.year.trim().length).toBeGreaterThan(0);
      expect(item.title.trim().length).toBeGreaterThan(0);
      expect(item.description.trim().length).toBeGreaterThan(0);
    }
  });

  it("各条 year 唯一（无重复时间线点）", () => {
    const years = timelineItems.map((i) => i.year);
    expect(new Set(years).size).toBe(years.length);
  });
});
