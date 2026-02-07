import { it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../Login";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const loginMock = vi.fn();

vi.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({
    login: loginMock,
  }),
}));

const renderLogin = (onSuccess = vi.fn()) =>
  render(
    <MemoryRouter>
      <Login onSuccess={onSuccess} />
    </MemoryRouter>,
  );

it("shows error when username is missing", async () => {
  renderLogin();

  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(
    await screen.findByText("Bitte gib einen Username ein"),
  ).toBeInTheDocument();
});

it("shows error when password is missing", async () => {
  renderLogin();

  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: "testuser" },
  });

  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(
    await screen.findByText("Bitte gib dein Passwort ein"),
  ).toBeInTheDocument();
});

it("calls login and onSuccess on successful login", async () => {
  loginMock.mockResolvedValueOnce(undefined);
  const onSuccess = vi.fn();

  renderLogin(onSuccess);

  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: "user" },
  });

  fireEvent.change(screen.getByLabelText("Passwort"), {
    target: { value: "password" },
  });

  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  await waitFor(() => {
    expect(loginMock).toHaveBeenCalledWith("user", "password");
    expect(onSuccess).toHaveBeenCalled();
  });
});

it("shows error and clears fields on failed login", async () => {
  loginMock.mockRejectedValueOnce(new Error("fail"));

  renderLogin();

  const usernameInput = screen.getByLabelText(/username/i);
  const passwordInput = screen.getByLabelText("Passwort");

  fireEvent.change(usernameInput, { target: { value: "user" } });
  fireEvent.change(passwordInput, { target: { value: "wrong" } });

  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(
    await screen.findByText("Login fehlgeschlagen - bitte versuche es erneut!"),
  ).toBeInTheDocument();

  expect(usernameInput).toHaveValue("");
  expect(passwordInput).toHaveValue("");
});

it("submits login on Enter key", async () => {
  loginMock.mockResolvedValueOnce(undefined);
  const onSuccess = vi.fn();

  renderLogin(onSuccess);

  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: "user" },
  });

  fireEvent.change(screen.getByLabelText("Passwort"), {
    target: { value: "password" },
  });

  fireEvent.keyPress(screen.getByLabelText("Passwort"), {
    key: "Enter",
    code: "Enter",
    charCode: 13,
  });

  await waitFor(() => {
    expect(onSuccess).toHaveBeenCalled();
  });
});

it("disables login button while loading", async () => {
  loginMock.mockImplementation(
    () => new Promise(() => {}), // never resolves
  );

  renderLogin();

  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: "user" },
  });
  fireEvent.change(screen.getByLabelText("Passwort"), {
    target: { value: "password" },
  });

  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  await waitFor(() => {
    expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
  });
});
