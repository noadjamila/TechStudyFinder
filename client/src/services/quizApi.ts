/**
 * Interface defining the payload structure for Level 1 quiz filtering.
 * The user's answer(s) for Level 1, specifically the studientyp.
 */
interface QuizFilterPayload {
  level: number;
  answers: any[];
  studyProgrammeIds?: number[]; // used in Level 2 and 3
}

/**
 * Interface defining the expected response structure from the filtering endpoint.
 */
interface FilterResponse {
  ids: number[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Sends the user's Level 1 answers to the backend filtering endpoint.
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
