import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  saveQuizResults,
  getQuizResults,
  attachDeviceResults,
} from "../quizApi";

describe("quizApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("saveQuizResults", () => {
    it("sends POST request with resultIds", async () => {
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        }),
      );
      vi.stubGlobal("fetch", mockFetch);

      const testIds = ["123", "456", "789"];
      await saveQuizResults(testIds);

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/quiz/results",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ resultIds: testIds }),
        }),
      );
    });

    it("throws error when response is not ok", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() =>
          Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: "Not authenticated" }),
          }),
        ),
      );

      await expect(saveQuizResults(["123"])).rejects.toThrow(
        "Not authenticated",
      );
    });

    it("throws error with status code when no error message", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() =>
          Promise.resolve({
            ok: false,
            status: 500,
            json: () => Promise.resolve({}),
          }),
        ),
      );

      await expect(saveQuizResults(["123"])).rejects.toThrow(
        "HTTP error! status: 500",
      );
    });
  });

  describe("getQuizResults", () => {
    it("returns resultIds when user has saved results", async () => {
      const mockIds = ["111", "222", "333"];
      vi.stubGlobal(
        "fetch",
        vi.fn(() =>
          Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ success: true, resultIds: mockIds }),
          }),
        ),
      );

      const result = await getQuizResults();
      expect(result).toEqual(mockIds);
    });

    it("returns null when no results found (404)", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() =>
          Promise.resolve({
            ok: false,
            status: 404,
          }),
        ),
      );

      const result = await getQuizResults();
      expect(result).toBeNull();
    });

    it("throws error when response is not ok and not 404", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() =>
          Promise.resolve({
            ok: false,
            status: 401,
            json: () => Promise.resolve({ error: "Not authenticated" }),
          }),
        ),
      );

      await expect(getQuizResults()).rejects.toThrow("Not authenticated");
    });

    it("sends GET request with credentials", async () => {
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ success: true, resultIds: [] }),
        }),
      );
      vi.stubGlobal("fetch", mockFetch);

      await getQuizResults();

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/quiz/results",
        expect.objectContaining({
          method: "GET",
          credentials: "include",
        }),
      );
    });
  });

  describe("attachDeviceResults", () => {
    it("sends POST request with resultIds and credentials", async () => {
      const mockFetch = vi.fn<typeof fetch>().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ attached: true }),
      } as Response);

      const testIds = ["a1", "b2"];
      await attachDeviceResults(testIds, mockFetch);

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/quiz/attach-device-results",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resultIds: testIds }),
        }),
      );
    });

    it("returns parsed response data on success", async () => {
      const payload = { attached: true, count: 2 };
      const mockFetch = vi.fn<typeof fetch>().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(payload),
      } as Response);

      await expect(attachDeviceResults(["x", "y"], mockFetch)).resolves.toEqual(
        payload,
      );
    });

    it("throws error when response is not ok", async () => {
      const mockFetch = vi.fn<typeof fetch>().mockResolvedValue({
        ok: false,
      } as Response);

      await expect(attachDeviceResults(["x"], mockFetch)).rejects.toThrow(
        "Failed to attach device results to user",
      );
    });
  });
});
