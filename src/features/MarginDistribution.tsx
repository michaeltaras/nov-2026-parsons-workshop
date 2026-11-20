import { counties, margin } from "../data/elections";
import { electionColor, democratic, republican } from "../utils/electionColors";
import { marginLabel } from "../utils/formatNumbers";

interface CountyMargin {
  fips: string;
  name: string;
  value: number | null;
}

export default function MarginDistribution({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (fips: string) => void;
}) {
  // Compute margins for all counties
  const countyMargins: CountyMargin[] = counties
    .map((county) => ({
      fips: county.fips,
      name: county.name,
      value: margin(county),
    }))
    .sort((a, b) => (a.value ?? -Infinity) - (b.value ?? -Infinity));

  // Separate counties with valid margins from those with missing margins
  const validMargins = countyMargins.filter((c) => c.value !== null);
  const missingMargins = countyMargins.filter((c) => c.value === null);

  // Axis bounds: find min/max margins, pad slightly
  const margins = validMargins.map((c) => c.value!);
  const minMargin = Math.min(...margins);
  const maxMargin = Math.max(...margins);
  const padding = Math.max((maxMargin - minMargin) * 0.05, 2);
  const axisMin = Math.floor(minMargin - padding);
  const axisMax = Math.ceil(maxMargin + padding);

  // Chart dimensions
  const chartWidth = 750;
  const chartHeight = 120;
  const plotLeft = 40;
  const plotRight = 20;
  const plotWidth = chartWidth - plotLeft - plotRight;

  // Scale function: margin value -> x position
  const scaleX = (value: number) => {
    const range = axisMax - axisMin;
    return plotLeft + ((value - axisMin) / range) * plotWidth;
  };

  // Stack dots that would overlap horizontally
  // Group counties by their exact horizontal position (rounded to handle floating point)
  const positionMap = new Map<number, CountyMargin[]>();
  validMargins.forEach((county) => {
    const x = Math.round(scaleX(county.value!) * 100) / 100; // round to 0.01px precision
    const existing = positionMap.get(x) ?? [];
    existing.push(county);
    positionMap.set(x, existing);
  });

  // Create stacked dot positions
  const dotRadius = 5;
  const dotDiameter = dotRadius * 2;
  const verticalSpacing = 2;
  const stackHeight = dotDiameter + verticalSpacing;

  const stackedDots = Array.from(positionMap.entries()).flatMap(
    ([x, items]) => {
      const centerY = chartHeight / 2;
      const totalHeight = (items.length - 1) * stackHeight;
      const startY = centerY + totalHeight / 2;
      return items.map((item, index) => ({
        ...item,
        x,
        y: startY - index * stackHeight,
      }));
    },
  );

  // Axis tick positions (every 5 percentage points, plus zero)
  const tickStep = 5;
  const ticks = [];
  for (let t = axisMin; t <= axisMax; t += tickStep) {
    if (t === 0 || (t % tickStep === 0 && t !== 0)) {
      ticks.push(t);
    }
  }
  // Ensure zero is always included
  if (!ticks.includes(0)) {
    ticks.push(0);
  }
  ticks.sort((a, b) => a - b);

  // Find selected county data for highlighting
  const selectedCounty = stackedDots.find((d) => d.fips === selected);

  return (
    <section
      className="margin-distribution"
      aria-labelledby="margin-dist-title"
    >
      <div className="panel-heading">
        <div>
          <span className="section-kicker">Governor · 2026</span>
          <h2 id="margin-dist-title">County margin distribution</h2>
        </div>
      </div>
      <p className="chart-deck">
        Each dot represents one county, regardless of land area or vote total.
        Does not represent individual voters or the statewide margin.
      </p>
      <div className="chart-notice">
        <strong>This chart reflects unofficial, incomplete 2026 counts.</strong>
        Margins are percentage-point differences (Democratic minus Republican)
        from candidate votes including write-ins; blank and void ballots
        excluded.
      </div>

      <svg
        className="margin-plot"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        aria-label={`County margin distribution: ${validMargins.length} counties with reported margins, ${missingMargins.length} without`}
      >
        {/* Background grid - zero line */}
        <line
          className="zero-line"
          x1={scaleX(0)}
          y1={0}
          x2={scaleX(0)}
          y2={chartHeight}
        />

        {/* Axis line */}
        <line
          className="axis-line"
          x1={plotLeft}
          y1={chartHeight - 10}
          x2={chartWidth - plotRight}
          y2={chartHeight - 10}
        />

        {/* Tick marks */}
        {ticks.map((tick) => (
          <g key={tick} className="tick">
            <line
              x1={scaleX(tick)}
              y1={chartHeight - 10}
              x2={scaleX(tick)}
              y2={chartHeight - 4}
            />
            <text
              x={scaleX(tick)}
              y={chartHeight + 8}
              textAnchor="middle"
              dominantBaseline="hanging"
              className="tick-label"
            >
              {tick === 0 ? "0" : `${tick > 0 ? "+" : ""}${tick}`}
            </text>
          </g>
        ))}

        {/* Axis labels */}
        <text
          x={plotLeft}
          y={chartHeight - 18}
          textAnchor="start"
          className="axis-label"
          fill={republican}
        >
          Republican lead
        </text>
        <text
          x={chartWidth - plotRight}
          y={chartHeight - 18}
          textAnchor="end"
          className="axis-label"
          fill={democratic}
        >
          Democratic lead
        </text>

        {/* Stacked dots */}
        <g className="dots" aria-label="County margins">
          {stackedDots.map((dot) => {
            const isSelected = dot.fips === selected;
            const dotValue = dot.value!;
            return (
              <g
                key={dot.fips}
                className={`dot-stack ${isSelected ? "selected" : ""}`}
                transform={`translate(${dot.x}, ${dot.y})`}
              >
                {/* oxlint-disable jsx-a11y/prefer-tag-over-role */}
                <circle
                  className="dot"
                  r={dotRadius}
                  fill={electionColor(dotValue)}
                  stroke="#fff"
                  strokeWidth={isSelected ? 2 : 1}
                  onClick={() => onSelect(dot.fips)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(dot.fips);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Margin distribution: ${dot.name} County, ${marginLabel(dotValue)}`}
                  aria-pressed={isSelected}
                />
                {/* oxlint-enable jsx-a11y/prefer-tag-over-role */}
                <title>
                  {dot.name} County: {marginLabel(dotValue)}
                </title>
              </g>
            );
          })}
        </g>

        {/* Selected county indicator - vertical line */}
        {selectedCounty && (
          <g className="selection-indicator">
            <line
              x1={selectedCounty.x}
              y1={0}
              x2={selectedCounty.x}
              y2={chartHeight}
              stroke="#222"
              strokeWidth={1.5}
              strokeDasharray="4,3"
            />
            <text
              x={selectedCounty.x}
              y={chartHeight / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="selection-label"
              fill="#222"
            >
              {selectedCounty.name} County
            </text>
          </g>
        )}
      </svg>

      {/* Missing margins section */}
      {missingMargins.length > 0 && (
        <div className="missing-margins">
          <h3>Counties without reported margins</h3>
          <p>
            {missingMargins.length} count
            {"y" === String(missingMargins.length) ? "" : "ies"}
            {missingMargins.length === 1 ? " has" : " have"} no reported margin
            because candidate vote totals are unavailable or zero.
          </p>
          <div className="missing-list">
            {missingMargins.map((c) => (
              <button
                key={c.fips}
                className={c.fips === selected ? "selected" : ""}
                onClick={() => onSelect(c.fips)}
              >
                {c.name} County
                {c.fips === selected && (
                  <span className="missing-selected" aria-hidden="true">
                    ← selected
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="fine-print">
        Unofficial, incomplete counts; this distribution can change. Select a
        county to explore its results across all views.
      </p>
    </section>
  );
}
