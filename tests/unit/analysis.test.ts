import { describe, expect, it } from "vitest";
import {
  counties,
  candidateVoteTotal,
  statewide2026,
} from "../../src/data/elections";
import {
  compareCounty,
  counties2022,
  decomposeNetChange,
  netVotes,
  statewide2022,
  summarizeContributions,
  summarizeNetChange,
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
    for (const county of counties) {
      expect(
        compareCounty(county),
        `Missing baseline for ${county.name}`,
      ).not.toBeNull();
    }
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

describe("Net-vote change breakdown", () => {
  it("attributes a doubled count with the same 60–40 split entirely to volume", () => {
    expect(
      decomposeNetChange({ net: 20, votes: 100 }, { net: 40, votes: 200 }),
    ).toEqual({ netChange: 20, shareEffect: 0, volumeEffect: 20 });
  });
  it("attributes a shifted split with the same count entirely to share", () => {
    // 60–40 becomes 70–30 out of the same 100 candidate votes.
    expect(
      decomposeNetChange({ net: 20, votes: 100 }, { net: 40, votes: 100 }),
    ).toEqual({ netChange: 20, shareEffect: 20, volumeEffect: 0 });
  });
  it("splits a combined change with midpoint weights and no leftover term", () => {
    // 60–40 of 100 becomes 70–30 of 200: margin 0.2 → 0.4, votes 100 → 200.
    // Share: 0.2 × 150 = 30. Volume: 100 × 0.3 = 30. Net change: 80 − 20 = 60.
    expect(
      decomposeNetChange({ net: 20, votes: 100 }, { net: 80, votes: 200 }),
    ).toEqual({ netChange: 60, shareEffect: 30, volumeEffect: 30 });
    // Reversing the years reverses every sign: no baseline year is favored.
    expect(
      decomposeNetChange({ net: 80, votes: 200 }, { net: 20, votes: 100 }),
    ).toEqual({ netChange: -60, shareEffect: -30, volumeEffect: -30 });
  });
  it("handles a lead changing parties and a falling count", () => {
    // D +10 of 100 becomes R +27 of 90: margin 0.1 → −0.3, votes 100 → 90.
    // Share: −0.4 × 95 = −38. Volume: −10 × −0.1 = +1, because fewer votes
    // at an average Republican margin shrink the Republican advantage.
    expect(
      decomposeNetChange({ net: 10, votes: 100 }, { net: -27, votes: 90 }),
    ).toEqual({ netChange: -37, shareEffect: -38, volumeEffect: 1 });
  });
  it("is unavailable without candidate votes in both years", () => {
    expect(
      decomposeNetChange({ net: 0, votes: 0 }, { net: 10, votes: 100 }),
    ).toBeNull();
  });
  it("reconciles every county and the statewide sum to the actual net-vote change", () => {
    for (const county of counties) {
      const comparison = compareCounty(county)!;
      expect(comparison.shareEffect + comparison.volumeEffect).toBe(
        comparison.netChange,
      );
    }
    const albany = compareCounty(
      counties.find((county) => county.name === "Albany")!,
    )!;
    const albanyMargin2022 = 21490 / 116965;
    const albanyMargin2026 = 36792 / 115976;
    expect(albany.shareEffect).toBe(
      Math.round(
        ((albanyMargin2026 - albanyMargin2022) * (116965 + 115976)) / 2,
      ),
    );
    expect(albany.volumeEffect).toBe(15302 - albany.shareEffect);

    const statewide = summarizeNetChange(counties);
    expect(statewide.missingCount).toBe(0);
    expect(statewide.net2022).toBe(netVotes(statewide2022, "zeldin"));
    expect(statewide.net2026).toBe(netVotes(statewide2026));
    expect(statewide.netChange).toBe(825667);
    expect(statewide.shareEffect + statewide.volumeEffect).toBe(825667);
    // Counties are rounded to whole votes before summing.
    expect(statewide.shareEffect).toBe(722281);
    expect(statewide.volumeEffect).toBe(103386);
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
