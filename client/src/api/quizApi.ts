import {
  QuizFilterPayload,
  FilterResponse,
  QuizLevelResponse,
} from "../types/QuizApi.types";
import { RiasecType } from "../types/RiasecTypes";
import { StudyProgramme } from "../types/StudyProgramme.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Sends the user's answers to the backend filtering endpoint.
 *
 * @param {QuizFilterPayload} payload The data containing the level and answers.
 * @returns {Promise<FilterResponse>} A promise resolving to an object with the filtered IDs array.
 * @throws {Error} Throws if the network request or response processing fails.
 */
export async function postFilterLevel(
  payload: QuizFilterPayload,
): Promise<FilterResponse> {
  const endpoint = `${API_BASE_URL}/quiz/filter`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("[postFilterLevel] Error during API call:", err);
    throw new Error("Could not connect to the backend or process data.");
  }
}

/**
 * Fetches quiz questions for a specific level from the backend.
 *
 * @param {number} level The quiz level (1, 2, etc.).
 * @returns {Promise<QuizLevelResponse>} A promise resolving to questions for the level.
 * @throws {Error} Throws if the network request fails or no questions are found.
 */
export async function getQuizLevel(level: number): Promise<QuizLevelResponse> {
  const endpoint = `${API_BASE_URL}/quiz/level/${level}`;

  try {
    const res = await fetch(endpoint);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (!data.questions || data.questions.length === 0) {
      throw new Error("No questions found in the response.");
    }

    return data;
  } catch (err) {
    console.error("[getQuizLevel] Error during API call:", err);
    throw new Error("Could not fetch quiz questions from the backend.");
  }
}
/**
 * Fetches level 2 questions from the backend API on component mount.
 * Handles errors and updates the local state with the fetched questions.
 */
export async function fetchQuestions() {
  const res = await fetch("/api/quiz/level/2");

  if (!res.ok) {
    throw new Error("Failed to load level 2 questions");
  }

  const data = await res.json();

  return data.questions as {
    id: string;
    text: string;
    riasec_type: RiasecType;
  }[];
}

// const [error, setError] = useState<{ title: string; message: string } | null>(
//   null,
// );
// export async function fetchQuestions() {
//   try {
//     const res = await fetch(`/api/quiz/level/${2}`);

//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }

//     const data = await res.json();

//     if (!data.questions || data.questions.length === 0) {
//       throw new Error("No questions found in the response.");
//     }

//     return data.questions as {
//       id: string;
//       text: string;
//       riasec_type: RiasecType;
//     }[];
//   } catch (err) {
//     console.error(err);
//     setError({
//       title: "Fehler beim Laden der Fragen",
//       message:
//         "Die Fragen konnten nicht geladen werden. Bitte versuche es später erneut.",
//     });
//   }
// };

/**
 * Fetches a single study programme by ID from the backend.
 *
 * @param {string} id The study programme ID.
 * @returns {Promise<StudyProgramme | null>} The study programme data, or null if not found.
 * @throws {Error} Throws if the network request fails (not for 404).
 */
export async function getStudyProgrammeById(
  id: string,
): Promise<StudyProgramme | null> {
  const endpoint = `${API_BASE_URL}/quiz/study-programme/${id}`;

  const res = await fetch(endpoint);

  // Not found - return null (caller will log if needed)
  if (res.status === 404) {
    return null;
  }

  // Any other error should throw
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data = await res.json();
  return data.studyProgramme ?? null;
}
