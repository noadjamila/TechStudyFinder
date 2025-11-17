import { filterLevel1 } from "../quiz.service";
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

    const answers = [{ studientyp: "grundständig" as const }];

    // Act
    const result = await filterLevel1(answers);

    // Assert
    expect(mockGetFilteredResults).toHaveBeenCalledWith("grundständig");
    expect(mockGetFilteredResults).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockIds);
  });

  it("should handle weiterführend studientyp", async () => {
    // Arrange
    const mockIds = [10, 20, 30];
    const mockGetFilteredResults = jest
      .spyOn(quizRepository, "getFilteredResultsLevel1")
      .mockResolvedValue(mockIds);

    const answers = [{ studientyp: "weiterführend" as const }];

    // Act
    const result = await filterLevel1(answers);

    // Assert
    expect(mockGetFilteredResults).toHaveBeenCalledWith("weiterführend");
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
    expect(mockGetFilteredResults).toHaveBeenCalledWith(undefined);
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
    expect(mockGetFilteredResults).toHaveBeenCalledWith(undefined);
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
