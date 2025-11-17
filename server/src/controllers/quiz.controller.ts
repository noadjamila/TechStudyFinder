import { Request, Response } from "express";
import {
  filterLevel1,
  filterLevel2,
  filterLevel3,
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
    // eslint-disable-next-line no-console
    console.error("Filter error:", err);
    return res.status(500).json({
      success: false,
      error: "Filter error",
    });
  }
}
