import { Request, Response } from 'express';
import { filterLevel1 } from '../services/quiz.service';
import { filterLevel2 } from '../services/quiz.service';
import { filterLevel3 } from '../services/quiz.service';

export async function filterLevel(
  req: Request<{}, {}, FilterRequest>,
  res: Response
) {
  const { level, newAnswers, studyProgrammeIds } = req.body;

  console.log("Payload:", { level, newAnswers, studyProgrammeIds });

  try {
    let result;

    if (level === 1) {
      result = await filterLevel1(newAnswers);
    } 
    else if (level === 2) {
      result = await filterLevel2(studyProgrammeIds, newAnswers);
    } 
    else if (level === 3) {
      result = await filterLevel3(studyProgrammeIds, newAnswers);
    }

    return res.status(200).json({
      success: true,
      ids: result
    });
  } catch (err) {
    return res.status(500).json({ error: "Filter error" });
  }
}

// export async function filterLevel1(req: Request, res: Response) {
//   try {
//     const answers = req.body;
//     console.log("Empfangene Antworten:", answers);

//     const filteredResults = await filterResults(answers);
//     console.log("Gefilterte Ergebnisse:", filteredResults);

//     // Erfolgreich → Status 200 (OK)
//     res
//       .status(200)
//       .json({
//         success: true,
//         data: filteredResults,
//         message: "Ergebnisse erfolgreich gefiltert"
//       });
//   } catch (error) {
//     console.error(error);

//     // Fehler → Status 500 (Internal Server Error)
//     res
//       .status(500)
//       .json({
//         success: false,
//         message: "Fehler beim Filtern der Ergebnisse",
//         error: (error as Error).message
//       });
//   }
// }
