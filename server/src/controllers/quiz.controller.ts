import { Request, Response } from "express";
import {
  filterLevel1,
  filterLevel2,
  filterLevel3,
  getQuestionsLevel2Service,
  getStudyProgrammeByIdService,
  saveQuizResultsService,
  getQuizResultsService,
} from "../services/quiz.service";
import { FilterRequest } from "../types/filterRequest";

/**
 * Handles filtering based on the quiz level.
 *
 * @param req request as FilterRequest object
 * @param res response object
 * @returns status and (if successful) filtered ids
 */
export async function filterLevel(
  req: Request<{}, {}, FilterRequest>,
  res: Response,
) {
  const { level, answers, studyProgrammeIds } = req.body;

  try {
    let result;

    if (level === 1) {
      result = await filterLevel1(answers);
    } else if (level === 2) {
      result = await filterLevel2(studyProgrammeIds, answers);
    } else if (level === 3) {
      result = await filterLevel3(studyProgrammeIds, answers);
    }

    return res.status(200).json({
      success: true,
      ids: result,
    });
  } catch (err) {
    console.error("Filter error:", err);
    return res.status(500).json({
      success: false,
      error: "Filter error",
    });
  }
}

/**
 * Gets questions for one level.
 *
 * @param req request object
 * @param res response object
 * @returns status and if successful all questions of one level
 */
export async function getQuestions(req: Request, res: Response) {
  try {
    const { levelId } = req.params;

    const levelNumber = parseInt(levelId, 10);
    if (isNaN(levelNumber)) {
      return res.status(400).json({
        error: "Invalid levelId",
        message: "levelId must be a number",
      });
    }

    let result;

    if (levelNumber === 2) {
      result = await getQuestionsLevel2Service();
    }

    res.status(200).json({
      message: "Questions retrieved successfully",
      questions: result,
    });
  } catch (error) {
    console.error("Error retrieving questions", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error retrieving questions",
    });
  }
}

export async function getStudyProgrammeById(req: Request, res: Response) {
  try {
    const result = await getStudyProgrammeByIdService(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Study programme not found",
      });
    }

    return res.status(200).json({
      success: true,
      studyProgramme: result,
    });
  } catch (error) {
    console.error("Error retrieving study programme", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "Error retrieving study programme",
    });
  }
}

/**
 * Saves user quiz results to the database.
 * Requires authentication.
 *
 * @param req request with resultIds in body
 * @param res response object
 * @returns success status
 */
export async function saveQuizResults(
  req: Request<{}, {}, { resultIds: string[] }>,
  res: Response,
) {
  const userId = (req.session as any).user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Not authenticated",
    });
  }

  const { resultIds } = req.body;

  if (!Array.isArray(resultIds)) {
    return res.status(400).json({
      success: false,
      error: "resultIds must be an array",
    });
  }

  if (resultIds.length === 0) {
    return res.status(400).json({
      success: false,
      error: "resultIds cannot be empty",
    });
  }

  if (!resultIds.every((id: unknown) => typeof id === "string")) {
    return res.status(400).json({
      success: false,
      error: "All resultIds must be strings",
    });
  }
  try {
    await saveQuizResultsService(userId, resultIds);
    return res.status(200).json({
      success: true,
      message: "Quiz results saved",
    });
  } catch (err) {
    console.error("Error saving quiz results:", err);
    return res.status(500).json({
      success: false,
      error: "Error saving quiz results",
    });
  }
}

/**
 * Retrieves user quiz results from the database.
 * Requires authentication.
 *
 * @param req request object
 * @param res response object
 * @returns user's saved quiz result IDs
 */
export async function getQuizResults(req: Request, res: Response) {
  const userId = (req.session as any).user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Not authenticated",
    });
  }

  try {
    const resultIds = await getQuizResultsService(userId);

    if (resultIds === null) {
      return res.status(404).json({
        success: false,
        message: "No quiz results found",
      });
    }

    return res.status(200).json({
      success: true,
      resultIds,
    });
  } catch (err) {
    console.error("Error retrieving quiz results:", err);
    return res.status(500).json({
      success: false,
      error: "Error retrieving quiz results",
    });
  }
}

/**
 * Attaches device session quiz results to authenticated user.
 * Requires authentication.
 * @param req request with resultIds in body
 * @param res
 * @returns success status
 */
export async function attachDeviceSession(req: Request, res: Response) {
  if (!req.session) {
    return res.status(500).json({
      success: false,
      error: "Session not initialized",
    });
  }

  const userId = (req.session as any).user?.id;
  const { resultIds } = req.body ?? {};

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Not authenticated",
    });
  }

  if (!Array.isArray(resultIds)) {
    return res.status(400).json({
      success: false,
      error: "resultIds must be an array",
    });
  }

  if (resultIds.length === 0) {
    return res.status(400).json({
      success: false,
      error: "resultIds cannot be empty",
    });
  }

  if (!resultIds.every((id) => typeof id === "string")) {
    return res.status(400).json({
      success: false,
      error: "All resultIds must be strings",
    });
  }

  try {
    await saveQuizResultsService(userId, resultIds);
    return res.status(200).json({
      success: true,
      message: "Quiz results saved",
    });
  } catch (err) {
    console.error("Error saving quiz results:", err);
    return res.status(500).json({
      success: false,
      error: "Error saving quiz results",
    });
  }
}
