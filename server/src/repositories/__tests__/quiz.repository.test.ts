/// <reference types="jest" />
import {
  getFilteredResultsLevel1,
  getStudyProgrammeById,
} from "../quiz.repository";
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

describe("Quiz Repository - getStudyProgrammeById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return study programme data for valid ID", async () => {
    // Arrange
    const mockProgramme = {
      studiengang_id: "12345",
      name: "Informatik",
      hochschule: "TU Berlin",
      abschluss: "Bachelor of Science",
      homepage: "https://example.com",
      studienbeitrag: "0 EUR",
      beitrag_kommentar: null,
      anmerkungen: "Test programme",
      regelstudienzeit: "6 Semester",
      zulassungssemester: "WS",
      zulassungsmodus: "NC",
      zulassungsvoraussetzungen: "Abitur",
      zulassungslink: "https://example.com/apply",
      schwerpunkte: ["AI", "Software Engineering"],
      sprachen: ["Deutsch", "Englisch"],
      standorte: ["Berlin"],
      studienfelder: ["Informatik"],
      studienform: ["Vollzeit"],
    };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockProgramme] });

    // Act
    const result = await getStudyProgrammeById("12345");

    // Assert
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM studiengang_full_view WHERE studiengang_id = $1",
      ["12345"],
    );
    expect(result).toEqual(mockProgramme);
  });

  it("should return undefined when study programme not found", async () => {
    // Arrange
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    const result = await getStudyProgrammeById("nonexistent");

    // Assert
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM studiengang_full_view WHERE studiengang_id = $1",
      ["nonexistent"],
    );
    expect(result).toBeUndefined();
  });

  it("should handle empty string ID", async () => {
    // Arrange
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    const result = await getStudyProgrammeById("");

    // Assert
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM studiengang_full_view WHERE studiengang_id = $1",
      [""],
    );
    expect(result).toBeUndefined();
  });

  it("should handle null values in returned data", async () => {
    // Arrange
    const mockProgramme = {
      studiengang_id: "12345",
      name: "Informatik",
      hochschule: "TU Berlin",
      abschluss: "Bachelor of Science",
      homepage: null,
      studienbeitrag: null,
      beitrag_kommentar: null,
      anmerkungen: null,
      regelstudienzeit: null,
      zulassungssemester: null,
      zulassungsmodus: null,
      zulassungsvoraussetzungen: null,
      zulassungslink: null,
      schwerpunkte: null,
      sprachen: null,
      standorte: null,
      studienfelder: null,
      studienform: null,
    };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockProgramme] });

    // Act
    const result = await getStudyProgrammeById("12345");

    // Assert
    expect(result).toEqual(mockProgramme);
  });

  it("should throw error when database query fails", async () => {
    // Arrange
    const mockError = new Error("Database connection error");
    (pool.query as jest.Mock).mockRejectedValue(mockError);

    // Act & Assert
    await expect(getStudyProgrammeById("12345")).rejects.toThrow(
      "Database connection error",
    );
  });

  it("should handle special characters in ID", async () => {
    // Arrange
    const specialId = "test-123_abc";
    const mockProgramme = {
      studiengang_id: specialId,
      name: "Test Programme",
    };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockProgramme] });

    // Act
    const result = await getStudyProgrammeById(specialId);

    // Assert
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM studiengang_full_view WHERE studiengang_id = $1",
      [specialId],
    );
    expect(result).toEqual(mockProgramme);
  });
});
