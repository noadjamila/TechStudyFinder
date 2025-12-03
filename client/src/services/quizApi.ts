/**
 * Interface defining the payload structure for Level 1 quiz filtering.
 * The user's answer(s) for Level 1, specifically the studientyp.
 */

interface Level1Payload {
  level: 1;
  answers: [{ studientyp: string }] | [];
}

/**
 * Interface defining the expected response structure from the filtering endpoint.
 */
interface FilterResponse {
  ids: number[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Sends the user's Level 1 answers to the backend filtering endpoint.
 *
 * @param {Level1Payload} payload The data containing the level and answers.
 * @returns {Promise<FilterResponse>} A promise resolving to an object with the filtered IDs array.
 * @throws {Error} Throws if the network request or response processing fails.
 */
export async function postFilterLevel(
  payload: Level1Payload,
): Promise<FilterResponse> {
  const endpoint = `${API_BASE_URL}/api/quiz/filter`;

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

    const result: FilterResponse = await res.json();
    return result;
  } catch (err) {
    console.error("Error during API call (postFilterLevel):", err);
    throw new Error("Could not connect to the backend or process data.");
  }
}
