import { test, expect } from "@playwright/test";
test("county map, details, and comparison work at this viewport", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "New York, by the vote.",
  );
  const map = page.getByLabel(/Interactive map of 62/);
  await expect(map.locator("path")).toHaveCount(62);
  await page.getByRole("button", { name: /^Albany County,/ }).click();
  await expect(
    page.getByRole("heading", { name: "Albany County" }),
  ).toBeVisible();
  await expect(page.getByLabel("Jump to a county")).toHaveValue("36001");
  await page.getByLabel("Jump to a county").selectOption("36119");
  await expect(
    page.getByRole("heading", { name: "Westchester County" }),
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
    if (!request.url().startsWith("http://127.0.0.1:5173"))
      external.push(request.url());
  });
  await page.goto("/");
  await page.getByRole("button", { name: "2026 Statewide snapshot" }).click();
  await expect(page.getByText("3,620,177 votes")).toBeVisible();
  await expect(
    page.getByText("2026 results are unofficial and incomplete."),
  ).toBeVisible();
  await expect(page.getByLabel(/Interactive map/)).toHaveCount(0);
  await page
    .getByRole("button", { name: /Explore the certified 2022 county map/ })
    .click();
  await expect(page.getByLabel(/Interactive map of 62/)).toBeVisible();
  expect(external).toEqual([]);
});
