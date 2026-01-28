import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, beforeEach, expect, vi } from "vitest";
import XmlUpload from "../admin/XmlUploadField";

// MUI Icons / Komponenten müssen nicht gemockt werden für Funktionalitätstest

describe("XmlUpload Component", () => {
  let onUploaded = vi.fn();
  let onRemoved = vi.fn();

  beforeEach(() => {
    onUploaded = vi.fn();
    onRemoved = vi.fn();
  });

  it("renders upload drop area", () => {
    render(
      <XmlUpload
        filename="test.xml"
        onUploaded={onUploaded}
        onRemoved={onRemoved}
      />,
    );
    expect(screen.getByText(/test\.xml hier ablegen/i)).toBeInTheDocument();
    expect(screen.getByText(/oder klicken zum Auswählen/i)).toBeInTheDocument();
  });

  it("shows error when non-XML file is uploaded", async () => {
    render(
      <XmlUpload
        filename="test.xml"
        onUploaded={onUploaded}
        onRemoved={onRemoved}
      />,
    );

    const file = new File(["content"], "test.txt", { type: "text/plain" });

    const input = screen.getByTestId("file-input");
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Bitte nur XML-Dateien hochladen.",
      );
    });

    expect(onUploaded).not.toHaveBeenCalled();
  });

  it("shows error when filename is incorrect", async () => {
    render(
      <XmlUpload
        filename="test.xml"
        onUploaded={onUploaded}
        onRemoved={onRemoved}
      />,
    );

    const file = new File(["content"], "wrong.xml", { type: "text/xml" });

    const input = screen.getByTestId("file-input");
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        'Die Datei muss den Namen "test.xml" haben.',
      );
    });

    expect(onUploaded).not.toHaveBeenCalled();
  });

  it("uploads valid XML file successfully", async () => {
    render(
      <XmlUpload
        filename="test.xml"
        onUploaded={onUploaded}
        onRemoved={onRemoved}
      />,
    );

    const file = new File(["<xml></xml>"], "test.xml", { type: "text/xml" });

    const input = screen.getByTestId("file-input");
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(
        screen.getByText(/Datei erfolgreich hochgeladen/i),
      ).toBeInTheDocument();
      expect(screen.getByText("test.xml")).toBeInTheDocument();
    });

    expect(onUploaded).toHaveBeenCalledWith(file);
  });

  it("removes uploaded file", async () => {
    render(
      <XmlUpload
        filename="test.xml"
        onUploaded={onUploaded}
        onRemoved={onRemoved}
      />,
    );

    const file = new File(["<xml></xml>"], "test.xml", { type: "text/xml" });
    const input = screen.getByTestId("file-input");
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => screen.getByText(/Datei erfolgreich hochgeladen/i));

    const deleteButton = screen.getByTestId("delete-button");
    fireEvent.click(deleteButton);

    expect(onRemoved).toHaveBeenCalled();
    expect(
      screen.queryByText(/Datei erfolgreich hochgeladen/i),
    ).not.toBeInTheDocument();
  });
});
