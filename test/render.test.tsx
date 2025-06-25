import { expect, test, vi } from "vitest";
import { page, userEvent } from "@vitest/browser/context";
import { Button } from "react-aria-components";
import { render } from "../src/index";
import { HelloWorld } from "./fixtures/HelloWorld";
import { Counter } from "./fixtures/Counter";
import { SuspendedHelloWorld } from "./fixtures/SuspendedHelloWorld";

test("renders simple component", async () => {
  const screen = await render(<HelloWorld />);
  await expect.element(page.getByText("Hello World")).toBeVisible();
  expect(screen.container).toMatchSnapshot();
});

test("renders counter", async () => {
  const screen = await render(<Counter initialCount={1} />);

  await expect.element(screen.getByText("Count is 1")).toBeVisible();
  await screen.getByRole("button", { name: "Increment" }).click();
  await expect.element(screen.getByText("Count is 2")).toBeVisible();
});

test("should fire the onPress/onClick handler", async () => {
  const handler = vi.fn();
  const screen = await page.render(<Button onPress={handler}>Button</Button>);
  await userEvent.click(screen.getByRole("button"));
  // await screen.getByRole('button').click()
  expect(handler).toHaveBeenCalled();
});

test("waits for suspended boundaries", async () => {
  const { getByText } = await render(<SuspendedHelloWorld name="Vitest" />, {
    wrapper: ({ children }) => (
      <Suspense fallback={<div>Suspended!</div>}>{children}</Suspense>
    ),
  });
  await expect.element(getByText("Suspended!")).toBeInTheDocument();
  await expect.element(getByText("Hello Vitest")).toBeInTheDocument();
});
