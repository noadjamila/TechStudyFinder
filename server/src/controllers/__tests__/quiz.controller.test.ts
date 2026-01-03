/// <reference types="jest" />
import { Request, Response } from "express";
import {
  filterLevel,
  getQuestions,
  getStudyProgrammeById,
} from "../quiz.controller";
import * as quizService from "../../services/quiz.service";

// Mock the service module
jest.mock("../../services/quiz.service");

describe("Quiz Controller - filterLevel", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup response mock
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
  });

  describe("Level 1 filtering", () => {
    it("should return 200 with filtered IDs for level 1", async () => {
      // Arrange
      const mockIds = [1, 2, 3, 4, 5];
      jest.spyOn(quizService, "filterLevel1").mockResolvedValue(mockIds);

      mockRequest = {
        body: {
          level: 1,
          answers: [{ studientyp: "grundständig" }],
        },
      };

      // Act
      await filterLevel(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(quizService.filterLevel1).toHaveBeenCalledWith([
        { studientyp: "grundständig" },
      ]);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        ids: mockIds,
      });
    });

    it("should handle empty results for level 1", async () => {
      // Arrange
      jest.spyOn(quizService, "filterLevel1").mockResolvedValue([]);

      mockRequest = {
        body: {
          level: 1,
          answers: [{ studientyp: "grundständig" }],
        },
      };

      // Act
      await filterLevel(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        ids: [],
      });
    });
  });

  describe("Level 2 filtering", () => {
    it("should return 200 with filtered IDs for level 2", async () => {
      // Arrange
      const mockIds = [10, 20, 30];
      jest.spyOn(quizService, "filterLevel2").mockResolvedValue(mockIds);

      mockRequest = {
        body: {
          level: 2,
          studyProgrammeIds: [1, 2, 3],
          answers: [{ type: "R" }, { type: "I" }, { type: "A" }],
        },
      };

      // Act
      await filterLevel(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(quizService.filterLevel2).toHaveBeenCalledWith(
        [1, 2, 3],
        [{ type: "R" }, { type: "I" }, { type: "A" }],
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        ids: mockIds,
      });
    });

    it("should handle empty results for level 2", async () => {
      // Arrange
      jest.spyOn(quizService, "filterLevel2").mockResolvedValue([]);

      mockRequest = {
        body: {
          level: 2,
          studyProgrammeIds: [1, 2, 3],
          answers: [{ type: "R" }],
        },
      };

      // Act
      await filterLevel(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        ids: [],
      });
    });

    it("should handle level 2 without studyProgrammeIds", async () => {
      // Arrange
      const mockIds = [10, 20];
      jest.spyOn(quizService, "filterLevel2").mockResolvedValue(mockIds);

      mockRequest = {
        body: {
          level: 2,
          answers: [{ type: "R" }, { type: "I" }],
        },
      };

      // Act
      await filterLevel(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(quizService.filterLevel2).toHaveBeenCalledWith(undefined, [
        { type: "R" },
        { type: "I" },
      ]);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        ids: mockIds,
      });
    });
  });

  describe("Error handling", () => {
    it("should return 500 on service error for level 1", async () => {
      // Arrange
      const mockError = new Error("Service error");
      jest.spyOn(quizService, "filterLevel1").mockRejectedValue(mockError);
      jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console.error

      mockRequest = {
        body: {
          level: 1,
          answers: [{ studientyp: "grundständig" }],
        },
      };

      // Act
      await filterLevel(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: "Filter error",
      });
      expect(console.error).toHaveBeenCalledWith("Filter error:", mockError);
    });

    it("should return 500 on service error for level 2", async () => {
      // Arrange
      const mockError = new Error("Service error");
      jest.spyOn(quizService, "filterLevel2").mockRejectedValue(mockError);
      jest.spyOn(console, "error").mockImplementation(() => {});

      mockRequest = {
        body: {
          level: 2,
          studyProgrammeIds: [1, 2, 3],
          answers: [{ type: "R" }],
        },
      };

      // Act
      await filterLevel(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: "Filter error",
      });
      expect(console.error).toHaveBeenCalledWith("Filter error:", mockError);
    });
  });
});

describe("Quiz Controller - getQuestions Level 2", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup response mock
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };

    mockRequest = {
      params: { levelId: "2" },
    };
  });

  it("should return 200 with questions for level 2", async () => {
    // Arrange
    const mockQuestions = [
      { id: 1, question: "Question 1", type: "R" },
      { id: 2, question: "Question 2", type: "I" },
    ];
    jest
      .spyOn(quizService, "getQuestionsLevel2Service")
      .mockResolvedValue(mockQuestions);

    // Act
    await getQuestions(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(quizService.getQuestionsLevel2Service).toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Questions retrieved successfully",
      questions: mockQuestions,
    });
  });

  it("should handle empty questions array", async () => {
    // Arrange
    jest.spyOn(quizService, "getQuestionsLevel2Service").mockResolvedValue([]);
    jest.spyOn(console, "log").mockImplementation(() => {});

    // Act
    await getQuestions(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Questions retrieved successfully",
      questions: [],
    });
  });

  it("should return 500 on service error", async () => {
    // Arrange
    const mockError = new Error("Database error");
    jest
      .spyOn(quizService, "getQuestionsLevel2Service")
      .mockRejectedValue(mockError);
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console.error

    // Act
    await getQuestions(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Internal Server Error",
      message: "Error retrieving questions",
    });
    expect(console.error).toHaveBeenCalledWith(
      "Error retrieving questions",
      mockError,
    );
  });
});

describe("Quiz Controller - getStudyProgrammeById", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup response mock
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it("should return 200 with study programme data for valid ID", async () => {
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
    jest
      .spyOn(quizService, "getStudyProgrammeByIdService")
      .mockResolvedValue(mockProgramme);

    mockRequest = {
      params: {
        id: "12345",
      },
    };

    // Act
    await getStudyProgrammeById(
      mockRequest as Request,
      mockResponse as Response,
    );

    // Assert
    expect(quizService.getStudyProgrammeByIdService).toHaveBeenCalledWith(
      "12345",
    );
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      studyProgramme: mockProgramme,
    });
  });

  it("should return 404 when study programme is not found", async () => {
    // Arrange
    jest
      .spyOn(quizService, "getStudyProgrammeByIdService")
      .mockResolvedValue(undefined);

    mockRequest = {
      params: {
        id: "nonexistent",
      },
    };

    // Act
    await getStudyProgrammeById(
      mockRequest as Request,
      mockResponse as Response,
    );

    // Assert
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: "Study programme not found",
    });
  });

  it("should return 500 on service error", async () => {
    // Arrange
    const mockError = new Error("Database connection failed");
    jest
      .spyOn(quizService, "getStudyProgrammeByIdService")
      .mockRejectedValue(mockError);
    jest.spyOn(console, "error").mockImplementation(() => {});

    mockRequest = {
      params: {
        id: "12345",
      },
    };

    // Act
    await getStudyProgrammeById(
      mockRequest as Request,
      mockResponse as Response,
    );

    // Assert
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: "Internal Server Error",
      message: "Error retrieving study programme",
    });
    expect(console.error).toHaveBeenCalledWith(
      "Error retrieving study programme",
      mockError,
    );
  });

  it("should return 404 for empty string ID", async () => {
    // Arrange
    jest
      .spyOn(quizService, "getStudyProgrammeByIdService")
      .mockResolvedValue(undefined);

    mockRequest = {
      params: {
        id: "",
      },
    };

    // Act
    await getStudyProgrammeById(
      mockRequest as Request,
      mockResponse as Response,
    );

    // Assert
    expect(quizService.getStudyProgrammeByIdService).toHaveBeenCalledWith("");
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: "Study programme not found",
    });
  });
});
