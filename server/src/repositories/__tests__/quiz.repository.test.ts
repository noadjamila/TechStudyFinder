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

  it("should return all IDs when no studientyp is provided", async () => {
    // Arrange
    const mockRows = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
    (pool.query as jest.Mock).mockResolvedValue({ rows: mockRows });

    // Act
    const result = await getFilteredResultsLevel1();

    // Assert
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT id FROM studiengang_raw_data_simulation",
      [],
    );
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it("should filter by grundständig when provided", async () => {
    // Arrange
    const mockRows = [{ id: 1 }, { id: 3 }, { id: 5 }];
    (pool.query as jest.Mock).mockResolvedValue({ rows: mockRows });

    // Act
    const result = await getFilteredResultsLevel1("grundständig");

    // Assert
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT id FROM studiengang_raw_data_simulation WHERE studientyp = $1",
      ["grundständig"],
    );
    expect(result).toEqual([1, 3, 5]);
  });

  it("should filter by weiterführend when provided", async () => {
    // Arrange
    const mockRows = [{ id: 2 }, { id: 4 }];
    (pool.query as jest.Mock).mockResolvedValue({ rows: mockRows });

    // Act
    const result = await getFilteredResultsLevel1("weiterführend");

    // Assert
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT id FROM studiengang_raw_data_simulation WHERE studientyp = $1",
      ["weiterführend"],
    );
    expect(result).toEqual([2, 4]);
  });

  it("should return empty array when no results found", async () => {
    // Arrange
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    const result = await getFilteredResultsLevel1("grundständig");

    // Assert
    expect(result).toEqual([]);
  });

  it("should throw error when database query fails", async () => {
    // Arrange
    const mockError = new Error("Database connection error");
    (pool.query as jest.Mock).mockRejectedValue(mockError);

    // Act & Assert
    await expect(getFilteredResultsLevel1()).rejects.toThrow(
      "Database connection error",
    );
  });
});
