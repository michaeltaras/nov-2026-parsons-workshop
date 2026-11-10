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
    expect(within(details).getByText("76,171 votes")).toBeInTheDocument();
    expect(within(details).getByText("Bruce Blakeman")).toBeInTheDocument();
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
  it("starts with 2026 county results and explains incomplete reporting", () => {
    render(<App />);
    expect(
      within(screen.getByLabelText("2026 statewide results")).getByText(
        "Bruce Blakeman",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("3,620,177 votes")).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Interactive map.*unofficial 2026/),
    ).toBeInTheDocument();
    expect(screen.getByText(/12,199 of 13,187/)).toBeInTheDocument();
    expect(screen.getByText(/does not update live/)).toBeInTheDocument();
    expect(screen.queryByText(/Zeldin|certified 2022/)).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Jump to a county"), {
      target: { value: "36119" },
    });
    const details = screen.getByRole("complementary", {
      name: "Selected county details",
    });
    expect(
      within(details).getByText("0 of 906 districts reporting"),
    ).toBeInTheDocument();
    expect(
      within(details).getByText(/unscanned emergency ballots/),
    ).toBeInTheDocument();
    expect(within(details).getByText("225,858 votes")).toBeInTheDocument();
  });
  it("ranks current reported margins and links ranking selection to every view", () => {
    render(<App />);
    const rows = screen
      .getAllByRole("button")
      .filter((button) => button.classList.contains("rank-row"));
    expect(rows.map((row) => row.textContent)).toEqual([
      expect.stringContaining("Broome"),
      expect.stringContaining("Ontario"),
      expect.stringContaining("Suffolk"),
      expect.stringContaining("Nassau"),
      expect.stringContaining("Warren"),
      expect.stringContaining("Putnam"),
    ]);
    fireEvent.click(rows[0]);
    expect(screen.getByLabelText("Jump to a county")).toHaveValue("36007");
    expect(
      screen.getByRole("button", { name: /^Broome County,/ }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("heading", { name: "Broome County" }),
    ).toBeInTheDocument();
  });
});
