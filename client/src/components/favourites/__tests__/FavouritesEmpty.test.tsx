import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import FavouritesEmpty from "../FavouritesEmpty";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("FavouritesEmpty Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the empty state message", () => {
    render(
      <BrowserRouter>
        <FavouritesEmpty />
      </BrowserRouter>,
    );

    expect(
      screen.getByText("Noch keine Favoriten vorhanden."),
    ).toBeInTheDocument();
  });

  it("renders the quiz start button", () => {
    render(
      <BrowserRouter>
        <FavouritesEmpty />
      </BrowserRouter>,
    );

    const quizButton = screen.getByRole("button", { name: /Quiz beginnen/i });
    expect(quizButton).toBeInTheDocument();
  });

  it("navigates to quiz page when quiz button is clicked", () => {
    render(
      <BrowserRouter>
        <FavouritesEmpty />
      </BrowserRouter>,
    );

    const quizButton = screen.getByRole("button", { name: /Quiz beginnen/i });
    fireEvent.click(quizButton);

    expect(mockNavigate).toHaveBeenCalledWith("/quiz");
  });
});
