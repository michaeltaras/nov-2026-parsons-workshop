import { scaleLinear } from "d3";
import { democratic, republican } from "../utils/electionColors";
import { signedVotes } from "../utils/formatNumbers";

// A step chart from 2022 net votes to 2026 net votes. Every value is also in
// the row text, so the bars are decorative for screen readers.
export default function NetChangeBreakdown({
  net2022,
  net2026,
  shareEffect,
  volumeEffect,
}: {
  net2022: number;
  net2026: number;
  shareEffect: number;
  volumeEffect: number;
}) {
  const afterShare = net2022 + shareEffect;
  const steps = [
    {
      label: "2022 net votes",
      detail: "Hochul − Zeldin · certified",
      from: 0,
      to: net2022,
      color: "#b8b8b8",
    },
    {
      label: "From changing vote shares",
      detail: "Margin change at the average candidate-vote count",
      from: net2022,
      to: afterShare,
      color: shareEffect >= 0 ? democratic : republican,
    },
    {
      label: "From changing candidate-vote counts",
      detail: "Count change at the average margin",
      from: afterShare,
      to: net2026,
      color: volumeEffect >= 0 ? democratic : republican,
    },
    {
      label: "2026 net votes",
      detail: "Hochul − Blakeman · unofficial, incomplete",
      from: 0,
      to: net2026,
      color: "#555",
    },
  ];
  const values = steps.flatMap((step) => [step.from, step.to]);
  const position = scaleLinear()
    .domain([Math.min(0, ...values), Math.max(0, ...values)])
    .range([0, 100]);
  return (
    <ol className="net-steps" aria-label="Breakdown of the net-vote change">
      {steps.map((step, index) => {
        const isTotal = index === 0 || index === steps.length - 1;
        const left = position(Math.min(step.from, step.to));
        const width = Math.abs(position(step.to) - position(step.from));
        return (
          <li key={step.label} className={isTotal ? "total" : undefined}>
            <span className="net-step-label">
              {step.label}
              <small>{step.detail}</small>
            </span>
            <span className="net-step-track" aria-hidden="true">
              <i
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  background: step.color,
                }}
              />
            </span>
            <strong>
              {signedVotes(isTotal ? step.to : step.to - step.from)}
            </strong>
          </li>
        );
      })}
    </ol>
  );
}
