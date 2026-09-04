import { describe, expect, it } from "vitest";
import { teamData } from "../team-data";
import { memberListKeys, subGroupMapKeys } from "../../team-types";

describe("en-data/en team-data 结构", () => {
  it("en/team-data 满足基本结构（memberLists 7 键、subGroupMaps 4 键）", () => {
    expect(Object.keys(teamData.memberLists)).toEqual([...memberListKeys]);
    expect(Object.keys(teamData.subGroupMaps)).toEqual([...subGroupMapKeys]);
  });
});
