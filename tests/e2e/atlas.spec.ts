import { test, expect } from "@playwright/test";
test("county map, details, and comparison work at this viewport", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "New York Governor Election Results",
  );
  const map = page.getByLabel(/Interactive map of 62/);
  await expect(map.locator("path")).toHaveCount(62);
  await page.getByRole("button", { name: /^Albany County,/ }).click();
  await expect(
    page.getByRole("heading", { name: "Albany County", level: 2 }),
  ).toBeVisible();
  await expect(page.getByLabel("Jump to a county")).toHaveValue("36001");
  await page.getByLabel("Jump to a county").selectOption("36119");
  await expect(
    page.getByRole("heading", { name: "Westchester County", level: 2 }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});
test("2026 snapshot is honest, and the app makes no external runtime requests", async ({
  page,
}) => {
  const external: string[] = [];
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:5173")) {
      external.push(request.url());
    }
  });
  await page.goto("/");
  await expect(page.getByText("3,620,177 votes")).toBeVisible();
  await expect(
    page.getByText("2026 results are unofficial and incomplete."),
  ).toBeVisible();
  await expect(
    page.getByLabel(/Interactive map.*unofficial 2026/),
  ).toBeVisible();
  await page.getByLabel("Jump to a county").selectOption("36119");
  await expect(page.getByText("0 of 906 districts reporting")).toBeVisible();
  await expect(page.getByText("225,858 votes")).toBeVisible();
  await expect(
    page.getByText(/The source reports votes alongside 0 districts/),
  ).toBeVisible();
  expect(external).toEqual([]);
});

test("vote circles, contributions, and historical comparison share selection", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Vote circles", exact: true }).click();
  const map = page.getByLabel(/Interactive map.*vote circles/);
  await expect(map.locator(".vote-circle")).toHaveCount(62);
  // A correct radius formula can still mislead if the legend SVG scales
  // differently from the map. Compare their actual rendered diameters.
  // Measure the rendered circle centerlines. Decorative outlines are not part
  // of the vote-area encoding (boundingBox also includes those outlines).
  const mapDiameter = await page
    .getByRole("button", { name: /^Albany County,/ })
    .locator(".vote-circle")
    .evaluate((element) => {
      const circle = element as SVGCircleElement;
      const transform = circle.getScreenCTM()!;
      return (
        2 *
        Number(circle.getAttribute("r")) *
        Math.hypot(transform.a, transform.b)
      );
    });
  const legendDiameter = await page
    .getByLabel("Circle area represents reported candidate votes")
    .locator('circle[data-votes="500000"]')
    .evaluate((element) => {
      const circle = element as SVGCircleElement;
      const transform = circle.getScreenCTM()!;
      return (
        2 *
        Number(circle.getAttribute("r")) *
        Math.hypot(transform.a, transform.b)
      );
    });
  expect((mapDiameter / legendDiameter) ** 2).toBeCloseTo(115976 / 500000, 3);
  await page.getByRole("button", { name: /^Albany County,/ }).click();
  await expect(page.getByLabel("Jump to a county")).toHaveValue("36001");
  await page
    .getByRole("button", { name: /^Kings County contribution:/ })
    .click();
  await expect(page.getByLabel("Jump to a county")).toHaveValue("36047");
  await expect(
    page.getByLabel("Selected county contribution").getByText("+366,835"),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Show all 62 county comparisons" })
    .click();
  await page
    .getByRole("button", { name: /^Albany County comparison:/ })
    .click();
  await expect(page.getByLabel("Jump to a county")).toHaveValue("36001");
  await expect(
    page
      .getByLabel("Selected county historical comparison")
      .getByText("+15,302"),
  ).toBeVisible();
  await expect(
    page.getByText("Certified 2022 vs. incomplete 2026."),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});

test("NYC close-up selects counties, stays in sync, and fits the viewport", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /NYC close-up/ }).click();
  const inset = page.getByRole("toolbar", { name: "New York City, enlarged" });
  await expect(inset.getByRole("button")).toHaveCount(5);
  await inset
    .getByRole("button", { name: /^Brooklyn \(Kings County\),/ })
    .click();
  await expect(
    page.getByRole("heading", { name: "Kings County", level: 2 }),
  ).toBeVisible();
  await expect(page.getByLabel("Jump to a county")).toHaveValue("36047");
  await expect(
    page.getByRole("button", { name: /^Kings County,/ }),
  ).toHaveAttribute("aria-pressed", "true");
  // Keyboard: arrows move north through the boroughs, Enter selects, and one
  // Tab leaves the close-up.
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("ArrowUp");
  await expect(
    inset.getByRole("button", { name: /^Manhattan \(New York County\),/ }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "New York County", level: 2 }),
  ).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Jump to a county")).toBeFocused();
  // The main map's selection is reflected in the close-up.
  await page.getByLabel("Jump to a county").selectOption("36085");
  await expect(
    inset.getByRole("button", { name: /^Staten Island \(Richmond County\),/ }),
  ).toHaveAttribute("aria-pressed", "true");
  // The close-up fits the screen width and sits above, not over, the legend.
  const insetBox = (await inset.boundingBox())!;
  const legendBox = (await page
    .getByLabel("County margin color scale")
    .boundingBox())!;
  expect(insetBox.x).toBeGreaterThanOrEqual(0);
  expect(insetBox.x + insetBox.width).toBeLessThanOrEqual(
    page.viewportSize()!.width,
  );
  expect(insetBox.y + insetBox.height).toBeLessThanOrEqual(legendBox.y);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});
