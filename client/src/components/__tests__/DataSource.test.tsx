import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DataSource from "../DataSource";

describe("DataSource Component", () => {
  it("renders the HRK logo", () => {
    render(<DataSource />);
    const logo = screen.getByAltText("HRK Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src");
  });

  it("renders the attribution text", () => {
    render(<DataSource />);
    expect(
      screen.getByText(
        /Die Informationen über die Hochschulen und deren Studienangebote/i,
      ),
    ).toBeInTheDocument();
  });

  it("logo link has correct attributes", () => {
    const { container } = render(<DataSource />);
    const link = container.querySelector("a");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
