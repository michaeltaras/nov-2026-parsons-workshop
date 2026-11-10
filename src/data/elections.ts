import countyData from "../../data/processed/governor-2022.json";
import snapshot from "../../data/processed/governor-2026-statewide.json";
import geographyData from "../../data/geography/ny-counties.json";
import type { FeatureCollection, MultiPolygon } from "geojson";
export interface BallotLine {
  candidate: string;
  party: string;
  votes: number;
}
export interface Result {
  ballotLines: BallotLine[];
  blank: number;
  void: number;
}
export interface County extends Result {
  fips: string;
  name: string;
  status: string;
}
export const counties: County[] = countyData;
export const statewide2026 = snapshot;
export const geography = geographyData as FeatureCollection<
  MultiPolygon,
  { name: string; fips: string }
>;
export const candidates = {
  hochul: { name: "Kathy Hochul", party: "Democratic · Working Families" },
  zeldin: { name: "Lee Zeldin", party: "Republican · Conservative" },
  blakeman: {
    name: "Bruce Blakeman",
    party: "Republican · Conservative · Vote Affordable",
  },
};

// Fusion voting: add each ballot line exactly once, grouped by candidate identity.
export function aggregateVotes(lines: BallotLine[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const line of lines) {
    if (!Number.isInteger(line.votes) || line.votes < 0)
      throw new Error("Votes must be nonnegative integers");
    totals[line.candidate] = (totals[line.candidate] ?? 0) + line.votes;
  }
  return totals;
}
export function candidateVoteTotal(result: Result): number {
  return result.ballotLines.reduce((sum, line) => sum + line.votes, 0);
}
export function share(votes: number, total: number): number | null {
  return total > 0 ? (votes / total) * 100 : null;
}
// Signed Democratic minus Republican share, in percentage points of all candidate votes.
export function margin(result: Result, republican = "zeldin"): number | null {
  const totals = aggregateVotes(result.ballotLines);
  if (totals.hochul === undefined || totals[republican] === undefined)
    return null;
  return share(totals.hochul - totals[republican], candidateVoteTotal(result));
}
export function combineResults(results: Result[]): Result {
  return {
    ballotLines: results.flatMap((result) => result.ballotLines),
    blank: results.reduce((n, r) => n + r.blank, 0),
    void: results.reduce((n, r) => n + r.void, 0),
  };
}
export function joinCounty(fips: string): County | undefined {
  return counties.find((county) => county.fips === fips);
}
export const statewide2022 = combineResults(counties);
