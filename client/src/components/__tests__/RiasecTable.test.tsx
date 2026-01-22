import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import RiasecTable from "../admin/RiasecTable";
import { BrowserRouter } from "react-router-dom";

type RiasecItem = {
  id: number;
  name: string;
  R: number | null;
  I: number | null;
  A: number | null;
  S: number | null;
  E: number | null;
  C: number | null;
};

describe("RiasecTable", () => {
  let fetchMock: typeof fetch;

  const items: RiasecItem[] = [
    { id: 1, name: "SG1", R: 1, I: 2, A: 3, S: 4, E: 5, C: 6 },
    { id: 2, name: "SG2", R: null, I: 2, A: 3, S: 4, E: 5, C: 6 },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    fetchMock = vi.fn() as unknown as typeof fetch;
    global.fetch = fetchMock;
  });

  it("renders table with items", () => {
    render(
      <BrowserRouter>
        <RiasecTable items={items} tableKey="studiengebiete" />
      </BrowserRouter>,
    );

    expect(screen.getByText("SG1")).toBeInTheDocument();
    expect(screen.getByText("SG2")).toBeInTheDocument();
    expect(screen.getAllByRole("row").length).toBeGreaterThan(1);
  });

  it("filters items by search term", () => {
    render(
      <BrowserRouter>
        <RiasecTable items={items} tableKey="studiengebiete" />
      </BrowserRouter>,
    );

    const input = screen.getByPlaceholderText("Suchen...");
    fireEvent.change(input, { target: { value: "SG1" } });

    expect(screen.getByText("SG1")).toBeInTheDocument();
    expect(screen.queryByText("SG2")).not.toBeInTheDocument();
  });

  it("shows 'No data' when items array is empty", () => {
    render(
      <BrowserRouter>
        <RiasecTable items={[]} tableKey="studiengebiete" />
      </BrowserRouter>,
    );

    expect(screen.getByText("Keine Daten verfügbar")).toBeInTheDocument();
  });

  it("opens edit dialog and updates input values", async () => {
    render(
      <BrowserRouter>
        <RiasecTable items={items} tableKey="studiengebiete" />
      </BrowserRouter>,
    );

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    fireEvent.click(editButtons[0]);

    const RInput = screen.getByLabelText("R") as HTMLInputElement;
    expect(RInput.value).toBe("1");

    fireEvent.change(RInput, { target: { value: "10" } });
    expect(RInput.value).toBe("10");
  });
});
