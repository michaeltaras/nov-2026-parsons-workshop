import historicalCounties from "../../data/processed/governor-2022.json";
import { describe, it, expect } from "vitest";
import {
  aggregateVotes,
  candidateVoteTotal,
  counties,
  geography,
  joinCounty,
  margin,
  share,
  combineResults,
  statewide2026,
} from "../../src/data/elections";
import {
  votes,
  percent,
  marginLabel,
  formatSourceTimestamp,
  snapshotAgeLabel,
} from "../../src/utils/formatNumbers";
import { electionColor, colors, missing } from "../../src/utils/electionColors";
const statewide2022 = combineResults(historicalCounties);

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

  it("reconciles every 2026 county party line and ballot category with the independent statewide totals", () => {
    const combined = combineResults(counties);
    expect(aggregateVotes(combined.ballotLines)).toEqual(
      aggregateVotes(statewide2026.ballotLines),
    );
    for (const stateLine of statewide2026.ballotLines) {
      const countySum = combined.ballotLines
        .filter(
          (line) =>
            line.candidate === stateLine.candidate &&
            line.party === stateLine.party,
        )
        .reduce((sum, line) => sum + line.votes, 0);
      expect(countySum, `${stateLine.candidate} / ${stateLine.party}`).toBe(
        stateLine.votes,
      );
    }
    expect(combined.blank).toBe(56513);
    expect(combined.void).toBe(5274);
    expect(candidateVoteTotal(combined) + combined.blank + combined.void).toBe(
      6111361,
    );
    expect(
      counties.reduce((sum, county) => sum + county.districtsReporting, 0),
    ).toBe(12199);
    expect(
      counties.reduce((sum, county) => sum + county.districtsTotal, 0),
    ).toBe(13187);
    for (const county of counties) {
      expect(county.status).toBe("unofficial");
      expect(county.year).toBe(2026);
      expect(county.updatedISO).toBe(statewide2026.updatedISO);
      expect(county.ballotLines.map((line) => line.party)).toEqual([
        "DEM",
        "WOR",
        "REP",
        "CON",
        "Vote Affordable",
        "",
      ]);
    }
  });
  it("preserves the Westchester reporting discrepancy without dropping its votes", () => {
    const county = joinCounty("36119")!;
    expect(aggregateVotes(county.ballotLines)).toEqual({
      hochul: 225858,
      blakeman: 116086,
      "write-in": 442,
    });
    expect(county.districtsReporting).toBe(0);
    expect(county.districtsTotal).toBe(906);
    expect(county.sourcePartial).toBe(false);
    expect(margin(county)).not.toBeNull();
  });
  it("rejects negative and fractional vote counts", () => {
    for (const value of [-1, 1.5, NaN]) {
      expect(() =>
        aggregateVotes([{ candidate: "a", party: "", votes: value }]),
      ).toThrow("nonnegative integers");
    }
  });
});
describe("Snapshot freshness formatting", () => {
  it("formats the source timestamp in America/New_York", () => {
    expect(formatSourceTimestamp("2026-11-10T02:10:02.000Z")).toBe(
      "November 9, 2026 at 9:10:02 PM EST",
    );
  });

  it("formats recent ages and transitions between days", () => {
    const source = "2026-11-10T02:10:02.000Z";
    expect(snapshotAgeLabel(source, new Date("2026-11-10T02:10:02.000Z"))).toBe(
      "Updated just now",
    );
    expect(snapshotAgeLabel(source, new Date("2026-11-10T02:40:02.000Z"))).toBe(
      "Updated 30 minutes ago",
    );
    expect(snapshotAgeLabel(source, new Date("2026-11-10T03:10:02.000Z"))).toBe(
      "Updated 1 hour ago",
    );
    expect(snapshotAgeLabel(source, new Date("2026-11-11T02:10:02.000Z"))).toBe(
      "Updated 1 day ago",
    );
    expect(snapshotAgeLabel(source, new Date("2026-11-18T02:10:02.000Z"))).toBe(
      "Updated 8 days ago",
    );
  });

  it("does not produce negative or invalid ages", () => {
    expect(
      snapshotAgeLabel(
        "2026-11-10T02:10:02.000Z",
        new Date("2026-11-09T02:10:02.000Z"),
      ),
    ).toBe("Updated just now");
    expect(snapshotAgeLabel("not-a-date", new Date())).toBe(
      "snapshot update time unavailable",
    );
    expect(formatSourceTimestamp("not-a-date")).toBeNull();
  });
});

describe("Honest denominators and missing data", () => {
  const example = {
    ballotLines: [
      { candidate: "hochul", party: "DEM", votes: 60 },
      { candidate: "blakeman", party: "REP", votes: 30 },
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
          { candidate: "blakeman", party: "", votes: 5 },
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
    for (const feature of geography.features) {
      expect(
        joinCounty(feature.properties.fips)?.name,
        `Join failed for ${feature.properties.name}`,
      ).toBe(feature.properties.name);
    }
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
