/**
 * Adds a study programme to the user's favorites
 * @param studiengangId The ID of the study programme to add
 * @param fetchFn Optional custom fetch function (for error handling)
 * @returns Promise resolving when the favorite is added
 * @throws Error if the request fails
 */
export async function addFavorite(
  studiengangId: string,
  fetchFn: typeof fetch = fetch,
): Promise<void> {
  const res = await fetchFn("/api/users/favorites", {
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
 * @param fetchFn Optional custom fetch function (for error handling)
 * @returns Promise resolving when the favorite is removed
 * @throws Error if the request fails
 */
export async function removeFavorite(
  programmeId: string,
  fetchFn: typeof fetch = fetch,
): Promise<void> {
  const res = await fetchFn(`/api/users/favorites/${programmeId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
}

/**
 * Fetches the user's favorite study programmes
 * @param fetchFn Optional custom fetch function (for error handling)
 * @returns Promise resolving to an array of favourite study programme IDs
 * @throws Error if the request fails
 */
export async function getFavorites(
  fetchFn: typeof fetch = fetch,
): Promise<string[]> {
  const res = await fetchFn("/api/users/favorites", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  const data = await res.json();
  return data.favorites || [];
}
