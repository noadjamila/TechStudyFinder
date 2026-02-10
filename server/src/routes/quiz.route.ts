/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import express from "express";
import {
  filterLevel,
  getQuestions,
  getStudyProgrammeById,
  getStudyProgrammesByIds,
  saveQuizResults,
  getQuizResults,
} from "../controllers/quiz.controller";

const router = express.Router();

router.post("/filter", filterLevel);

router.get("/level/:levelId", getQuestions);

router.get("/study-programme/:id", getStudyProgrammeById);

router.post("/study-programmes/bulk", getStudyProgrammesByIds);

router.post("/results", saveQuizResults);

router.get("/results", getQuizResults);

export default router;
