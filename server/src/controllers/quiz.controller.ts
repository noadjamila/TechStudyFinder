import { Request, Response } from "express";
import {
  filterLevel1,
  filterLevel2,
  filterLevel3,
  getQuestionsLevel2Service,
  getStudyProgrammeDetails,
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

/**
 * Fetches study programme details by their IDs.
 *
 * @param req request object with ids as query parameter (comma-separated)
 * @param res response object
 * @returns status and if successful array of study programmes
 */
export async function getProgrammesByIds(req: Request, res: Response) {
  try {
    const { ids } = req.query;

    if (!ids || typeof ids !== "string") {
      return res.status(400).json({
        error: "Missing or invalid ids parameter",
        message: "ids must be a comma-separated string",
      });
    }

    const idArray = ids.split(",").map((id) => id.trim());
    const programmes = await getStudyProgrammeDetails(idArray);

    res.status(200).json({
      message: "Programmes retrieved successfully",
      programmes,
    });
  } catch (error) {
    console.error("Error retrieving programmes", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error retrieving programmes",
    });
  }
}
