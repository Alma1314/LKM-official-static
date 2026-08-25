import { describe, expect, it } from "vitest";
import { SITE_NAME, SITE_DESCRIPTION, SITE_TITLE } from "../config";

describe("data/config", () => {
  it("站点名与简介非空", () => {
    expect(SITE_NAME).toBe("理科迷");
    expect(SITE_TITLE).toBe(SITE_NAME);
    expect(SITE_DESCRIPTION.length).toBeGreaterThan(0);
  });
});
