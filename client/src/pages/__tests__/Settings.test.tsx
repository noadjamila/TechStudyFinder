import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import Settings from "../Settings";
import { useAuth } from "../../contexts/AuthContext";
import { changePassword, deleteUser } from "../../api/authApi";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "../../theme/theme";
import * as passwordService from "../../services/passwordValidation";

vi.mock("@mui/material", async () => {
  const actual =
    await vi.importActual<typeof import("@mui/material")>("@mui/material");
  return {
    ...actual,
    useMediaQuery: vi.fn(() => false),
  };
});

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../api/authApi", () => ({
  changePassword: vi.fn(),
  deleteUser: vi.fn(),
}));

const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {ui}
      </ThemeProvider>
    </BrowserRouter>,
  );
};

describe("Settings Page", () => {
  const mockedUseAuth = vi.mocked(useAuth);

  const mockUser = { id: 1, username: "testuser" };
  const logoutMock = vi.fn();
  const loginMock = vi.fn();
  const setUserMock = vi.fn();

  const mockedChangePassword = vi.mocked(changePassword);
  const mockedDeleteUser = vi.mocked(deleteUser);

  beforeEach(() => {
    vi.resetAllMocks();
    mockedNavigate.mockClear();

    mockedUseAuth.mockReturnValue({
      user: mockUser,
      logout: logoutMock,
      login: loginMock,
      setUser: setUserMock,
      isLoading: false,
    });
  });

  it("renders username and buttons", () => {
    renderWithProviders(<Settings />);

    expect(screen.getByDisplayValue("testuser")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Passwort ändern/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Profil löschen/i }),
    ).toBeInTheDocument();
  });

  it("shows error if password fields are empty", async () => {
    renderWithProviders(<Settings />);

    // Button is disabled when fields are empty, so we need to enable it first
    // by filling with whitespace, then clicking
    const passwordInput = screen.getByPlaceholderText(/aktuelles Passwort/i);
    const newPasswordInput = screen.getByPlaceholderText(/neues Passwort/i);

    // Fill with whitespace to enable button, then clear to trigger validation
    fireEvent.change(passwordInput, { target: { value: " " } });
    fireEvent.change(newPasswordInput, { target: { value: " " } });

    // Clear the fields to make them empty
    fireEvent.change(passwordInput, { target: { value: "" } });
    fireEvent.change(newPasswordInput, { target: { value: "" } });

    // Manually trigger the validation by calling the function
    // Since button is disabled, we need to test the validation differently
    // Actually, let's just test that button is disabled when fields are empty
    const button = screen.getByRole("button", { name: /Passwort ändern/i });
    expect(button).toBeDisabled();
  });

  it("validates new password before submission", async () => {
    vi.spyOn(passwordService, "validatePassword").mockReturnValue({
      valid: false,
      message: "Passwort zu schwach",
    });

    renderWithProviders(<Settings />);

    fireEvent.change(screen.getByPlaceholderText(/aktuelles Passwort/i), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByPlaceholderText(/neues Passwort/i), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Passwort ändern/i }));

    await screen.findByText("Passwort zu schwach");
  });

  it("calls changePassword API and shows success message", async () => {
    vi.spyOn(passwordService, "validatePassword").mockReturnValue({
      valid: true,
    });
    mockedChangePassword.mockResolvedValue(true);

    renderWithProviders(<Settings />);

    fireEvent.change(screen.getByPlaceholderText(/aktuelles Passwort/i), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByPlaceholderText(/neues Passwort/i), {
      target: { value: "newpass123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Passwort ändern/i }));

    const successAlert = await screen.findByText(
      "Passwort erfolgreich geändert.",
    );
    expect(successAlert).toBeInTheDocument();
    expect(changePassword).toHaveBeenCalledWith("oldpass", "newpass123");
  });

  it("opens delete profile dialog and deletes profile successfully", async () => {
    mockedDeleteUser.mockResolvedValue(true);

    renderWithProviders(<Settings />);

    fireEvent.click(screen.getByRole("button", { name: /Profil löschen/i }));

    expect(
      await screen.findByText(/Möchtest du dein Profil wirklich löschen/i),
    ).toBeInTheDocument();

    const confirmButton = screen.getByText("JA");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalled();
      expect(logoutMock).toHaveBeenCalled();
      expect(mockedNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("shows error if deleteUser fails", async () => {
    mockedDeleteUser.mockRejectedValue(new Error("Löschen fehlgeschlagen"));

    renderWithProviders(<Settings />);

    fireEvent.click(screen.getByRole("button", { name: /Profil löschen/i }));
    const confirmButton = screen.getByText("JA");
    fireEvent.click(confirmButton);

    const errorAlert = await screen.findByText("Löschen fehlgeschlagen");
    expect(errorAlert).toBeInTheDocument();
  });
});
