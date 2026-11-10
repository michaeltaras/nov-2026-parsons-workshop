import { describe, expect, it } from "vitest";
import {
  counties,
  candidateVoteTotal,
  statewide2026,
} from "../../src/data/elections";
import {
  compareCounty,
  counties2022,
  netVotes,
  summarizeContributions,
} from "../../src/data/analysis";
import {
  createVoteCircleLayout,
  voteCircleRadius,
} from "../../src/features/voteCircleLayout";

describe("County contributions to the statewide difference", () => {
  it("adds all 62 county net votes to the independent statewide difference", () => {
    const summary = summarizeContributions(counties);
    expect(summary.missingCount).toBe(0);
    expect(summary.towardHochul - summary.towardBlakeman).toBe(1203501);
    expect(summary.net).toBe(netVotes(statewide2026));
    expect(netVotes(counties.find((county) => county.name === "Kings")!)).toBe(
      366835,
    );
  });
  it("does not count write-ins or blank/void ballots toward either named candidate", () => {
    const result = {
      ballotLines: [
        { candidate: "hochul", party: "DEM", votes: 10 },
        { candidate: "hochul", party: "WOR", votes: 5 },
        { candidate: "blakeman", party: "REP", votes: 20 },
        { candidate: "write-in", party: "", votes: 100 },
      ],
      blank: 90,
      void: 4,
    };
    expect(netVotes(result)).toBe(-5);
    expect(summarizeContributions([result]).towardBlakeman).toBe(5);
    expect(netVotes({ ...result, ballotLines: [] })).toBeNull();
    expect(
      summarizeContributions([{ ...result, ballotLines: [] }]).missingCount,
    ).toBe(1);
    expect(
      netVotes({
        ...result,
        ballotLines: [
          { candidate: "hochul", party: "DEM", votes: 20 },
          { candidate: "blakeman", party: "REP", votes: 20 },
        ],
      }),
    ).toBe(0);
  });
});

describe("Same-office historical comparison", () => {
  it("joins all 62 counties by FIPS and explicitly compares Zeldin with Blakeman", () => {
    expect(counties2022).toHaveLength(62);
    for (const county of counties)
      expect(
        compareCounty(county),
        `Missing baseline for ${county.name}`,
      ).not.toBeNull();
    const albany = counties.find((county) => county.name === "Albany")!;
    const comparison = compareCounty(albany)!;
    expect(comparison.net2022).toBe(21490);
    expect(comparison.net2026).toBe(36792);
    expect(comparison.netChange).toBe(15302);
    expect(comparison.margin2022).toBeCloseTo((21490 / 116965) * 100);
    expect(comparison.margin2026).toBeCloseTo((36792 / 115976) * 100);
    expect(comparison.marginChange).toBeCloseTo(
      (36792 / 115976) * 100 - (21490 / 116965) * 100,
    );
    expect(comparison.votes2022).toBe(116965);
    expect(comparison.votes2026).toBe(115976);
    expect(comparison.voteChange).toBe(-989);
  });
  it("leaves missing baselines and missing named candidates unavailable", () => {
    expect(compareCounty({ ...counties[0], fips: "99999" })).toBeNull();
    expect(compareCounty({ ...counties[0], ballotLines: [] })).toBeNull();
  });
});

describe("Vote-circle statistical encoding", () => {
  it("makes area proportional to all candidate votes without an inflated minimum", () => {
    expect(voteCircleRadius(0)).toBe(0);
    expect(voteCircleRadius(500000)).toBe(34);
    expect(voteCircleRadius(500000) / voteCircleRadius(125000)).toBeCloseTo(2);
    const albany = counties.find((county) => county.name === "Albany")!;
    expect(candidateVoteTotal(albany)).toBe(115976);
  });
  it("separates overlapping symbols deterministically without changing their vote areas", () => {
    const anchors = [
      { fips: "a", x: 400, y: 250, votes: 500000 },
      { fips: "b", x: 400, y: 250, votes: 125000 },
    ];
    const layout = createVoteCircleLayout(anchors);
    expect(createVoteCircleLayout(anchors)).toEqual(layout);
    expect(
      Math.hypot(layout[0].x - layout[1].x, layout[0].y - layout[1].y),
    ).toBeGreaterThanOrEqual(layout[0].radius + layout[1].radius);
    expect(layout[0].radius).toBe(34);
    expect(layout[1].radius).toBe(17);
    expect(anchors[0].x).toBe(400);
    for (const circle of layout) {
      expect(circle.x - circle.radius).toBeGreaterThanOrEqual(0);
      expect(circle.y + circle.radius).toBeLessThanOrEqual(520);
    }
  });
});
