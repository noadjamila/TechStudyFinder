/// <reference types="jest" />
import {
  filterLevel1,
  filterLevel2,
  getStudyProgrammeByIdService,
  saveQuizResultsService,
  getQuizResultsService,
} from "../quiz.service";
import * as quizRepository from "../../repositories/quiz.repository";

// Mock the repository module
jest.mock("../../repositories/quiz.repository");

describe("Quiz Service - filterLevel1", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should extract studientyp from first answer and call repository", async () => {
    // Arrange
    const mockIds = [1, 2, 3, 4, 5];
    const mockGetFilteredResults = jest
      .spyOn(quizRepository, "getFilteredResultsLevel1")
      .mockResolvedValue(mockIds);

    const answers = [{ studientyp: "undergraduate" as const }];

    // Act
    const result = await filterLevel1(answers);

    // Assert
    expect(mockGetFilteredResults).toHaveBeenCalledWith("undergraduate");
    expect(mockGetFilteredResults).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockIds);
  });

  it("should handle graduate studientyp", async () => {
    // Arrange
    const mockIds = [10, 20, 30];
    const mockGetFilteredResults = jest
      .spyOn(quizRepository, "getFilteredResultsLevel1")
      .mockResolvedValue(mockIds);

    const answers = [{ studientyp: "graduate" as const }];

    // Act
    const result = await filterLevel1(answers);

    // Assert
    expect(mockGetFilteredResults).toHaveBeenCalledWith("graduate");
    expect(result).toEqual(mockIds);
  });

  it("should call repository with undefined when studientyp is missing", async () => {
    // Arrange
    const mockIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const mockGetFilteredResults = jest
      .spyOn(quizRepository, "getFilteredResultsLevel1")
      .mockResolvedValue(mockIds);

    const answers = [{}]; // No studientyp property

    // Act
    const result = await filterLevel1(answers);

    // Assert
    expect(mockGetFilteredResults).toHaveBeenCalledWith("all");
    expect(result).toEqual(mockIds);
  });

  it("should handle empty answers array", async () => {
    // Arrange
    const mockIds = [1, 2, 3];
    const mockGetFilteredResults = jest
      .spyOn(quizRepository, "getFilteredResultsLevel1")
      .mockResolvedValue(mockIds);

    const answers: any[] = [];

    // Act
    const result = await filterLevel1(answers);

    // Assert
    expect(mockGetFilteredResults).toHaveBeenCalledWith("all");
    expect(result).toEqual(mockIds);
  });

  it("should propagate repository errors", async () => {
    // Arrange
    const mockError = new Error("Database connection failed");
    jest
      .spyOn(quizRepository, "getFilteredResultsLevel1")
      .mockRejectedValue(mockError);

    const answers = [{ studientyp: "grundständig" as const }];

    // Act & Assert
    await expect(filterLevel1(answers)).rejects.toThrow(
      "Database connection failed",
    );
  });
});

describe("Quiz Service - filterLevel2", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should aggregate RIASEC scores and call repository", async () => {
    // Arrange
    const mockResults = [
      {
        studiengang_id: "1",
        name: "Programme 1",
        similarity: 0.95,
        is_unique: true,
      },
      {
        studiengang_id: "2",
        name: "Programme 2",
        similarity: 0.92,
        is_unique: true,
      },
      {
        studiengang_id: "3",
        name: "Programme 3",
        similarity: 0.9,
        is_unique: false,
      },
    ];
    const mockGetFilteredResults = jest
      .spyOn(quizRepository, "getFilteredResultsLevel2")
      .mockResolvedValue(mockResults);

    const answers = [
      { type: "R", score: 3 },
      { type: "I", score: 5 },
      { type: "A", score: 2 },
      { type: "S", score: 4 },
      { type: "E", score: 1 },
      { type: "C", score: 0 },
    ];

    const studyProgrammeIds = [10, 20, 30];

    // Act
    const result = await filterLevel2(studyProgrammeIds, answers);

    // Assert
    expect(mockGetFilteredResults).toHaveBeenCalledWith(studyProgrammeIds, {
      R: 3,
      I: 5,
      A: 2,
      S: 4,
      E: 1,
      C: 0,
    });
    expect(result).toEqual(mockResults);
  });

  it("should handle undefined studyProgrammeIds", async () => {
    // Arrange
    const mockGetFilteredResults = jest
      .spyOn(quizRepository, "getFilteredResultsLevel2")
      .mockResolvedValue([]);

    const answers = [
      { type: "R", score: 1 },
      { type: "I", score: 1 },
      { type: "A", score: 1 },
      { type: "S", score: 1 },
      { type: "E", score: 1 },
      { type: "C", score: 1 },
    ];

    // Act
    const result = await filterLevel2(undefined, answers);

    // Assert
    expect(mockGetFilteredResults).toHaveBeenCalledWith(undefined, {
      R: 1,
      I: 1,
      A: 1,
      S: 1,
      E: 1,
      C: 1,
    });
    expect(result).toEqual([]);
  });

  it("should return empty array when answers are undefined", async () => {
    // Arrange
    const mockGetFilteredResults = jest.spyOn(
      quizRepository,
      "getFilteredResultsLevel2",
    );

    // Act
    const result = await filterLevel2([1, 2, 3], []);

    // Assert
    expect(mockGetFilteredResults).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("should propagate repository errors", async () => {
    // Arrange
    const mockError = new Error("Database query failed");
    jest
      .spyOn(quizRepository, "getFilteredResultsLevel2")
      .mockRejectedValue(mockError);

    const answers = [
      { type: "R", score: 2 },
      { type: "I", score: 2 },
      { type: "A", score: 2 },
      { type: "S", score: 2 },
      { type: "E", score: 2 },
      { type: "C", score: 2 },
    ];

    const studyProgrammeIds = [100, 200];

    // Act & Assert
    await expect(filterLevel2(studyProgrammeIds, answers)).rejects.toThrow(
      "Database query failed",
    );
  });
});

describe("Quiz Service - getStudyProgrammeByIdService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call repository with correct ID and return study programme", async () => {
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
    const mockGetStudyProgramme = jest
      .spyOn(quizRepository, "getStudyProgrammeById")
      .mockResolvedValue(mockProgramme);

    // Act
    const result = await getStudyProgrammeByIdService("12345");

    // Assert
    expect(mockGetStudyProgramme).toHaveBeenCalledWith("12345");
    expect(mockGetStudyProgramme).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockProgramme);
  });

  it("should return undefined when study programme not found", async () => {
    // Arrange
    const mockGetStudyProgramme = jest
      .spyOn(quizRepository, "getStudyProgrammeById")
      .mockResolvedValue(undefined);

    // Act
    const result = await getStudyProgrammeByIdService("nonexistent");

    // Assert
    expect(mockGetStudyProgramme).toHaveBeenCalledWith("nonexistent");
    expect(result).toBeUndefined();
  });

  it("should handle empty string ID", async () => {
    // Arrange
    const mockGetStudyProgramme = jest
      .spyOn(quizRepository, "getStudyProgrammeById")
      .mockResolvedValue(undefined);

    // Act
    const result = await getStudyProgrammeByIdService("");

    // Assert
    expect(mockGetStudyProgramme).toHaveBeenCalledWith("");
    expect(result).toBeUndefined();
  });

  it("should propagate repository errors", async () => {
    // Arrange
    const mockError = new Error("Database connection error");
    jest
      .spyOn(quizRepository, "getStudyProgrammeById")
      .mockRejectedValue(mockError);

    // Act & Assert
    await expect(getStudyProgrammeByIdService("12345")).rejects.toThrow(
      "Database connection error",
    );
  });

  it("should handle special characters in ID", async () => {
    // Arrange
    const specialId = "test-123_abc";
    const mockProgramme = {
      studiengang_id: specialId,
      name: "Test Programme",
      hochschule: "Test University",
      abschluss: "Bachelor",
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
    const mockGetStudyProgramme = jest
      .spyOn(quizRepository, "getStudyProgrammeById")
      .mockResolvedValue(mockProgramme);

    // Act
    const result = await getStudyProgrammeByIdService(specialId);

    // Assert
    expect(mockGetStudyProgramme).toHaveBeenCalledWith(specialId);
    expect(result).toEqual(mockProgramme);
  });

  it("should properly delegate to repository without modification", async () => {
    // Arrange
    const testId = "abc123";
    const mockGetStudyProgramme = jest
      .spyOn(quizRepository, "getStudyProgrammeById")
      .mockResolvedValue(undefined);

    // Act
    await getStudyProgrammeByIdService(testId);

    // Assert
    // Verify the service is a pure pass-through to the repository
    expect(mockGetStudyProgramme).toHaveBeenCalledWith(testId);
  });
});

describe("Quiz Service - saveQuizResultsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call repository to save quiz results", async () => {
    // Arrange
    const userId = 1;
    const resultIds = ["100", "101", "102"];
    const mockSaveResults = jest
      .spyOn(quizRepository, "saveUserQuizResults")
      .mockResolvedValue(undefined);

    // Act
    await saveQuizResultsService(userId, resultIds);

    // Assert
    expect(mockSaveResults).toHaveBeenCalledWith(userId, resultIds);
    expect(mockSaveResults).toHaveBeenCalledTimes(1);
  });

  it("should handle empty result IDs array", async () => {
    // Arrange
    const userId = 1;
    const resultIds: string[] = [];
    const mockSaveResults = jest
      .spyOn(quizRepository, "saveUserQuizResults")
      .mockResolvedValue(undefined);

    // Act
    await saveQuizResultsService(userId, resultIds);

    // Assert
    expect(mockSaveResults).toHaveBeenCalledWith(userId, resultIds);
  });

  it("should propagate repository errors", async () => {
    // Arrange
    const userId = 1;
    const resultIds = ["100", "101"];
    const mockError = new Error("Database connection failed");
    const mockSaveResults = jest
      .spyOn(quizRepository, "saveUserQuizResults")
      .mockRejectedValue(mockError);

    // Act & Assert
    await expect(saveQuizResultsService(userId, resultIds)).rejects.toThrow(
      "Database connection failed",
    );
    expect(mockSaveResults).toHaveBeenCalledWith(userId, resultIds);
  });
});

describe("Quiz Service - getQuizResultsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve quiz results from repository", async () => {
    // Arrange
    const userId = 1;
    const mockResults = [
      { studiengang_id: "100", similarity: 0.95 },
      { studiengang_id: "101", similarity: 0.92 },
      { studiengang_id: "102", similarity: 0.89 },
    ];
    const mockGetResults = jest
      .spyOn(quizRepository, "getUserQuizResults")
      .mockResolvedValue(mockResults);

    // Act
    const result = await getQuizResultsService(userId);

    // Assert
    expect(mockGetResults).toHaveBeenCalledWith(userId);
    expect(mockGetResults).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResults);
  });

  it("should return null when user has no saved results", async () => {
    // Arrange
    const userId = 1;
    const mockGetResults = jest
      .spyOn(quizRepository, "getUserQuizResults")
      .mockResolvedValue(null);

    // Act
    const result = await getQuizResultsService(userId);

    // Assert
    expect(mockGetResults).toHaveBeenCalledWith(userId);
    expect(result).toBeNull();
  });

  it("should propagate repository errors", async () => {
    // Arrange
    const userId = 1;
    const mockError = new Error("Database query failed");
    const mockGetResults = jest
      .spyOn(quizRepository, "getUserQuizResults")
      .mockRejectedValue(mockError);

    // Act & Assert
    await expect(getQuizResultsService(userId)).rejects.toThrow(
      "Database query failed",
    );
    expect(mockGetResults).toHaveBeenCalledWith(userId);
  });
});
