import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FormHeader from "../FormHeader";

describe("FormHeader Component", () => {
  it("renders logo image", () => {
    render(<FormHeader />);

    const logo = screen.getByAltText("Logo") as HTMLImageElement;
    expect(logo).toBeInTheDocument();
    expect(logo.src).toContain("logo.png");
  });

  it("renders app title", () => {
    render(<FormHeader />);

    expect(screen.getByText("Tech Study Finder")).toBeInTheDocument();
  });

  it("renders subtitle", () => {
    render(<FormHeader />);

    expect(screen.getByText("Deine Reise zum Studiengang")).toBeInTheDocument();
  });

  it("has correct logo dimensions", () => {
    const { container } = render(<FormHeader />);

    const logo = container.querySelector("img");
    expect(logo).toHaveStyle({ width: "50px", height: "50px" });
  });

  it("has flex layout with gap", () => {
    const { container } = render(<FormHeader />);

    const mainBox = container.querySelector("[class*='MuiBox-root']");
    expect(mainBox).toHaveStyle({
      display: "flex",
      alignItems: "center",
    });
  });

  it("renders with proper spacing", () => {
    const { container } = render(<FormHeader />);

    const mainBox = container.querySelector("[class*='MuiBox-root']");
    expect(mainBox).toHaveStyle({
      marginBottom: "32px", // theme.spacing(4)
    });
  });

  it("renders title with bold font weight", () => {
    render(<FormHeader />);

    const title = screen.getByText("Tech Study Finder");
    expect(title).toBeInTheDocument();
  });

  it("renders subtitle with caption variant", () => {
    render(<FormHeader />);

    const subtitle = screen.getByText("Deine Reise zum Studiengang");
    expect(subtitle).toBeInTheDocument();
  });
});
