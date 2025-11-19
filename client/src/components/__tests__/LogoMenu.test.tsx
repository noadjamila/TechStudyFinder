import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LogoMenu from "../LogoMenu/LogoMenu";
import "@testing-library/jest-dom";

describe("LogoMenu Component", () => {
  test("renders the Logo and Menu Icon", () => {
    render(<LogoMenu />);

    const logo = screen.getByAltText(/Logo/i);
    expect(logo).toBeInTheDocument();

    const menuIcon = screen.getByRole("button");
    expect(menuIcon).toBeInTheDocument();
  });

  test("opens and closes the menu", () => {
    render(<LogoMenu />);

    const menuIcon = screen.getByRole("button");
    fireEvent.click(menuIcon);

    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems.length).toBeGreaterThan(0);

    fireEvent.click(menuIcon);

    // Re-query for menu items after closing the menu
    expect(screen.queryAllByRole("menuitem").length).toBe(0);
  });
});
