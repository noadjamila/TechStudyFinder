import express from 'express';
import { filterLevel } from '../controllers/quiz.controller';

const router = express.Router();

router.post('/filter', filterLevel);

export default router;