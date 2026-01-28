import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import AdminEdit from "../admin/AdminEdit";
import { BrowserRouter } from "react-router-dom";
import { AdminAuthProvider } from "../../contexts/AdminAuthContext";

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

const mockFetch = vi.fn();
global.fetch = mockFetch as any;

// Helper to create a mock response
const createMockResponse = (data: any, ok: boolean = true) =>
  ({
    ok,
    status: ok ? 200 : 401,
    json: async () => data,
  }) as Response;

describe("AdminEdit component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockFetch.mockClear();
  });

  it("shows loading state initially", async () => {
    // Mock /api/admin/me call from AdminAuthProvider
    mockFetch.mockResolvedValueOnce(createMockResponse(null, false));
    // Mock /api/admin/riasec-data call from AdminEdit
    mockFetch.mockResolvedValueOnce(
      createMockResponse({
        studiengebiete: [],
        studienfelder: [],
        studiengaenge: [],
      }),
    );

    render(
      <BrowserRouter>
        <AdminAuthProvider>
          <AdminEdit />
        </AdminAuthProvider>
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

    // Mock fetch to handle both calls
    mockFetch.mockImplementation((url: string) => {
      if (url.includes("/api/admin/me")) {
        return Promise.resolve(createMockResponse(null, false));
      }
      if (url.includes("/api/admin/riasec-data")) {
        return Promise.resolve(createMockResponse(mockData));
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    render(
      <BrowserRouter>
        <AdminAuthProvider>
          <AdminEdit />
        </AdminAuthProvider>
      </BrowserRouter>,
    );

    // Wait for loading to finish
    await waitFor(
      () => {
        expect(
          screen.queryByText("Daten werden geladen..."),
        ).not.toBeInTheDocument();
      },
      { timeout: 3000 },
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
    // Mock /api/admin/me call from AdminAuthProvider
    mockFetch.mockResolvedValueOnce(createMockResponse(null, false));
    // Mock /api/admin/riasec-data call from AdminEdit - fails
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(
      <BrowserRouter>
        <AdminAuthProvider>
          <AdminEdit />
        </AdminAuthProvider>
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

    // Mock fetch to handle both calls
    mockFetch.mockImplementation((url: string) => {
      if (url.includes("/api/admin/me")) {
        return Promise.resolve(createMockResponse(null, false));
      }
      if (url.includes("/api/admin/riasec-data")) {
        return Promise.resolve(createMockResponse(mockData));
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    render(
      <BrowserRouter>
        <AdminAuthProvider>
          <AdminEdit />
        </AdminAuthProvider>
      </BrowserRouter>,
    );

    // Wait for loading to finish
    await waitFor(
      () => {
        expect(
          screen.queryByText("Daten werden geladen..."),
        ).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    await waitFor(() => {
      expect(
        screen.getByText("Warnung: Unvollständige RIASEC-Daten"),
      ).toBeInTheDocument();
    });
  });

  it("navigates to instructions page on click", async () => {
    // Mock /api/admin/me call from AdminAuthProvider
    mockFetch.mockResolvedValueOnce(createMockResponse(null, false));
    // Mock /api/admin/riasec-data call from AdminEdit
    mockFetch.mockResolvedValueOnce(
      createMockResponse({
        studiengebiete: [],
        studienfelder: [],
        studiengaenge: [],
      }),
    );

    render(
      <BrowserRouter>
        <AdminAuthProvider>
          <AdminEdit />
        </AdminAuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      const button = screen.getByText("Erklärungen & Anleitungen");
      fireEvent.click(button);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/admin/instructions");
  });
});
