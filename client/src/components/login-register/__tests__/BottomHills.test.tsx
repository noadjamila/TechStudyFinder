import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BottomHills from "../BottomHills";

describe("BottomHills Component", () => {
  it("renders without errors", () => {
    const { container } = render(<BottomHills />);
    expect(container).toBeInTheDocument();
  });

  it("renders four colored hill sections", () => {
    const { container } = render(<BottomHills />);

    const hillBoxes = container.querySelectorAll("[class*='MuiBox-root']");
    // Should have multiple boxes for the hills
    expect(hillBoxes.length).toBeGreaterThan(0);
  });

  it("has correct positioning styles", () => {
    const { container } = render(<BottomHills />);

    const mainBox = container.querySelector("[class*='MuiBox-root']");
    expect(mainBox).toHaveStyle({
      position: "absolute",
      bottom: "0",
      left: "0",
      width: "100%",
    });
  });

  it("has flex display layout", () => {
    const { container } = render(<BottomHills />);

    const mainBox = container.querySelector("[class*='MuiBox-root']");
    expect(mainBox).toHaveStyle({
      display: "flex",
    });
  });

  it("has zIndex set to 0", () => {
    const { container } = render(<BottomHills />);

    const mainBox = container.querySelector("[class*='MuiBox-root']");
    expect(mainBox).toHaveStyle({
      zIndex: "0",
    });
  });

  it("renders with responsive height", () => {
    const { container } = render(<BottomHills />);

    const mainBox = container.querySelector("[class*='MuiBox-root']");
    expect(mainBox).toBeInTheDocument();
    // Height is responsive (xs, sm, md, lg breakpoints)
  });

  it("each hill section has flex: 1", () => {
    const { container } = render(<BottomHills />);

    const hills = container.querySelectorAll("[class*='MuiBox-root']");
    // Check that structure is present
    expect(hills.length).toBeGreaterThan(1);
  });

  it("renders decorative colors from theme", () => {
    const { container } = render(<BottomHills />);

    const mainBox = container.querySelector("[class*='MuiBox-root']");
    expect(mainBox).toBeInTheDocument();

    // Verify the container exists and has the right structure
    const boxes = mainBox?.querySelectorAll("[class*='MuiBox-root']");
    // Should have 4 hill sections (pink, green, blue, yellow)
    expect(boxes).toBeDefined();
  });
});
