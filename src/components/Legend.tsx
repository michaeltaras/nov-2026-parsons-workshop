import { colors } from "../utils/electionColors";
export default function Legend() {
  return (
    <div className="legend" aria-label="County margin color scale">
      <div className="legend-labels">
        <span>← Republican lead</span>
        <span>Democratic lead →</span>
      </div>
      <div className="swatches">
        {colors.map((color) => (
          <span key={color} style={{ background: color }} />
        ))}
      </div>
      <div className="legend-ticks">
        <span>30+</span>
        <span>15</span>
        <span>5</span>
        <span>0</span>
        <span>5</span>
        <span>15</span>
        <span>30+</span>
      </div>
      <p>Lead in percentage points · candidate votes</p>
    </div>
  );
}
