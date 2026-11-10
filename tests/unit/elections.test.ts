import { describe, it, expect } from "vitest";
import {
  aggregateVotes,
  candidateVoteTotal,
  counties,
  geography,
  joinCounty,
  margin,
  share,
  statewide2022,
  statewide2026,
} from "../../src/data/elections";
import { votes, percent, marginLabel } from "../../src/utils/formatNumbers";
import { electionColor, colors, missing } from "../../src/utils/electionColors";
describe("Candidate votes and fusion ballot lines", () => {
  it("adds different ballot lines for the same candidate once", () => {
    expect(
      aggregateVotes([
        { candidate: "a", party: "DEM", votes: 80 },
        { candidate: "a", party: "WOR", votes: 20 },
        { candidate: "b", party: "REP", votes: 70 },
      ]),
    ).toEqual({ a: 100, b: 70 });
  });
  it("reconciles certified statewide candidate totals with all 62 counties", () => {
    expect(counties).toHaveLength(62);
    expect(aggregateVotes(statewide2022.ballotLines)).toEqual({
      hochul: 3140415,
      zeldin: 2762581,
      "write-in": 9290,
    });
    expect(
      candidateVoteTotal(statewide2022) +
        statewide2022.blank +
        statewide2022.void,
    ).toBe(5962278);
  });
  it("preserves every 2026 fusion party line and reconciles the snapshot", () => {
    expect(aggregateVotes(statewide2026.ballotLines)).toEqual({
      hochul: 3620177,
      blakeman: 2416676,
      "write-in": 12721,
    });
    expect(
      candidateVoteTotal(statewide2026) +
        statewide2026.blank +
        statewide2026.void,
    ).toBe(6111361);
  });
  it("rejects negative and fractional vote counts", () => {
    for (const value of [-1, 1.5, NaN])
      expect(() =>
        aggregateVotes([{ candidate: "a", party: "", votes: value }]),
      ).toThrow("nonnegative integers");
  });
});
describe("Honest denominators and missing data", () => {
  const example = {
    ballotLines: [
      { candidate: "hochul", party: "DEM", votes: 60 },
      { candidate: "zeldin", party: "REP", votes: 30 },
      { candidate: "write-in", party: "", votes: 10 },
    ],
    blank: 90,
    void: 10,
  };
  it("uses all candidate votes including write-ins, but excludes blanks and voids", () => {
    expect(candidateVoteTotal(example)).toBe(100);
    expect(margin(example)).toBe(30);
    expect(share(60, 100)).toBe(60);
  });
  it("does not turn empty or incomplete results into a zero margin", () => {
    expect(share(0, 0)).toBeNull();
    expect(margin({ ballotLines: [], blank: 0, void: 0 })).toBeNull();
    expect(
      margin({ ...example, ballotLines: example.ballotLines.slice(0, 1) }),
    ).toBeNull();
    expect(electionColor(null)).toBe(missing);
  });
  it("distinguishes a true tie", () => {
    expect(
      margin({
        ...example,
        ballotLines: [
          { candidate: "hochul", party: "", votes: 5 },
          { candidate: "zeldin", party: "", votes: 5 },
        ],
      }),
    ).toBe(0);
    expect(marginLabel(0)).toBe("Tie");
  });
});
describe("Geographic joins and shared presentation", () => {
  it("joins exactly one result to each unique Census county FIPS", () => {
    expect(geography.features).toHaveLength(62);
    expect(new Set(counties.map((c) => c.fips)).size).toBe(62);
    for (const feature of geography.features)
      expect(
        joinCounty(feature.properties.fips)?.name,
        `Join failed for ${feature.properties.name}`,
      ).toBe(feature.properties.name);
    expect(joinCounty("99999")).toBeUndefined();
  });
  it("formats values consistently without implying unavailable data is zero", () => {
    expect(votes(3140415)).toBe("3,140,415");
    expect(percent(53.117)).toBe("53.1%");
    expect(percent(null)).toBe("Not available");
    expect(marginLabel(-4.25)).toBe("R +4.3");
  });
  it("uses the documented threshold scale", () => {
    expect(electionColor(-31)).toBe(colors[0]);
    expect(electionColor(-4)).toBe(colors[3]);
    expect(electionColor(4)).toBe(colors[4]);
    expect(electionColor(31)).toBe(colors[7]);
  });
});
