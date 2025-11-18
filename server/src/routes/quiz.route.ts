import express from "express";
import { filterLevel, getQuestions } from "../controllers/quiz.controller";

const router = express.Router();

router.post("/filter", filterLevel);

router.get("/level/:levelId", getQuestions);

export default router;
