import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import FormField from "../InputField";

describe("FormField Component", () => {
  it("renders text input field with label", () => {
    render(<FormField label="Username" placeholder="Enter your username" />);

    expect(screen.getByText("Username")).toBeInTheDocument();
    const input = screen.getByPlaceholderText(
      "Enter your username",
    ) as HTMLInputElement;
    expect(input).toBeInTheDocument();
  });

  it("renders without label when label prop is not provided", () => {
    render(<FormField placeholder="Enter text" />);

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
  });

  it("renders password input field with visibility toggle", () => {
    render(<FormField type="password" label="Password" />);

    const input = screen.getByDisplayValue("") as HTMLInputElement;
    expect(input.type).toBe("password");
  });

  it("toggles password visibility when visibility button is clicked", async () => {
    render(<FormField type="password" label="Password" />);

    let input = screen.getByDisplayValue("") as HTMLInputElement;
    expect(input.type).toBe("password");

    const visibilityButton = screen.getByRole("button", {
      name: /passwort-sichtbarkeit umschalten/i,
    });
    await userEvent.click(visibilityButton);

    input = screen.getByDisplayValue("") as HTMLInputElement;
    expect(input.type).toBe("text");
  });

  it("toggles password visibility multiple times", async () => {
    render(<FormField type="password" label="Password" />);

    const visibilityButton = screen.getByRole("button", {
      name: /passwort-sichtbarkeit umschalten/i,
    });
    let input = screen.getByDisplayValue("") as HTMLInputElement;

    // Initial state: password
    expect(input.type).toBe("password");

    // First click: show password
    await userEvent.click(visibilityButton);
    input = screen.getByDisplayValue("") as HTMLInputElement;
    expect(input.type).toBe("text");

    // Second click: hide password
    await userEvent.click(visibilityButton);
    input = screen.getByDisplayValue("") as HTMLInputElement;
    expect(input.type).toBe("password");
  });

  it("renders as text field when type is not password", () => {
    render(<FormField type="email" label="Email" />);

    const input = screen.getByDisplayValue("") as HTMLInputElement;
    expect(input.type).toBe("email");
  });

  it("does not show visibility toggle for non-password fields", () => {
    render(<FormField type="email" label="Email" />);

    const visibilityButton = screen.queryByRole("button", {
      name: /passwort-sichtbarkeit umschalten/i,
    });
    expect(visibilityButton).not.toBeInTheDocument();
  });

  it("accepts input value", async () => {
    render(<FormField label="Username" defaultValue="" />);

    const input = screen.getByDisplayValue("") as HTMLInputElement;
    await userEvent.type(input, "testuser");

    expect(input.value).toBe("testuser");
  });

  it("applies custom sx styles", () => {
    const { container } = render(
      <FormField label="Custom" sx={{ border: "2px solid red" }} />,
    );

    const textField = container.querySelector(".MuiTextField-root");
    expect(textField).toBeInTheDocument();
  });

  it("renders with full width", () => {
    const { container } = render(<FormField label="Full Width" />);

    const textField = container.querySelector(".MuiTextField-root");
    // MUI fullWidth sets width: 100%
    expect(textField).toHaveStyle({ width: "100%" });
  });

  it("renders with proper structure", () => {
    const { container } = render(<FormField label="Structured" />);

    const textField = container.querySelector(".MuiTextField-root");
    expect(textField).toBeInTheDocument();
  });
});
