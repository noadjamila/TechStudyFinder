/**
 * Adds a study programme to the user's favorites
 * @param studiengangId The ID of the study programme to add
 * @returns Promise resolving when the favorite is added
 * @throws Error if the request fails
 */
export async function addFavorite(studiengangId: string): Promise<void> {
  const res = await fetch("/api/users/favorites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ studiengangId }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
}

/**
 * Removes a study programme from the user's favorites
 * @param programmeId The ID of the study programme to remove
 * @returns Promise resolving when the favorite is removed
 * @throws Error if the request fails
 */
export async function removeFavorite(programmeId: string): Promise<void> {
  const res = await fetch(`/api/users/favorites/${programmeId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
}

/**
 * Fetches the user's favorite study programmes
 * @returns Promise resolving to an array of favourite study programme IDs
 * @throws Error if the request fails
 */
export async function getFavorites(): Promise<string[]> {
  const res = await fetch("/api/users/favorites", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  const data = await res.json();
  return data.favorites || [];
}
