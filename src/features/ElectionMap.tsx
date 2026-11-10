import { useMemo, useState } from "react";
import { geoConicConformal, geoPath } from "d3";
import { geography, joinCounty, margin } from "../data/elections";
import { electionColor } from "../utils/electionColors";
import { marginLabel } from "../utils/formatNumbers";
import Legend from "../components/Legend";
export default function ElectionMap({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (fips: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [labels, setLabels] = useState(false);
  const path = useMemo(
    () =>
      geoPath(
        geoConicConformal()
          .parallels([40.5, 44.5])
          .rotate([76, 0])
          .fitExtent(
            [
              [30, 24],
              [780, 484],
            ],
            geography,
          ),
      ),
    [],
  );
  const active = joinCounty(hovered ?? selected);
  return (
    <section className="map-panel" aria-labelledby="map-title">
      <div className="panel-heading">
        <div>
          <span className="section-kicker">01 / THE GEOGRAPHY OF THE VOTE</span>
          <h2 id="map-title">One state. 62 different stories.</h2>
        </div>
        <button
          className={labels ? "toggle active" : "toggle"}
          aria-pressed={labels}
          onClick={() => setLabels(!labels)}
        >
          County labels
        </button>
      </div>
      <div className="map-surface">
        <span className="lake lake-ontario">LAKE ONTARIO</span>
        <span className="lake lake-erie">LAKE ERIE</span>
        <svg
          className="county-map"
          viewBox="0 0 810 520"
          aria-label="Interactive map of 62 New York counties, unofficial 2026 governor results"
        >
          <g>
            {geography.features.map((feature) => {
              const county = joinCounty(feature.properties.fips);
              const value = county ? margin(county) : null;
              const isSelected = feature.id === selected;
              return (
                <path
                  key={feature.id}
                  d={path(feature) ?? ""}
                  fill={electionColor(value)}
                  className={isSelected ? "county selected" : "county"}
                  tabIndex={0}
                  role="button"
                  aria-label={`${feature.properties.name} County, ${marginLabel(value)}`}
                  aria-pressed={isSelected}
                  onMouseEnter={() => setHovered(feature.properties.fips)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(feature.properties.fips)}
                  onBlur={() => setHovered(null)}
                  onClick={() => onSelect(feature.properties.fips)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(feature.properties.fips);
                    }
                  }}
                >
                  <title>
                    {feature.properties.name}: {marginLabel(value)}
                  </title>
                </path>
              );
            })}
          </g>
          {labels && (
            <g className="map-labels" aria-hidden="true">
              {geography.features.map((feature) => {
                const [x, y] = path.centroid(feature);
                return (
                  <text key={feature.id} x={x} y={y}>
                    {feature.properties.name}
                  </text>
                );
              })}
            </g>
          )}
        </svg>
        <div className="map-readout" aria-live="polite">
          <span>{active?.name} County</span>
          <strong>{active ? marginLabel(margin(active)) : "No results"}</strong>
        </div>
        <div className="map-note">
          N ↑<span>Hover to explore · click to select</span>
        </div>
      </div>
      <Legend />
      <p className="map-caption">
        Land doesn’t vote. Each county’s color shows its margin, not its number
        of voters. Explore the vote comparison below for another perspective.
      </p>
    </section>
  );
}
