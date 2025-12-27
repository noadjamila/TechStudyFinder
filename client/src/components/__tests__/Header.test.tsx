import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LogoMenu from "../Header";
import "@testing-library/jest-dom";

describe("LogoMenu Component", () => {
  it("renders the Logo and Menu Icon", () => {
    render(<LogoMenu />);

    const logo = screen.getByAltText(/Logo/i);
    expect(logo).toBeInTheDocument();

    const menuIcon = screen.getByRole("button");
    expect(menuIcon).toBeInTheDocument();
  });

  it("opens and closes the menu", () => {
    render(<LogoMenu />);

    const menuIcon = screen.getByRole("button");
    fireEvent.click(menuIcon);
    expect(screen.getAllByRole("menuitem").length).toBeGreaterThan(0);

    // Menü schließen durch Menü-Eintrag
    fireEvent.click(screen.getByText("Impressum"));

    expect(screen.queryAllByRole("menuitem")).toHaveLength(0);

    // Re-query for menu items after closing the menu
    expect(screen.queryAllByRole("menuitem").length).toBe(0);
  });
});
