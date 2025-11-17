import { Request, Response } from "express";
import { filterLevel } from "../quiz.controller";
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

  describe("Error handling", () => {
    it("should return 500 on service error", async () => {
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
  });
});
