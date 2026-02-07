import {
  QuizFilterPayload,
  FilterResponse,
  QuizLevelResponse,
} from "../types/QuizApi.types";
import { StudyProgramme } from "../types/StudyProgramme.types";
import { RiasecType } from "../types/RiasecTypes";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Sends the user's answers to the backend filtering endpoint.
 *
 * @param {QuizFilterPayload} payload The data containing the level and answers.
 * @param fetchFn Optional custom fetch function (for error handling)
 * @returns {Promise<FilterResponse>} A promise resolving to an object with the filtered IDs array.
 * @throws {Error} Throws if the network request or response processing fails.
 */
export async function postFilterLevel(
  payload: QuizFilterPayload,
  fetchFn: typeof fetch = fetch,
): Promise<FilterResponse> {
  const endpoint = `${API_BASE_URL}/quiz/filter`;

  try {
    const res = await fetchFn(endpoint, {
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
 * @param fetchFn Optional custom fetch function (for error handling)
 * @returns {Promise<QuizLevelResponse>} A promise resolving to questions for the level.
 * @throws {Error} Throws if the network request fails or no questions are found.
 */
export async function getQuizLevel(
  level: number,
  fetchFn: typeof fetch = fetch,
): Promise<QuizLevelResponse> {
  const endpoint = `${API_BASE_URL}/quiz/level/${level}`;

  try {
    const res = await fetchFn(endpoint);

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
 * Fetches a single study programme by ID from the backend.
 *
 * @param {string} id The study programme ID.
 * @param fetchFn Optional custom fetch function (for error handling)
 * @returns {Promise<StudyProgramme | null>} The study programme data, or null if not found.
 * @throws {Error} Throws if the network request fails (not for 404).
 */
export async function getStudyProgrammeById(
  id: string,
  fetchFn: typeof fetch = fetch,
): Promise<StudyProgramme | null> {
  const endpoint = `${API_BASE_URL}/quiz/study-programme/${id}`;

  const res = await fetchFn(endpoint);

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

/**
 * Saves quiz results for the authenticated user.
 *
 * @param {Array} results Array of result objects with studiengang_id and optional similarity.
 * @returns {Promise<void>} A promise that resolves when results are saved.
 * @throws {Error} Throws if the network request fails or user is not authenticated.
 */
export async function saveQuizResults(
  results: Array<string | { studiengang_id: string; similarity?: number }>,
): Promise<void> {
  const endpoint = `${API_BASE_URL}/quiz/results`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include session cookie
    body: JSON.stringify({ resultIds: results }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || `HTTP error! status: ${res.status}`);
  }
}

/**
 * Retrieves saved quiz results for the authenticated user.
 *
 * @returns {Promise<Array | null>} Array of result objects with studiengang_id and optional similarity, or null if no results found.
 * @throws {Error} Throws if the network request fails or user is not authenticated.
 */
export async function getQuizResults(): Promise<Array<{
  studiengang_id: string;
  similarity?: number;
}> | null> {
  const endpoint = `${API_BASE_URL}/quiz/results`;

  const res = await fetch(endpoint, {
    method: "GET",
    credentials: "include", // Include session cookie
  });

  if (res.status === 404) {
    // No results found - not an error
    return null;
  }

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || `HTTP error! status: ${res.status}`);
  }

  const data = await res.json();
  return data.resultIds;
}

/**
 * Fetches level 2 questions from the backend API on component mount.
 * Handles errors and updates the local state with the fetched questions.
 * @returns {Promise<{ id: string; text: string; riasec_type: RiasecType; }[]>} An array of level 2 questions.
 * @throws {Error} Throws if the network request fails.
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
