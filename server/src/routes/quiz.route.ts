import express from "express";
import {
  filterLevel,
  getQuestions,
  getProgrammesByIds,
} from "../controllers/quiz.controller";

const router = express.Router();

router.post("/filter", filterLevel);

router.get("/level/:levelId", getQuestions);

router.get("/programmes", getProgrammesByIds);

export default router;
