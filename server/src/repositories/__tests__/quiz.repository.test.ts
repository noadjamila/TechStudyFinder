/// <reference types="jest" />
import { getFilteredResultsLevel1 } from "../quiz.repository";
import { pool } from "../../../db";

// Mock the database pool
jest.mock("../../../db", () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe("Quiz Repository - getFilteredResultsLevel1", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all IDs when no studientyp is 'all'", async () => {
    // Arrange
    const mockRows = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
    (pool.query as jest.Mock).mockResolvedValue({ rows: mockRows });

    // Act
    const result = await getFilteredResultsLevel1("all");

    // Assert
    expect(pool.query).toHaveBeenCalledWith("SELECT id FROM studiengaenge", []);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it("should filter by undergraduate when provided", async () => {
    // Arrange
    const mockRows = [{ id: 1 }, { id: 3 }, { id: 5 }];
    (pool.query as jest.Mock).mockResolvedValue({ rows: mockRows });

    // Act
    const result = await getFilteredResultsLevel1("undergraduate");

    // Assert
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT id FROM studiengaenge WHERE typ = $1",
      ["undergraduate"],
    );
    expect(result).toEqual([1, 3, 5]);
  });

  it("should filter by graduate when provided", async () => {
    // Arrange
    const mockRows = [{ id: 2 }, { id: 4 }];
    (pool.query as jest.Mock).mockResolvedValue({ rows: mockRows });

    // Act
    const result = await getFilteredResultsLevel1("graduate");

    // Assert
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT id FROM studiengaenge WHERE typ = $1",
      ["graduate"],
    );
    expect(result).toEqual([2, 4]);
  });

  it("should return empty array when no results found", async () => {
    // Arrange
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    const result = await getFilteredResultsLevel1("undergraduate");

    // Assert
    expect(result).toEqual([]);
  });

  it("should throw error when database query fails", async () => {
    // Arrange
    const mockError = new Error("Database connection error");
    (pool.query as jest.Mock).mockRejectedValue(mockError);

    // Act & Assert
    await expect(getFilteredResultsLevel1("all")).rejects.toThrow(
      "Database connection error",
    );
  });
});
