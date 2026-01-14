import express from "express";
import {
  filterLevel,
  getQuestions,
  getStudyProgrammeById,
  saveQuizResults,
} from "../controllers/quiz.controller";

const router = express.Router();

router.post("/filter", filterLevel);

router.get("/level/:levelId", getQuestions);

router.get("/study-programme/:id", getStudyProgrammeById);

router.post("/results", saveQuizResults);

export default router;
