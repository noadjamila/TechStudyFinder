import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("@mui/material/styles", async () => {
  const actual = await vi.importActual<any>("@mui/material/styles");
  const baseTheme = actual.createTheme();

  return {
    ...actual,
    useTheme: () => ({
      ...baseTheme,
      palette: {
        ...baseTheme.palette,
        quiz: {
          buttonChecked: "#ccc",
          cardBackground: "#eee",
          progressBg: "#ddd",
          progressFill: "#bbb",
        },
      },
    }),
  };
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");

  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

if (!globalThis.fetch) {
  // @ts-expect-error
  globalThis.fetch = vi.fn();
}
