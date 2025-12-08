import { render, screen } from "@testing-library/react";
import Progressbar from "../Progressbar";

describe("Progressbar", () => {
  test("sets the correct aria-label for current and total", () => {
    render(<Progressbar current={3} total={10} />);
    const bar = screen.getByRole("progressbar");

    expect(bar).toHaveAttribute("aria-label", "Frage 3 von 10");
  });

  test("calculates and applies correct width", () => {
    render(<Progressbar current={5} total={10} />);
    const bar = screen.getByRole("progressbar");
    const fillDiv = bar.firstChild as HTMLElement;

    expect(fillDiv).toHaveStyle("width: 50%");
  });

  test("limits current > total to total", () => {
    render(<Progressbar current={15} total={10} />);
    const bar = screen.getByRole("progressbar");

    expect(bar).toHaveAttribute("aria-label", "Frage 10 von 10");
  });

  test("sets progress to 0% when total = 0", () => {
    render(<Progressbar current={3} total={0} />);
    const bar = screen.getByRole("progressbar");
    const fillDiv = bar.firstChild as HTMLElement;

    expect(fillDiv).toHaveStyle("width: 0%");
  });
});
