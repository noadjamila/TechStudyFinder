import { describe, it, expect, vi, beforeEach } from "vitest";
import { addFavorite, removeFavorite, getFavorites } from "../favoritesApi";

// Mock fetch
global.fetch = vi.fn();

describe("favoritesApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addFavorite", () => {
    it("should add a favorite programme", async () => {
      const mockFetch = vi.mocked(global.fetch);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );

      await addFavorite("g1234");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/users/favorites",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ studiengangId: "g1234" }),
        }),
      );
    });

    it("should throw error on failed response", async () => {
      const mockFetch = vi.mocked(global.fetch);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        }),
      );

      await expect(addFavorite("g1234")).rejects.toThrow(
        "HTTP error! Status: 401",
      );
    });

    it("should throw 409 error when favourite already exists", async () => {
      const mockFetch = vi.mocked(global.fetch);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "Already favorited" }), {
          status: 409,
        }),
      );

      await expect(addFavorite("g1234")).rejects.toThrow(
        "HTTP error! Status: 409",
      );
    });
  });

  describe("removeFavorite", () => {
    it("should remove a favorite programme", async () => {
      const mockFetch = vi.mocked(global.fetch);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );

      await removeFavorite("g1234");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/users/favorites/g1234",
        expect.objectContaining({
          method: "DELETE",
          credentials: "include",
        }),
      );
    });

    it("should throw error on failed response", async () => {
      const mockFetch = vi.mocked(global.fetch);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "Not found" }), { status: 404 }),
      );

      await expect(removeFavorite("g1234")).rejects.toThrow(
        "HTTP error! Status: 404",
      );
    });
  });

  describe("getFavorites", () => {
    it("should fetch user favorites", async () => {
      const mockFavorites = ["g1234", "g5678", "g9012"];
      const mockFetch = vi.mocked(global.fetch);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ favorites: mockFavorites }), {
          status: 200,
        }),
      );

      const result = await getFavorites();

      expect(result).toEqual(mockFavorites);
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/users/favorites",
        expect.objectContaining({
          credentials: "include",
        }),
      );
    });

    it("should return empty array when no favorites", async () => {
      const mockFetch = vi.mocked(global.fetch);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ favorites: [] }), { status: 200 }),
      );

      const result = await getFavorites();

      expect(result).toEqual([]);
    });

    it("should throw error on failed response", async () => {
      const mockFetch = vi.mocked(global.fetch);
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        }),
      );

      await expect(getFavorites()).rejects.toThrow("HTTP error! Status: 401");
    });
  });
});
