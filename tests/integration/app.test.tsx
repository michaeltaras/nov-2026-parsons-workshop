import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../../src/App";
import { colors, electionColor } from "../../src/utils/electionColors";
import { counties, margin } from "../../src/data/elections";
describe("Shared product behavior", () => {
  it("selects a county from the map and updates details, chart, and county control", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /^Albany County,/ }));
    const details = screen.getByRole("complementary", {
      name: "Selected county details",
    });
    expect(
      within(details).getByRole("heading", { name: "Albany County" }),
    ).toBeInTheDocument();
    expect(within(details).getByText("69,035 votes")).toBeInTheDocument();
    expect(screen.getByLabelText("Jump to a county")).toHaveValue("36001");
    expect(
      screen.getByText("Albany County", { selector: "strong" }),
    ).toBeInTheDocument();
  });
  it("supports keyboard selection and the accessible county picker", () => {
    render(<App />);
    fireEvent.keyDown(screen.getByRole("button", { name: /^Erie County,/ }), {
      key: "Enter",
    });
    expect(screen.getByLabelText("Jump to a county")).toHaveValue("36029");
    fireEvent.change(screen.getByLabelText("Jump to a county"), {
      target: { value: "36119" },
    });
    expect(
      screen.getByRole("button", { name: /^Westchester County,/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });
  it("keeps the legend and county map on the same shared color scale", () => {
    render(<App />);
    const swatches = screen
      .getByLabelText("County margin color scale")
      .querySelectorAll(".swatches span");
    expect(swatches).toHaveLength(colors.length);
    colors.forEach((color, index) =>
      expect(swatches[index]).toHaveStyle({ background: color }),
    );
    expect(
      screen.getByRole("button", { name: /^Albany County,/ }),
    ).toHaveAttribute("fill", electionColor(margin(counties[0])));
  });
  it("changes to the 2026 statewide snapshot without displaying historical county data as 2026", () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole("button", { name: "2026 Statewide snapshot" }),
    );
    expect(screen.getByText("Bruce Blakeman")).toBeInTheDocument();
    expect(screen.getByText("3,620,177 votes")).toBeInTheDocument();
    expect(screen.queryByLabelText(/Interactive map/)).not.toBeInTheDocument();
    expect(screen.getByText(/12,199 of 13,187/)).toBeInTheDocument();
    expect(screen.getByText(/does not update live/)).toBeInTheDocument();
  });
});
