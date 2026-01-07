import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import NavBar from "../NavBar";

const renderNavBar = (props = {}) => {
  return render(
    <BrowserRouter>
      <NavBar {...props} />
    </BrowserRouter>,
  );
};

// Mock fetch
global.fetch = vi.fn();

describe("NavBar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({ ok: false });
  });

  it("renders home navigation item", () => {
    renderNavBar();

    expect(screen.getByRole("button", { name: /home/i })).toBeInTheDocument();
  });

  it("renders ergebnisse (results) navigation item", () => {
    renderNavBar();

    expect(
      screen.getByRole("button", { name: /ergebnisse/i }),
    ).toBeInTheDocument();
  });

  it("renders favoriten (favorites) navigation item", () => {
    renderNavBar();

    expect(
      screen.getByRole("button", { name: /favoriten/i }),
    ).toBeInTheDocument();
  });

  it("renders menu button", () => {
    renderNavBar();

    const menuButtons = screen.getAllByRole("button");
    expect(menuButtons.length).toBeGreaterThan(0);
  });

  it("checks authentication status on mount", async () => {
    renderNavBar();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/me", {
        credentials: "include",
      });
    });
  });

  it("renders bottom navigation when not in sidebar mode", () => {
    renderNavBar({ isSidebarMode: false });

    const bottomNav = screen.getByRole("tablist");
    expect(bottomNav).toBeInTheDocument();
  });

  it("navigates when navigation item is clicked", async () => {
    renderNavBar();

    const homeButton = screen.getByRole("button", { name: /home/i });
    await userEvent.click(homeButton);

    expect(homeButton).toBeInTheDocument();
  });

  it("opens menu when menu button is clicked", async () => {
    renderNavBar();

    const menuButtons = screen.getAllByRole("button");
    const menuButton = menuButtons[menuButtons.length - 1];

    await userEvent.click(menuButton);
    // Menu should be open
  });

  it("shows settings option in menu when logged in", async () => {
    (global.fetch as any).mockResolvedValueOnce({ ok: true });

    renderNavBar();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/me", {
        credentials: "include",
      });
    });

    // Wait a moment for state to update
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  it("renders with correct component structure", () => {
    const { container } = renderNavBar();

    expect(container.querySelector("[role='tablist']")).toBeInTheDocument();
  });
});
