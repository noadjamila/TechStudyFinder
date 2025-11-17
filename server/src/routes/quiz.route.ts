import { Router } from "express";
import { pool } from "../../db";

const router = Router();
/**
 * POST /level/2
 * Body: { highestScores: { type: string; score: number }[] }
 * Returns study IDs for matching quiz types.
 */
router.post("/level/2", async (req, res) => {
    const { highestScores } = req.body as { highestScores: { type: string; score: number }[] };

    if (!highestScores || !Array.isArray(highestScores)) {
        return res.status(400).json({
            error: "Invalid data",
            message: "highestScores must be an array",
        });
    }

    const types = highestScores.map(s => s.type);

    console.log("Received highestScores:", highestScores);

    try {
        const minMatches = 2; // Define minimum number of matching types

        const query = `
            SELECT id
            FROM studiengang_raw_data_simulation
            WHERE (
                SELECT COUNT(*)
                FROM unnest(riasec_type) AS t(type)
                WHERE type = ANY($1::char[])
            ) >= $2
        `;

        const result = await pool.query(query, [types, minMatches]);

        console.log("Study IDs Query successful:", result.rows);

        res.status(200).json({
            message: "Study IDs retrieved successfully",
            scores: highestScores,
            studyIds: result.rows,
        });
    
    } catch (error) {
        console.error("Error querying study IDs", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Error querying study IDs",
        });
    }
});

/**
 * GET /level/2
 * Returns all level 2 questions.
 */
router.get("/level/2", async (_req, res) => {
    try {
        const result = await pool.query("SELECT * FROM fragen_level_zwei ORDER BY RANDOM() LIMIT 5");
        console.log("Questions Query successful:", result.rows);

        res.status(200).json({
            message: "Questions retrieved successfully",
            questions: result.rows,
        });
    } catch (error) {
        console.error("Error retrieving level 2 questions", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: "Error retrieving level 2 questions",
        });
    }
});

export default router;