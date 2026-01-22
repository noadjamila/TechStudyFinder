import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import AdminEdit from "../admin/AdminEdit";
import { BrowserRouter } from "react-router-dom";

vi.mock("../../components/admin/RiasecTable", () => ({
  default: () => <div>RiasecTableMock</div>,
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("AdminEdit component", () => {
  let fetchMock: typeof fetch;

  beforeEach(() => {
    vi.resetAllMocks();

    // Mock global fetch
    fetchMock = vi.fn() as unknown as typeof fetch;
    global.fetch = fetchMock;
  });

  it("shows loading state initially", async () => {
    (
      fetchMock as unknown as { mockResolvedValueOnce: (value: any) => void }
    ).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        studiengebiete: [],
        studienfelder: [],
        studiengaenge: [],
      }),
    } as Response);

    render(
      <BrowserRouter>
        <AdminEdit />
      </BrowserRouter>,
    );

    expect(screen.getByText("Daten werden geladen...")).toBeInTheDocument();
  });

  it("renders RIASEC data after successful fetch", async () => {
    const mockData = {
      studiengebiete: [
        { id: 1, name: "SG1", R: 1, I: 2, A: 3, S: 4, E: 5, C: 6 },
      ],
      studienfelder: [
        { id: 2, name: "SF1", r: 1, i: 2, a: 3, s: 4, e: 5, c: 6 },
      ],
      studiengaenge: [],
    };

    (
      fetchMock as unknown as { mockResolvedValueOnce: (value: any) => void }
    ).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as Response);

    render(
      <BrowserRouter>
        <AdminEdit />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Studiengebiete")).toBeInTheDocument();
      expect(screen.getByText("Studienfelder")).toBeInTheDocument();
      expect(screen.getByText("Studiengänge")).toBeInTheDocument();

      // RiasecTableMock should appear twice (SG + SF)
      expect(screen.getAllByText("RiasecTableMock").length).toBe(2);
    });
  });

  it("shows error alert when fetch fails", async () => {
    (
      fetchMock as unknown as { mockRejectedValueOnce: (value: any) => void }
    ).mockRejectedValueOnce(new Error("Network error"));

    render(
      <BrowserRouter>
        <AdminEdit />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Fehler beim Laden der Daten"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Die Daten konnten nicht geladen werden. Bitte versuche es später erneut.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("shows warning when some RIASEC values are null", async () => {
    const mockData = {
      studiengebiete: [
        { id: 1, name: "SG1", R: null, I: 2, A: 3, S: 4, E: 5, C: 6 },
      ],
      studienfelder: [],
      studiengaenge: [],
    };

    (
      fetchMock as unknown as { mockResolvedValueOnce: (value: any) => void }
    ).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as Response);

    render(
      <BrowserRouter>
        <AdminEdit />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Warnung: Unvollständige RIASEC-Daten"),
      ).toBeInTheDocument();
    });
  });

  it("navigates to instructions page on click", async () => {
    (
      fetchMock as unknown as { mockResolvedValueOnce: (value: any) => void }
    ).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        studiengebiete: [],
        studienfelder: [],
        studiengaenge: [],
      }),
    } as Response);

    render(
      <BrowserRouter>
        <AdminEdit />
      </BrowserRouter>,
    );

    const button = screen.getByText("Erklärungen & Anleitungen");
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/admin/instructions");
  });
});
