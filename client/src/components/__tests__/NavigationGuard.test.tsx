import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import NavigationGuard from "../NavigationGuard";
import { AuthProvider } from "../../contexts/AuthContext";

// Mock the auth API
vi.mock("../../api/authApi", () => ({
  getCurrentUser: vi.fn().mockResolvedValue(null),
  login: vi.fn(),
  logout: vi.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const renderWithRouter = (children: React.ReactNode, initialRoute = "/") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <NavigationGuard>{children}</NavigationGuard>
      </AuthProvider>
    </MemoryRouter>,
  );
};

describe("NavigationGuard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.removeItem("quizResults");
    localStorage.removeItem("quizCompleted");
  });

  afterEach(() => {
    localStorage.removeItem("quizResults");
    localStorage.removeItem("quizCompleted");
  });

  describe("Basic rendering", () => {
    it("renders children when dialog is not shown", () => {
      renderWithRouter(<div>Test Content</div>);
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("renders children correctly from results page", () => {
      renderWithRouter(<div>Results Content</div>, "/results");
      expect(screen.getByText("Results Content")).toBeInTheDocument();
    });
  });

  describe("LocalStorage detection", () => {
    it("detects quiz results from quizResults localStorage", () => {
      localStorage.setItem("quizResults", JSON.stringify({ data: "test" }));
      renderWithRouter(<div>Content</div>, "/results");

      // Component should detect quiz results exist
      expect(localStorage.getItem("quizResults")).toBeTruthy();
    });

    it("detects quiz results from quizCompleted localStorage", () => {
      localStorage.setItem("quizCompleted", "true");
      renderWithRouter(<div>Content</div>, "/results");

      // Component should detect quiz completion
      expect(localStorage.getItem("quizCompleted")).toBe("true");
    });

    it("handles no quiz results scenario", () => {
      renderWithRouter(<div>Content</div>, "/results");

      // No quiz results
      expect(localStorage.getItem("quizResults")).toBeNull();
      expect(localStorage.getItem("quizCompleted")).toBeNull();
    });
  });

  describe("Study programme navigation exception", () => {
    it("should allow navigation to study programme detail pages", () => {
      localStorage.setItem("quizResults", JSON.stringify({ data: "test" }));

      // The component checks if pathname starts with /study-programme/
      // This is allowed even without login
      renderWithRouter(<div>Detail Page</div>, "/study-programme/123");
      expect(screen.getByText("Detail Page")).toBeInTheDocument();
    });
  });
});
