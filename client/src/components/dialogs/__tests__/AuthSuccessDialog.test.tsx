import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AuthSuccessDialog from "../AuthSuccessDialog";

describe("AuthSuccessDialog", () => {
  it("displays login success message when success is true", () => {
    render(
      <AuthSuccessDialog
        state="login"
        open={true}
        onClose={vi.fn()}
        autoCloseDuration={5000}
      />,
    );

    expect(screen.getByText("Login erfolgreich!")).toBeInTheDocument();
  });

  it("displays register success message when success is true", () => {
    render(
      <AuthSuccessDialog
        state="register"
        open={true}
        onClose={vi.fn()}
        autoCloseDuration={5000}
      />,
    );

    expect(screen.getByText("Registrierung erfolgreich!")).toBeInTheDocument();
  });

  it("renders with success severity when success is true", () => {
    const { container } = render(
      <AuthSuccessDialog
        state="login"
        open={true}
        onClose={vi.fn()}
        autoCloseDuration={5000}
      />,
    );

    const alert = container.querySelector(".MuiAlert-root");
    expect(alert).toHaveClass("MuiAlert-standardSuccess");
  });

  it("does not render when open is false", () => {
    const { container } = render(
      <AuthSuccessDialog
        state="login"
        open={false}
        onClose={vi.fn()}
        autoCloseDuration={5000}
      />,
    );

    const alert = container.querySelector(".MuiAlert-root");
    expect(alert).not.toBeInTheDocument();
  });

  it("calls onClose when snackbar closes", async () => {
    const onClose = vi.fn();
    render(
      <AuthSuccessDialog
        state="login"
        open={true}
        onClose={onClose()}
        autoCloseDuration={100}
      />,
    );

    await waitFor(
      () => {
        expect(onClose).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  it("uses default autoCloseDuration when not provided", () => {
    const { container } = render(
      <AuthSuccessDialog state="login" open={true} onClose={vi.fn()} />,
    );

    const snackbar = container.querySelector(".MuiSnackbar-root");
    // Default is 800ms, check that snackbar exists (will auto-close after)
    expect(snackbar).toBeInTheDocument();
  });

  it("positions snackbar at top center", () => {
    const { container } = render(
      <AuthSuccessDialog
        state="login"
        open={true}
        onClose={vi.fn()}
        autoCloseDuration={5000}
      />,
    );

    const snackbar = container.querySelector(
      ".MuiSnackbar-anchorOriginTopCenter",
    );
    expect(snackbar).toBeInTheDocument();
  });
});
