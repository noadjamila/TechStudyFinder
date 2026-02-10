/// <reference types="jest" />
import {
  getFilteredResultsLevel1,
  getStudyProgrammeById,
  getStudyProgrammesByIds,
  saveUserQuizResults,
  getUserQuizResults,
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
      fristen: null,
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
      fristen: null,
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

describe("Quiz Repository - getStudyProgrammesByIds", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve multiple study programmes by IDs", async () => {
    // Arrange
    const ids = ["100", "101", "102"];
    const mockProgrammes = [
      {
        studiengang_id: "100",
        name: "Informatik",
        hochschule: "TU Berlin",
        abschluss: "Bachelor",
      },
      {
        studiengang_id: "101",
        name: "Mathematik",
        hochschule: "LMU München",
        abschluss: "Master",
      },
      {
        studiengang_id: "102",
        name: "Physik",
        hochschule: "Uni Hamburg",
        abschluss: "Bachelor",
      },
    ];
    (pool.query as jest.Mock).mockResolvedValue({ rows: mockProgrammes });

    // Act
    const result = await getStudyProgrammesByIds(ids);

    // Assert
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM studiengang_full_view WHERE studiengang_id = ANY($1)",
      [ids],
    );
    expect(result).toEqual(mockProgrammes);
    expect(result.length).toBe(3);
  });

  it("should return empty array when no IDs provided", async () => {
    // Arrange
    const ids: string[] = [];

    // Act
    const result = await getStudyProgrammesByIds(ids);

    // Assert
    expect(pool.query).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("should handle single ID", async () => {
    // Arrange
    const ids = ["200"];
    const mockProgramme = [
      {
        studiengang_id: "200",
        name: "Chemie",
        hochschule: "Uni Köln",
        abschluss: "Bachelor",
      },
    ];
    (pool.query as jest.Mock).mockResolvedValue({ rows: mockProgramme });

    // Act
    const result = await getStudyProgrammesByIds(ids);

    // Assert
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM studiengang_full_view WHERE studiengang_id = ANY($1)",
      [ids],
    );
    expect(result).toEqual(mockProgramme);
  });

  it("should handle database query failure", async () => {
    // Arrange
    const ids = ["300", "301"];
    const mockError = new Error("Database connection error");
    (pool.query as jest.Mock).mockRejectedValue(mockError);

    // Act & Assert
    await expect(getStudyProgrammesByIds(ids)).rejects.toThrow(
      "Database connection error",
    );
  });

  it("should return empty array when no programmes found", async () => {
    // Arrange
    const ids = ["999", "888"];
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    const result = await getStudyProgrammesByIds(ids);

    // Assert
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });

  it("should handle large arrays of IDs", async () => {
    // Arrange
    const ids = Array.from({ length: 100 }, (_, i) => `id-${i}`);
    const mockProgrammes = ids.map((id) => ({
      studiengang_id: id,
      name: `Programme ${id}`,
    }));
    (pool.query as jest.Mock).mockResolvedValue({ rows: mockProgrammes });

    // Act
    const result = await getStudyProgrammesByIds(ids);

    // Assert
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM studiengang_full_view WHERE studiengang_id = ANY($1)",
      [ids],
    );
    expect(result.length).toBe(100);
  });
});

describe("Quiz Repository - saveUserQuizResults", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should insert new quiz results for user", async () => {
    // Arrange
    const userId = 1;
    const results = [
      { studiengang_id: "100", similarity: 0.95 },
      { studiengang_id: "101", similarity: 0.92 },
      { studiengang_id: "102", similarity: 0.89 },
    ];
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    await saveUserQuizResults(userId, results);

    // Assert
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO user_quiz_results"),
      [userId, JSON.stringify(results)],
    );
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  it("should update existing quiz results for user (UPSERT)", async () => {
    // Arrange
    const userId = 1;
    const results = [
      { studiengang_id: "200", similarity: 0.98 },
      { studiengang_id: "201", similarity: 0.91 },
    ];
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    await saveUserQuizResults(userId, results);

    // Assert
    const callArgs = (pool.query as jest.Mock).mock.calls[0];
    expect(callArgs[0]).toContain("ON CONFLICT (user_id)");
    expect(callArgs[0]).toContain("DO UPDATE SET result_ids");
    expect(callArgs[1]).toEqual([userId, JSON.stringify(results)]);
  });

  it("should handle empty result IDs array", async () => {
    // Arrange
    const userId = 1;
    const results: any[] = [];
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    await saveUserQuizResults(userId, results);

    // Assert
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [
      userId,
      JSON.stringify(results),
    ]);
  });

  it("should propagate database errors", async () => {
    // Arrange
    const userId = 1;
    const results = [{ studiengang_id: "100", similarity: 0.95 }];
    const mockError = new Error("Database constraint violation");
    (pool.query as jest.Mock).mockRejectedValue(mockError);

    // Act & Assert
    await expect(saveUserQuizResults(userId, results)).rejects.toThrow(
      "Database constraint violation",
    );
  });

  it("should handle large arrays of result IDs", async () => {
    // Arrange
    const userId = 1;
    const results = Array.from({ length: 100 }, (_, i) => ({
      studiengang_id: `id_${i}`,
      similarity: 0.9 + i * 0.0001,
    }));
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    await saveUserQuizResults(userId, results);

    // Assert
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [
      userId,
      JSON.stringify(results),
    ]);
  });
});

describe("Quiz Repository - getUserQuizResults", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve quiz results for existing user", async () => {
    // Arrange
    const userId = 1;
    const mockResults = ["100", "101", "102"];
    (pool.query as jest.Mock).mockResolvedValue({
      rows: [{ result_ids: mockResults }],
    });

    // Act
    const result = await getUserQuizResults(userId);

    // Assert
    const callArgs = (pool.query as jest.Mock).mock.calls[0];
    expect(callArgs[0]).toContain("SELECT result_ids FROM user_quiz_results");
    expect(callArgs[0]).toContain("WHERE user_id = $1");
    expect(callArgs[1]).toEqual([userId]);
    // Should convert old string[] format to new object[] format
    expect(result).toEqual([
      { studiengang_id: "100" },
      { studiengang_id: "101" },
      { studiengang_id: "102" },
    ]);
  });

  it("should return null when user has no saved results", async () => {
    // Arrange
    const userId = 1;
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    const result = await getUserQuizResults(userId);

    // Assert
    const callArgs = (pool.query as jest.Mock).mock.calls[0];
    expect(callArgs[0]).toContain("SELECT result_ids FROM user_quiz_results");
    expect(callArgs[0]).toContain("WHERE user_id = $1");
    expect(callArgs[1]).toEqual([userId]);
    expect(result).toBeNull();
  });

  it("should handle empty result IDs array from database", async () => {
    // Arrange
    const userId = 1;
    (pool.query as jest.Mock).mockResolvedValue({
      rows: [{ result_ids: [] }],
    });

    // Act
    const result = await getUserQuizResults(userId);

    // Assert
    expect(result).toEqual([]);
  });

  it("should propagate database errors", async () => {
    // Arrange
    const userId = 1;
    const mockError = new Error("Database connection timeout");
    (pool.query as jest.Mock).mockRejectedValue(mockError);

    // Act & Assert
    await expect(getUserQuizResults(userId)).rejects.toThrow(
      "Database connection timeout",
    );
  });

  it("should handle different user IDs", async () => {
    // Arrange
    const userId = 999;
    const mockResults = ["500", "501"];
    (pool.query as jest.Mock).mockResolvedValue({
      rows: [{ result_ids: mockResults }],
    });

    // Act
    const result = await getUserQuizResults(userId);

    // Assert
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [userId]);
    // Should convert old string[] format to new object[] format
    expect(result).toEqual([
      { studiengang_id: "500" },
      { studiengang_id: "501" },
    ]);
  });
});
