// SVG county controls require roles because HTML buttons cannot wrap SVG shapes.
// The map also uses a labeled div to group its representation buttons.
/* oxlint-disable jsx-a11y/prefer-tag-over-role */
import { useId, useMemo, useState } from "react";
import { geoConicConformal, geoPath } from "d3";
import {
  candidateVoteTotal,
  geography,
  joinCounty,
  margin,
} from "../data/elections";
import { electionColor } from "../utils/electionColors";
import { marginLabel, votes } from "../utils/formatNumbers";
import Legend from "../components/Legend";
import { createVoteCircleLayout, voteCircleRadius } from "./voteCircleLayout";

export default function ElectionMap({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (fips: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const shapeId = useId();
  const [labels, setLabels] = useState(false);
  const [mode, setMode] = useState<"land" | "votes">("land");
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
  const circles = useMemo(() => {
    const anchors = geography.features.map((feature) => {
      const [x, y] = path.centroid(feature);
      const county = joinCounty(feature.properties.fips);
      return {
        fips: feature.properties.fips,
        x,
        y,
        votes: county ? candidateVoteTotal(county) : 0,
      };
    });
    return createVoteCircleLayout(anchors).sort((a, b) => b.votes - a.votes);
  }, [path]);
  const active = joinCounty(hovered ?? focused ?? selected);
  const shapes =
    mode === "land"
      ? geography.features.map((feature) => ({
          fips: feature.properties.fips,
          feature,
          circle: null,
        }))
      : circles.map((circle) => ({ fips: circle.fips, feature: null, circle }));

  return (
    <section className="map-panel" aria-labelledby="map-title">
      <div className="panel-heading">
        <div>
          <span className="section-kicker">Governor · 2026</span>
          <h2 id="map-title">County results</h2>
        </div>
        <button
          className={labels ? "toggle active" : "toggle"}
          aria-pressed={labels}
          onClick={() => setLabels(!labels)}
        >
          County labels
        </button>
      </div>
      <div
        className="map-mode-control"
        role="group"
        aria-label="Map representation"
      >
        <button aria-pressed={mode === "land"} onClick={() => setMode("land")}>
          County map
        </button>
        <button
          aria-pressed={mode === "votes"}
          onClick={() => setMode("votes")}
        >
          Vote circles
        </button>
        <span>
          {mode === "land"
            ? "Color shows the reported margin between Hochul and Blakeman."
            : "Circle area represents reported candidate votes."}
        </span>
      </div>
      <div className="map-surface">
        <span className="lake lake-ontario">LAKE ONTARIO</span>
        <span className="lake lake-erie">LAKE ERIE</span>
        <svg
          className="county-map"
          viewBox="0 0 810 520"
          aria-label={`Interactive map of 62 New York counties, unofficial 2026 governor results, ${mode === "land" ? "land area" : "vote circles"}`}
        >
          {mode === "votes" && (
            <g className="circle-geography" aria-hidden="true">
              {geography.features.map((feature) => (
                <path key={feature.id} d={path(feature) ?? ""} />
              ))}
              {circles.map((circle) => (
                <line
                  key={circle.fips}
                  x1={circle.anchorX}
                  y1={circle.anchorY}
                  x2={circle.x}
                  y2={circle.y}
                />
              ))}
            </g>
          )}
          <g>
            {shapes.map(({ fips, feature, circle }) => {
              const county = joinCounty(fips);
              const value = county ? margin(county) : null;
              const isSelected = fips === selected;
              return (
                <g
                  key={fips}
                  className="county"
                  fill={electionColor(value)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${county?.name ?? fips} County, ${marginLabel(value)}${circle ? `, ${votes(circle.votes)} candidate votes` : ""}`}
                  aria-pressed={isSelected}
                  onMouseEnter={() => setHovered(fips)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setFocused(fips)}
                  onBlur={() => setFocused(null)}
                  onClick={() => onSelect(fips)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(fips);
                    }
                  }}
                >
                  <title>
                    {county?.name}: {marginLabel(value)}
                    {circle ? ` · ${votes(circle.votes)} candidate votes` : ""}
                  </title>
                  {circle ? (
                    <circle
                      id={`${shapeId}-${fips}`}
                      className="vote-circle"
                      cx={circle.x}
                      cy={circle.y}
                      r={circle.radius}
                    />
                  ) : (
                    feature && (
                      <path id={`${shapeId}-${fips}`} d={path(feature) ?? ""} />
                    )
                  )}
                </g>
              );
            })}
          </g>
          {/* Draw outlines above all county fills without changing hit targets or tab order. */}
          <g className="county-outlines" aria-hidden="true">
            <use
              className="county-selected-outline"
              href={`#${shapeId}-${selected}`}
            />
            {focused && focused !== selected && (
              <use href={`#${shapeId}-${focused}`} />
            )}
            {hovered && hovered !== selected && hovered !== focused && (
              <use href={`#${shapeId}-${hovered}`} />
            )}
          </g>
          {labels && (
            <g className="map-labels" aria-hidden="true">
              {geography.features.map((feature) => {
                const circle =
                  mode === "votes"
                    ? circles.find(
                        (item) => item.fips === feature.properties.fips,
                      )
                    : undefined;
                const [x, y] = circle
                  ? [circle.x, circle.y]
                  : path.centroid(feature);
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
          {mode === "votes" && active && (
            <small>{votes(candidateVoteTotal(active))} candidate votes</small>
          )}
        </div>
        <div className="map-note">
          N ↑<span>Hover to explore · click to select</span>
        </div>
      </div>
      {mode === "votes" && (
        <div
          className="circle-size-legend"
          aria-label="Circle area represents reported candidate votes"
        >
          <div className="circle-size-swatches">
            {/* Match the map's 810-unit width and rendered width. Sharing a
                radius function alone would not preserve sizes across SVGs. */}
            <svg viewBox="0 0 810 110" aria-hidden="true">
              {[100000, 500000].map((count, index) => (
                <circle
                  key={count}
                  data-votes={count}
                  cx={333 + index * 144}
                  cy={76 - voteCircleRadius(count)}
                  r={voteCircleRadius(count)}
                />
              ))}
            </svg>
            <div className="size-count-labels">
              {[100000, 500000].map((count, index) => (
                <span
                  key={count}
                  style={{ left: `${((333 + index * 144) / 810) * 100}%` }}
                >
                  {votes(count)}
                </span>
              ))}
            </div>
          </div>
          <span>
            Circle area = reported candidate votes, including write-ins;
            excluding blank and void ballots.
          </span>
        </div>
      )}
      <Legend />
      <p className="map-caption">
        {mode === "land"
          ? "County size represents land area, not vote totals. In both map modes, color shows the reported percentage-point margin."
          : "Circles are sized by reported candidate votes, not population or turnout. They are shifted to avoid overlap; guide lines connect them to county map centroids. The same margin color scale applies."}{" "}
        All 2026 counts are unofficial and incomplete.
      </p>
    </section>
  );
}
