import React from "react";
import { render, screen } from "@testing-library/react";
import BackButton from "../buttons/Back_Button";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  custom: {
    secondaryBorder: "#ccc",
  },
} as any);

describe("ZurueckButton", () => {
  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

  test("renders with default label", () => {
    renderWithTheme(<BackButton onClick={() => {}} />);

    expect(
      screen.getByRole("button", { name: /zurück button/i }),
    ).toBeInTheDocument();
  });

  test("respects fullWidth prop", () => {
    renderWithTheme(<BackButton onClick={() => {}} fullWidth />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("MuiButton-fullWidth");
  });

  test("renders start icon", () => {
    renderWithTheme(<BackButton onClick={() => {}} />);

    expect(screen.getByTestId("ArrowBackIcon")).toBeInTheDocument();
  });
});
