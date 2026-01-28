import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, beforeEach, vi } from "vitest";
import UploadSection from "../admin/UploadSection";

// XmlUpload mocken, damit wir Upload-Logik umgehen
vi.mock("../admin/XmlUploadField", () => ({
  default: ({ onUploaded }: any) => (
    <button
      data-testid="mock-upload"
      onClick={() =>
        onUploaded(new File(["<xml/>"], "dummy.xml", { type: "text/xml" }))
      }
    >
      Mock Upload
    </button>
  ),
}));

// StyledDialog mocken, wir wollen nur testen, ob onConfirm/onCancel aufgerufen wird
vi.mock("../dialogs/Dialog", () => ({
  default: ({ open, onConfirm, onCancel }: any) =>
    open ? (
      <div data-testid="mock-dialog">
        <button data-testid="confirm" onClick={onConfirm}>
          Confirm
        </button>
        <button data-testid="cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    ) : null,
}));

describe("UploadSection Component", () => {
  let onSubmit = vi.fn();

  beforeEach(() => {
    onSubmit = vi.fn();
  });

  test("does not show submit button before both files uploaded", () => {
    render(<UploadSection onSubmit={onSubmit} />);

    expect(
      screen.queryByText(/Datenbank aktualisieren/i),
    ).not.toBeInTheDocument();
  });

  test("shows submit button after both files uploaded", async () => {
    render(<UploadSection onSubmit={onSubmit} />);

    const uploadButtons = screen.getAllByTestId("mock-upload");
    fireEvent.click(uploadButtons[0]); // Studiengänge
    fireEvent.click(uploadButtons[1]); // Hochschulen

    expect(
      await screen.findByText(/Datenbank aktualisieren/i),
    ).toBeInTheDocument();
  });

  test("opens confirmation dialog when submit clicked", async () => {
    render(<UploadSection onSubmit={onSubmit} />);

    const uploadButtons = screen.getAllByTestId("mock-upload");
    fireEvent.click(uploadButtons[0]);
    fireEvent.click(uploadButtons[1]);

    const submitButton = await screen.findByText(/Datenbank aktualisieren/i);
    fireEvent.click(submitButton);

    expect(await screen.findByTestId("mock-dialog")).toBeInTheDocument();
  });

  test("calls onSubmit when confirming in dialog", async () => {
    render(<UploadSection onSubmit={onSubmit} />);

    const uploadButtons = screen.getAllByTestId("mock-upload");
    fireEvent.click(uploadButtons[0]);
    fireEvent.click(uploadButtons[1]);

    const submitButton = await screen.findByText(/Datenbank aktualisieren/i);
    fireEvent.click(submitButton);

    const confirmButton = await screen.findByTestId("confirm");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
      const callArg = onSubmit.mock.calls[0];
      expect(callArg[0]).toBeInstanceOf(File); // degreeprogrammeFile
      expect(callArg[1]).toBeInstanceOf(File); // institutionsFile
    });
  });

  test("closes dialog when cancel is clicked", async () => {
    render(<UploadSection onSubmit={onSubmit} />);

    const uploadButtons = screen.getAllByTestId("mock-upload");
    fireEvent.click(uploadButtons[0]);
    fireEvent.click(uploadButtons[1]);

    const submitButton = await screen.findByText(/Datenbank aktualisieren/i);
    fireEvent.click(submitButton);

    const cancelButton = await screen.findByTestId("cancel");
    fireEvent.click(cancelButton);

    expect(screen.queryByTestId("mock-dialog")).not.toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
