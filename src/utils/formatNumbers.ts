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

export function formatSourceTimestamp(updatedISO: string): string | null {
  const date = new Date(updatedISO);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function snapshotAgeLabel(
  updatedISO: string,
  now: Date = new Date(),
): string {
  const updated = new Date(updatedISO);
  if (Number.isNaN(updated.getTime())) {
    return "snapshot update time unavailable";
  }

  const elapsedMilliseconds = now.getTime() - updated.getTime();
  if (Number.isNaN(elapsedMilliseconds) || elapsedMilliseconds <= 60_000) {
    return "Updated just now";
  }

  const elapsedMinutes = Math.floor(elapsedMilliseconds / 60_000);
  if (elapsedMinutes < 60) {
    return `Updated ${elapsedMinutes} ${
      elapsedMinutes === 1 ? "minute" : "minutes"
    } ago`;
  }

  const elapsedHours = Math.floor(elapsedMilliseconds / 3_600_000);
  if (elapsedHours < 24) {
    return `Updated ${elapsedHours} ${
      elapsedHours === 1 ? "hour" : "hours"
    } ago`;
  }

  const elapsedDays = Math.floor(elapsedMilliseconds / 86_400_000);
  return `Updated ${elapsedDays} ${elapsedDays === 1 ? "day" : "days"} ago`;
}
