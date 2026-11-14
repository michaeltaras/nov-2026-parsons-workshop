import historicalData from "../../data/processed/governor-2022.json";
import {
  aggregateVotes,
  candidateVoteTotal,
  combineResults,
  margin,
  type County,
  type Result,
} from "./elections";

export interface HistoricalCounty extends Result {
  fips: string;
  name: string;
  status: string;
}
export const counties2022: HistoricalCounty[] = historicalData;
export const statewide2022 = combineResults(counties2022);

// Net votes add up across counties; percentage-point margins do not.
export function netVotes(
  result: Result,
  republican = "blakeman",
): number | null {
  const totals = aggregateVotes(result.ballotLines);
  if (totals.hochul === undefined || totals[republican] === undefined) {
    return null;
  }
  return totals.hochul - totals[republican];
}

export function summarizeContributions(results: Result[]) {
  let towardHochul = 0;
  let towardBlakeman = 0;
  let missingCount = 0;
  for (const result of results) {
    const net = netVotes(result);
    if (net === null) {
      missingCount++;
    } else if (net > 0) {
      towardHochul += net;
    } else {
      towardBlakeman += Math.abs(net);
    }
  }
  return {
    towardHochul,
    towardBlakeman,
    net: towardHochul - towardBlakeman,
    missingCount,
  };
}

// The office and county boundaries match. The Republican ticket and completion
// status differ: this measures aggregate reported results, not voters switching.
export function compareCounty(
  current: County,
  previous = counties2022.find((county) => county.fips === current.fips),
) {
  if (!previous) {
    return null;
  }
  const margin2022 = margin(previous, "zeldin");
  const margin2026 = margin(current, "blakeman");
  const net2022 = netVotes(previous, "zeldin");
  const net2026 = netVotes(current, "blakeman");
  if (
    margin2022 === null ||
    margin2026 === null ||
    net2022 === null ||
    net2026 === null
  ) {
    return null;
  }
  const votes2022 = candidateVoteTotal(previous);
  const votes2026 = candidateVoteTotal(current);
  return {
    margin2022,
    margin2026,
    marginChange: margin2026 - margin2022,
    net2022,
    net2026,
    netChange: net2026 - net2022,
    votes2022,
    votes2026,
    voteChange: votes2026 - votes2022,
  };
}
