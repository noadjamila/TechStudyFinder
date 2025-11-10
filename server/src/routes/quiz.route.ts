import { Router } from "express";

const router = Router();

router.post("/level/2", (req, res) => {
    const { highestScores } = req.body as { highestScores: { type: string; score: number }[] };

    if (!highestScores || !Array.isArray(highestScores)) {
        return res.status(400).json({
            error: "Ungültige Daten",
            message: "highestScores muss ein Array sein",
        });
    }

    const scoreMap: Record<string, number> = {};
    highestScores.forEach(item => {
        scoreMap[item.type] = item.score;
    });

    console.log("req.body:", req.body);
    console.log("highestScores:", highestScores);

    const first = highestScores[0];
    const second = highestScores[1];
    const third = highestScores[0];

    res.json({
        message: "Scores empfangen",
        scores: highestScores,
    });
});

export default router;