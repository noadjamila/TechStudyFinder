import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import FavouritesNotLoggedIn from "../FavouritesNotLoggedIn";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("FavouritesNotLoggedIn Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the login prompt message", () => {
    render(
      <BrowserRouter>
        <FavouritesNotLoggedIn />
      </BrowserRouter>,
    );

    expect(
      screen.getByText("Logge dich ein, um deine Favoriten zu sehen."),
    ).toBeInTheDocument();
  });

  it("renders the login button", () => {
    render(
      <BrowserRouter>
        <FavouritesNotLoggedIn />
      </BrowserRouter>,
    );

    const loginButton = screen.getByRole("button", { name: /Login/i });
    expect(loginButton).toBeInTheDocument();
  });

  it("navigates to login page with redirect state when login button is clicked", () => {
    render(
      <BrowserRouter>
        <FavouritesNotLoggedIn />
      </BrowserRouter>,
    );

    const loginButton = screen.getByRole("button", { name: /Login/i });
    fireEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith("/login-register", {
      state: { redirectTo: "/favorites" },
    });
  });
});
