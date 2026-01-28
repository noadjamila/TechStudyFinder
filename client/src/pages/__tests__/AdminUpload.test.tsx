import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, beforeEach, expect, vi } from "vitest";
import AdminUpload from "../admin/AdminUpload";

vi.mock("../../layouts/AdminLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

vi.mock("../../components/admin/UploadSection", () => ({
  default: ({ onSubmit }: any) => (
    <button
      data-testid="upload-button"
      onClick={() =>
        onSubmit(
          new File(["<xml />"], "degree.xml", { type: "text/xml" }),
          new File(["<xml />"], "institutions.xml", { type: "text/xml" }),
        )
      }
    >
      Upload
    </button>
  ),
}));

vi.mock("../../components/admin/Spinner", () => ({
  default: ({ text }: { text: string }) => (
    <div data-testid="spinner">{text}</div>
  ),
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("AdminUpload Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page header", () => {
    render(<AdminUpload />);

    expect(screen.getByText("Daten aktualisieren")).toBeInTheDocument();
  });

  it("shows error if files are missing", async () => {
    // UploadSection überschreiben → onSubmit mit null
    vi.doMock("../../components/admin/UploadSection", () => ({
      default: ({ onSubmit }: any) => (
        <button
          data-testid="upload-button"
          onClick={() => onSubmit(null, null)}
        >
          Upload
        </button>
      ),
    }));

    const { default: Component } = await import("../admin/AdminUpload");

    render(<Component />);

    fireEvent.click(screen.getByTestId("upload-button"));

    const alert = await screen.findByRole("alert");
    expect(alert);
  });

  it("shows spinner while processing", async () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));

    render(<AdminUpload />);

    fireEvent.click(screen.getByTestId("upload-button"));

    expect(await screen.findByTestId("spinner")).toBeInTheDocument();
  });

  it("shows success alert on successful upload", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      headers: {
        get: () => "application/json",
      },
      json: async () => ({ success: true }),
    });

    render(<AdminUpload />);

    fireEvent.click(screen.getByTestId("upload-button"));

    expect(
      await screen.findByText("Datenbank erfolgreich aktualisiert!"),
    ).toBeInTheDocument();
  });

  it("shows backend error message on failed upload", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      headers: {
        get: () => "application/json",
      },
      json: async () => ({
        error: "Datenbankfehler",
      }),
    });

    render(<AdminUpload />);

    fireEvent.click(screen.getByTestId("upload-button"));

    expect(await screen.findByText("Datenbankfehler")).toBeInTheDocument();
  });

  it("handles non-JSON error response", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      headers: {
        get: () => null,
      },
    });

    render(<AdminUpload />);

    fireEvent.click(screen.getByTestId("upload-button"));

    expect(await screen.findByText(/HTTP-Fehler/)).toBeInTheDocument();
  });
});
