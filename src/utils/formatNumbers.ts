export function votes(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
export function percent(value: number | null): string {
  return value === null ? "Not available" : `${value.toFixed(1)}%`;
}
export function marginLabel(value: number | null): string {
  if (value === null) {
    return "No results";
  }
  if (value === 0) {
    return "Tie";
  }
  return `${value > 0 ? "D" : "R"} +${Math.abs(value).toFixed(1)}`;
}

export function signedVotes(value: number): string {
  return `${value > 0 ? "+" : value < 0 ? "−" : ""}${votes(Math.abs(value))}`;
}
export function changeLabel(value: number): string {
  if (value === 0) {
    return "No margin change";
  }
  return `${Math.abs(value).toFixed(1)} pts toward ${value > 0 ? "D" : "R"}`;
}
