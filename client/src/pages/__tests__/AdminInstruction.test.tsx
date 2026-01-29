import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminInstructions from "../admin/AdminInstructions";

// Layout mocken
vi.mock("../../layouts/AdminLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

describe("AdminInstructions", () => {
  it("rendert die Hauptüberschrift", () => {
    render(<AdminInstructions />);

    expect(
      screen.getByRole("heading", { name: /Anleitung zur RIASEC-Zuordnung/i }),
    ).toBeInTheDocument();
  });

  it("rendert alle drei Accordions mit korrekten Titeln", () => {
    render(<AdminInstructions />);

    expect(
      screen.getByText(/Einführung in RIASEC und dessen Nutzung/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Erklärung des Mapping-Prozesses/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/RIASEC-Typen & Bewertung/i)).toBeInTheDocument();
  });

  it("rendered innerhalb des Layout-Mocks", () => {
    render(<AdminInstructions />);
    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });
});
