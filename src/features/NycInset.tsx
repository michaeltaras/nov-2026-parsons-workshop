// SVG county controls require roles because HTML buttons cannot wrap SVG shapes.
/* oxlint-disable jsx-a11y/prefer-tag-over-role */
import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { geoConicConformal, geoPath } from "d3";
import { geography, joinCounty, margin } from "../data/elections";
import { electionColor } from "../utils/electionColors";
import { marginLabel } from "../utils/formatNumbers";

// Arrow keys move through the boroughs in this fixed south-to-north order.
const boroughs = [
  { fips: "36085", borough: "Staten Island" },
  { fips: "36047", borough: "Brooklyn" },
  { fips: "36081", borough: "Queens" },
  { fips: "36061", borough: "Manhattan" },
  { fips: "36005", borough: "Bronx" },
];
const nycFeatures = boroughs.map(({ fips }) => {
  const feature = geography.features.find(
    (item) => item.properties.fips === fips,
  );
  if (!feature) {
    throw new Error(`NYC county ${fips} is missing from the map geography`);
  }
  return feature;
});

// Same projection settings as the statewide map, fitted to NYC only. One
// uniform scale keeps each county's real shape and relative position.
const path = geoPath(
  geoConicConformal()
    .parallels([40.5, 44.5])
    .rotate([76, 0])
    .fitExtent(
      [
        [12, 12],
        [348, 348],
      ],
      { type: "FeatureCollection", features: nycFeatures },
    ),
);

export default function NycInset({
  selected,
  onSelect,
  onHover,
}: {
  selected: string;
  onSelect: (fips: string) => void;
  onHover: (fips: string | null) => void;
}) {
  // The inset is one Tab stop. Only the remembered county is focusable;
  // arrow keys move focus among the five. Focus alone never selects.
  const [focusIndex, setFocusIndex] = useState(() =>
    Math.max(
      0,
      boroughs.findIndex(({ fips }) => fips === selected),
    ),
  );
  const shapeRefs = useRef<(SVGGElement | null)[]>([]);

  function moveFocus(event: KeyboardEvent, index: number) {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowUp: index + 1,
      ArrowLeft: index - 1,
      ArrowDown: index - 1,
      Home: 0,
      End: boroughs.length - 1,
    };
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(boroughs[index].fips);
      return;
    }
    if (keys[event.key] === undefined) {
      return;
    }
    event.preventDefault();
    const next = (keys[event.key] + boroughs.length) % boroughs.length;
    setFocusIndex(next);
    shapeRefs.current[next]?.focus();
  }

  return (
    <div className="nyc-inset" id="nyc-inset">
      <div className="nyc-inset-text">
        <h3 id="nyc-inset-title">New York City, enlarged</h3>
        <p>
          Not to scale with the statewide map. Enlarging the area does not
          represent more votes; color shows the same reported margin.
        </p>
        <p id="nyc-inset-instructions">
          Tab to the close-up, use arrow keys to move between boroughs (south to
          north), and press Enter or Space to select.
        </p>
        <ul className="nyc-inset-key">
          {boroughs.map(({ fips, borough }) => (
            <li key={fips}>
              <strong>{borough}</strong> is {joinCounty(fips)?.name} County
            </li>
          ))}
        </ul>
      </div>
      <svg
        className="county-map nyc-inset-map"
        viewBox="0 0 360 360"
        role="toolbar"
        aria-orientation="horizontal"
        aria-labelledby="nyc-inset-title"
        aria-describedby="nyc-inset-instructions"
      >
        {boroughs.map(({ fips, borough }, index) => {
          const county = joinCounty(fips);
          const value = county ? margin(county) : null;
          const isSelected = fips === selected;
          return (
            <g
              key={fips}
              ref={(element) => {
                shapeRefs.current[index] = element;
              }}
              className={isSelected ? "county selected" : "county"}
              fill={electionColor(value)}
              tabIndex={index === focusIndex ? 0 : -1}
              role="button"
              aria-label={`${borough} (${county?.name ?? fips} County), ${marginLabel(value)}`}
              aria-pressed={isSelected}
              onMouseEnter={() => onHover(fips)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => {
                setFocusIndex(index);
                onHover(fips);
              }}
              onBlur={() => onHover(null)}
              onClick={() => onSelect(fips)}
              onKeyDown={(event) => moveFocus(event, index)}
            >
              <title>
                {borough} ({county?.name} County): {marginLabel(value)}
              </title>
              <path d={path(nycFeatures[index]) ?? ""} />
            </g>
          );
        })}
        <g className="nyc-inset-labels" aria-hidden="true">
          {nycFeatures.map((feature, index) => {
            const [x, y] = path.centroid(feature);
            // Manhattan is too narrow for its name, which would spill onto
            // neighboring boroughs. Place it just west of the island instead.
            const outside = boroughs[index].borough === "Manhattan";
            return (
              <text
                key={feature.id}
                x={outside ? x - 22 : x}
                y={y}
                textAnchor={outside ? "end" : "middle"}
              >
                {boroughs[index].borough}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
