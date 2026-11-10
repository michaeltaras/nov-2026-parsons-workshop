import { scaleThreshold } from "d3";
export const democratic = "#28786f";
export const republican = "#bb694d";
export const missing = "#dddcd5";
export const thresholds = [-30, -15, -5, 0, 5, 15, 30];
export const colors = [
  "#a54d36",
  "#bd6a4c",
  "#d38d6b",
  "#e7bfa7",
  "#b8d9cd",
  "#86bbab",
  "#539989",
  "#247466",
];
const scale = scaleThreshold<number, string>().domain(thresholds).range(colors);
export function electionColor(value: number | null): string {
  return value === null ? missing : value === 0 ? "#eeece3" : scale(value);
}
