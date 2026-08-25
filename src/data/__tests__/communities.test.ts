import { describe, expect, it } from "vitest";
import { communityCategories, communityNote } from "../communities";

describe("data/communities", () => {
  it("包含 8 个社群分类", () => {
    expect(communityCategories.length).toBe(8);
  });

  it("每个分类下都有带名称的群组", () => {
    for (const cat of communityCategories) {
      expect(cat.label.trim().length).toBeGreaterThan(0);
      expect(cat.groups.length).toBeGreaterThan(0);
      for (const g of cat.groups) {
        expect(g.name.trim().length).toBeGreaterThan(0);
        expect(g.qqGroup).toBeTruthy();
      }
    }
  });

  it("底部注记非空", () => {
    expect(communityNote.trim().length).toBeGreaterThan(0);
  });
});
