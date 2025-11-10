import express from 'express';
import { filterLevel1 } from '../controllers/quizController';

const router = express.Router();

router.post('/level1', filterLevel1);

export default router;