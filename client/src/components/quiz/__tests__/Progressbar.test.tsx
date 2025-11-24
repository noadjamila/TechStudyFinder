import { render, screen } from "@testing-library/react";
import Progressbar from "../Progressbar";

describe("Progressbar", () => {
  test("renders the current und total progressindex correctly", () => {
    render(<Progressbar current={3} total={10} />);
    expect(screen.getByText("Frage 3 von 10")).toBeInTheDocument();
  });

  test("calculates the progress correctly", () => {
    render(<Progressbar current={5} total={10} />);
    const fillDiv = screen.getByRole("progressbar").firstChild as HTMLElement;
    expect(fillDiv).toHaveStyle("width: 50%");
  });

  test("limits current to total if current > total", () => {
    render(<Progressbar current={15} total={10} />);
    expect(screen.getByText("Frage 10 von 10")).toBeInTheDocument();
  });

  test("sets progress to 0% when total = 0", () => {
    render(<Progressbar current={3} total={0} />);
    const fillDiv = screen.getByRole("progressbar").firstChild as HTMLElement;
    expect(fillDiv).toHaveStyle("width: 0%");
  });
});
