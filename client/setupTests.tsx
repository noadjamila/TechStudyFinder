/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

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
