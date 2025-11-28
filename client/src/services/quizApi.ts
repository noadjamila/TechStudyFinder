interface Level1Payload {
  level: 1;
  answers: [{ studientyp: string }] | [];
}

interface FilterResponse {
  ids: number[];
}

const API_BASE_URL = "http://localhost:5001/api/quiz";

/**
 * documentation
 */
export async function postFilterLevel(
  payload: Level1Payload,
): Promise<FilterResponse> {
  const endpoint = `${API_BASE_URL}/filter`;

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
    console.error("Fehler beim API-Aufruf (postFilterLevel):", err);
    throw new Error(
      "Konnte keine Verbindung zum Backend herstellen oder Daten verarbeiten.",
    );
  }
}
