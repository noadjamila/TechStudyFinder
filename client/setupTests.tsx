import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("@mui/material/styles", async () => {
  const actual = await vi.importActual<any>("@mui/material/styles");
  return actual;
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");

  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

if (!globalThis.fetch) {
  globalThis.fetch = vi.fn();
}

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

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});
