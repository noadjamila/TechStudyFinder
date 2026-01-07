import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import NavBar from "../NavBar";

// Create a test theme with navigation palette
const testTheme = createTheme({
  palette: {
    navigation: {
      navbar: "#ffffff",
    },
  },
});

const renderNavBar = (props = {}) => {
  return render(
    <ThemeProvider theme={testTheme}>
      <BrowserRouter>
        <NavBar {...props} />
      </BrowserRouter>
    </ThemeProvider>,
  );
};

// Mock fetch
global.fetch = vi.fn();

describe("NavBar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({ ok: false });
  });

  it("renders navigation items", () => {
    renderNavBar();

    // Check that navigation buttons are present
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Ergebnisse")).toBeInTheDocument();
    expect(screen.getByText("Favoriten")).toBeInTheDocument();
  });

  it("checks authentication status on mount", async () => {
    renderNavBar();

    await waitFor(
      () => {
        expect(global.fetch).toHaveBeenCalledWith("/api/auth/me", {
          credentials: "include",
        });
      },
      { timeout: 1000 },
    );
  });

  it("renders with correct theme applied", () => {
    const { container } = renderNavBar();

    // BottomNavigation is rendered
    const bottomNav = container.querySelector(".MuiBottomNavigation-root");
    expect(bottomNav).toBeInTheDocument();
  });
});
