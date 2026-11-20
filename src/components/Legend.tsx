import { colors } from "../utils/electionColors";
export default function Legend() {
  return (
    <div className="legend" aria-label="County margin color scale">
      <div className="legend-labels">
        <span>Republican lead</span>
        <span>Democratic lead</span>
      </div>
      <div className="legend-scale">
        <div className="swatches" aria-hidden="true">
          {colors.map((color) => (
            <span key={color} style={{ background: color }} />
          ))}
        </div>
        <span className="legend-zero-marker" aria-hidden="true" />
      </div>
      <div className="legend-ticks">
        {["30+", "15", "5", "0", "5", "15", "30+"].map((tick, index) => (
          <span
            className={index === 3 ? "legend-zero-tick" : undefined}
            key={`${tick}-${index}`}
          >
            {tick}
          </span>
        ))}
      </div>
      <p>Lead in percentage points · candidate votes</p>
    </div>
  );
}
