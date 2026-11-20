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
      within(details).getByRole("heading", { name: "Albany County", level: 2 }),
    ).toBeInTheDocument();
    expect(within(details).getByText("77,604 votes")).toBeInTheDocument();
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
    const legend = screen.getByLabelText("County margin color scale");
    const swatches = legend.querySelectorAll(".swatches span");
    expect(swatches).toHaveLength(colors.length);
    colors.forEach((color, index) =>
      expect(swatches[index]).toHaveStyle({ background: color }),
    );
    expect(within(legend).getByText("Republican lead")).toBeInTheDocument();
    expect(within(legend).getByText("Democratic lead")).toBeInTheDocument();
    expect(
      within(legend).getByText("0", { selector: ".legend-zero-tick" }),
    ).toBeInTheDocument();
    expect(
      within(legend).getByText("Lead in percentage points · candidate votes"),
    ).toBeInTheDocument();
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
    expect(screen.getByText("3,631,374 votes")).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Interactive map.*unofficial 2026/),
    ).toBeInTheDocument();
    expect(screen.getByText(/12,076 of 13,187/)).toBeInTheDocument();
    expect(screen.getByText(/does not update live/)).toBeInTheDocument();
    expect(
      within(screen.getByLabelText("2026 statewide results")).queryByText(
        /Zeldin|certified 2022/,
      ),
    ).not.toBeInTheDocument();
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
    expect(within(details).getByText("228,579 votes")).toBeInTheDocument();
  });
  it("ranks current reported margins and links ranking selection to every view", () => {
    render(<App />);
    const rows = screen
      .getAllByRole("button")
      .filter((button) => button.classList.contains("rank-row"));
    expect(rows.map((row) => row.textContent)).toEqual([
      expect.stringContaining("Ontario"),
      expect.stringContaining("Broome"),
      expect.stringContaining("Suffolk"),
      expect.stringContaining("Nassau"),
      expect.stringContaining("Warren"),
      expect.stringContaining("Fulton"),
    ]);
    fireEvent.click(rows[0]);
    expect(screen.getByLabelText("Jump to a county")).toHaveValue("36069");
    expect(
      screen.getByRole("button", { name: /^Ontario County,/ }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("heading", { name: "Ontario County", level: 2 }),
    ).toBeInTheDocument();
  });
});

describe("Connected editorial analysis", () => {
  it("switches map encoding without losing selection and uses candidate votes for circle area", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText("Jump to a county"), {
      target: { value: "36001" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Vote circles" }));
    const map = screen.getByLabelText(/Interactive map.*vote circles/);
    expect(map.querySelectorAll(".vote-circle")).toHaveLength(62);
    expect(
      screen.getByRole("button", {
        name: /^Albany County,.*117,826 candidate votes/,
      }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByLabelText("Circle area represents reported candidate votes"),
    ).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("button", { name: /^Erie County,/ }), {
      key: "Enter",
    });
    expect(screen.getByLabelText("Jump to a county")).toHaveValue("36029");
    fireEvent.click(screen.getByRole("button", { name: "County map" }));
    expect(
      screen.getByRole("button", { name: /^Erie County,/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });
  it("links contribution and historical rows to map, county details, and each other", () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole("button", { name: /^Kings County contribution:/ }),
    );
    expect(
      screen.getByRole("heading", { name: "Kings County", level: 2 }),
    ).toBeInTheDocument();
    expect(
      within(screen.getByLabelText("Selected county contribution")).getByText(
        "+366,835",
      ),
    ).toBeInTheDocument();
    const history = screen.getByLabelText(
      "Selected county historical comparison",
    );
    expect(
      within(history).getByRole("heading", { name: "Kings County" }),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Show all 62 county comparisons" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: /^Albany County comparison:/ }),
    );
    expect(screen.getByLabelText("Jump to a county")).toHaveValue("36001");
    expect(
      screen.getByRole("button", { name: /^Albany County,/ }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      within(screen.getByLabelText("Selected county contribution")).getByText(
        "+37,814",
      ),
    ).toBeInTheDocument();
    expect(within(history).getByText("+16,324")).toBeInTheDocument();
    expect(
      screen.getByText(/Certified 2022 vs. incomplete 2026/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/not evidence of individual voters switching/),
    ).toBeInTheDocument();
  });
  it("shows both contribution directions and offers all counties behind the statewide sum", () => {
    render(<App />);
    const list = screen.getByLabelText("County net-vote contributions");
    expect(
      screen.getByText("2026 · Unofficial and incomplete"),
    ).toBeInTheDocument();
    expect(within(list).getAllByRole("button")).toHaveLength(8);
    expect(
      within(list).getAllByRole("button", { name: /toward Blakeman/ }),
    ).toHaveLength(4);
    expect(
      within(list).getAllByRole("button", { name: /toward Hochul/ }),
    ).toHaveLength(4);
    fireEvent.click(
      screen.getByRole("button", { name: "Show all 62 county contributions" }),
    );
    expect(within(list).getAllByRole("button")).toHaveLength(62);
    expect(
      within(screen.getByLabelText("Statewide net-vote arithmetic")).getByText(
        "+1,217,134",
      ),
    ).toBeInTheDocument();
  });
});
