import { Request, Response } from 'express';
import { filterResults } from '../services/quizService';

export async function filterLevel1(req: Request, res: Response) {
  try {
    const answers = req.body; // JSON vom Frontend
    console.log('Empfangene Antworten: ', answers); // Debug-Ausgabe
    const filteredResults = await filterResults(answers);
    console.log('Gefilterte Ergebnisse: ', filteredResults); // Debug-Ausgabe
    res.json(filteredResults); // Antwort ans Frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler beim Filtern der Ergebnisse' });
  }
}