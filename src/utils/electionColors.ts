import { scaleThreshold } from "d3";
export const democratic = "#3168ad";
export const republican = "#bd414a";
export const writeIn = "#888888";
export const missing = "#dddddd";
export const thresholds = [-30, -15, -5, 0, 5, 15, 30];
export const colors = [
  "#a82f39",
  "#c45560",
  "#da8c92",
  "#efc8cc",
  "#c9dbed",
  "#94b7d8",
  "#5f8fbd",
  "#2d609d",
];
const scale = scaleThreshold<number, string>().domain(thresholds).range(colors);
export function electionColor(value: number | null): string {
  return value === null ? missing : value === 0 ? "#f5f5f5" : scale(value);
}
