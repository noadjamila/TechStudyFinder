import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import DropMenu from "../DropdownMenu";
import { useAuth } from "../../contexts/AuthContext";

vi.mock("../../contexts/AuthContext");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <DropMenu />
    </BrowserRouter>,
  );
};

describe("DropMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders menu button", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
    });

    renderComponent();
    expect(
      screen.getByRole("button", { name: /open menu/i }),
    ).toBeInTheDocument();
  });

  it("returns null when loading", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
    });

    renderComponent();
    expect(
      screen.queryByRole("button", { name: /open menu/i }),
    ).not.toBeInTheDocument();
  });

  it("displays 'Einloggen' when user is not logged in", async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
    });

    renderComponent();
    const button = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Einloggen")).toBeInTheDocument();
    });
  });

  it("displays 'Ausloggen' and 'Einstellungen' when user is logged in", async () => {
    mockUseAuth.mockReturnValue({
      user: { id: "1", name: "Test User" },
      isLoading: false,
    });

    renderComponent();
    const button = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Ausloggen")).toBeInTheDocument();
      expect(screen.getByText("Einstellungen")).toBeInTheDocument();
    });
  });

  it("always displays Impressum and Datenschutz", async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
    });

    renderComponent();
    const button = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Impressum")).toBeInTheDocument();
      expect(screen.getByText("Datenschutz")).toBeInTheDocument();
    });
  });

  it("opens menu when button is clicked", async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
    });

    renderComponent();
    const button = screen.getByRole("button", { name: /open menu/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Einloggen")).toBeInTheDocument();
    });
  });
});
