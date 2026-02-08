import { it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "../Register";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../../services/credentialsValidation", () => ({
  validateUsername: vi.fn(() => ({ valid: true })),
  validatePassword: vi.fn(() => ({ valid: true })),
}));

import {
  validateUsername,
  validatePassword,
} from "../../../services/credentialsValidation";

beforeEach(() => {
  vi.restoreAllMocks();
  global.fetch = vi.fn();
  (validateUsername as any).mockReturnValue({ valid: true });
  (validatePassword as any).mockReturnValue({ valid: true });
});

const renderRegister = (onSuccess = vi.fn()) =>
  render(
    <MemoryRouter>
      <Register onSuccess={onSuccess} />
    </MemoryRouter>,
  );

it("renders all input fields and buttons", () => {
  renderRegister();

  expect(screen.getByLabelText("Username")).toBeInTheDocument();

  expect(screen.getByLabelText("Password")).toBeInTheDocument();

  expect(
    screen.getByRole("button", { name: /registrieren/i }),
  ).toBeInTheDocument();
});

it("shows error when username is missing", async () => {
  renderRegister();

  fireEvent.click(screen.getByRole("button", { name: /registrieren/i }));

  expect(
    await screen.findByText("Bitte gib einen Username ein"),
  ).toBeInTheDocument();
});

it("shows error when username validation fails", async () => {
  (validateUsername as any).mockReturnValue({
    valid: false,
    message: "Username muss mindestens 5 Zeichen lang sein",
  });
  (validatePassword as any).mockReturnValue({ valid: true });

  renderRegister();

  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: "1" },
  });

  fireEvent.click(screen.getByRole("button", { name: /registrieren/i }));

  expect(
    await screen.findByText("Username muss mindestens 5 Zeichen lang sein"),
  ).toBeInTheDocument();
});

it("shows error when password validation fails", async () => {
  (validateUsername as any).mockReturnValue({ valid: true });
  (validatePassword as any).mockReturnValue({
    valid: false,
    message: "Passwort zu schwach",
  });

  renderRegister();

  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: "validuser" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "123" },
  });

  fireEvent.click(screen.getByRole("button", { name: /registrieren/i }));

  expect(await screen.findByText("Passwort zu schwach")).toBeInTheDocument();
});

it("shows error when passwords do not match", async () => {
  renderRegister();

  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "validuser" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "Password123!" },
  });

  fireEvent.change(screen.getByLabelText("Password-Confirm"), {
    target: { value: "OtherPassword!" },
  });

  fireEvent.click(screen.getByRole("button", { name: /registrieren/i }));

  expect(
    await screen.findByText("Passwörter stimmen nicht überein"),
  ).toBeInTheDocument();
});

it("shows error when username already exists", async () => {
  (global.fetch as any).mockResolvedValueOnce({
    ok: false,
    status: 409,
    json: vi.fn().mockResolvedValue({}),
  });

  renderRegister();

  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "existinguser" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "Password123!" },
  });

  fireEvent.change(screen.getByLabelText("Password-Confirm"), {
    target: { value: "Password123!" },
  });

  fireEvent.click(screen.getByRole("button", { name: /registrieren/i }));

  expect(
    await screen.findByText("Username existiert bereits"),
  ).toBeInTheDocument();
});

it("calls onSuccess on successful registration", async () => {
  const onSuccess = vi.fn();

  (global.fetch as any).mockResolvedValueOnce({
    ok: true,
    json: vi.fn().mockResolvedValue({}),
  });

  renderRegister(onSuccess);

  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "newuser" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "Password123!" },
  });

  fireEvent.change(screen.getByLabelText("Password-Confirm"), {
    target: { value: "Password123!" },
  });

  fireEvent.click(screen.getByRole("button", { name: /registrieren/i }));

  await waitFor(() => {
    expect(onSuccess).toHaveBeenCalled();
  });
});

it("submits form on Enter key", async () => {
  const onSuccess = vi.fn();

  (global.fetch as any).mockResolvedValueOnce({
    ok: true,
    json: vi.fn().mockResolvedValue({}),
  });

  renderRegister(onSuccess);

  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "enteruser" },
  });

  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "Password123!" },
  });

  fireEvent.change(screen.getByLabelText("Password-Confirm"), {
    target: { value: "Password123!" },
  });

  fireEvent.keyPress(screen.getByLabelText("Password-Confirm"), {
    key: "Enter",
    code: "Enter",
    charCode: 13,
  });

  await waitFor(() => {
    expect(onSuccess).toHaveBeenCalled();
  });
});
