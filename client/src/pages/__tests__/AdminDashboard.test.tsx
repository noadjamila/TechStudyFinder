import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminDashboard from "../admin/AdminDashboard";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../layouts/AdminLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

describe("AdminDashboard", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("rendert Überschrift und Willkommenstext", () => {
    render(<AdminDashboard />);

    expect(
      screen.getByRole("heading", { name: /admin dashboard/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/willkommen zum admin-bereich/i),
    ).toBeInTheDocument();
  });

  it("rendert alle drei Admin-Karten", () => {
    render(<AdminDashboard />);

    expect(screen.getByText("Daten aktualiseren")).toBeInTheDocument();
    expect(screen.getByText("Daten verwalten")).toBeInTheDocument();
    expect(screen.getByText("Anleitungen")).toBeInTheDocument();
  });

  it("navigiert zu /admin/upload beim Klick auf 'Daten aktualiseren'", () => {
    render(<AdminDashboard />);

    fireEvent.click(screen.getByText("Daten aktualiseren"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/upload");
  });

  it("navigiert zu /admin/edit beim Klick auf 'Daten verwalten'", () => {
    render(<AdminDashboard />);

    fireEvent.click(screen.getByText("Daten verwalten"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/edit");
  });

  it("navigiert zu /admin/instructions beim Klick auf 'Anleitungen'", () => {
    render(<AdminDashboard />);

    fireEvent.click(screen.getByText("Anleitungen"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin/instructions");
  });
});
