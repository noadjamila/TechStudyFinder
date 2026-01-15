import { NavigateFunction } from "react-router-dom";

/**
 * Handle API errors and navigate to error screen for specific error codes
 * @param error - The error response or Error object
 * @param navigate - React Router navigate function
 */
export function handleApiError(error: any, navigate: NavigateFunction) {
  // Check if it's a Response object
  if (error instanceof Response) {
    if (error.status === 500) {
      navigate("/error", {
        state: {
          code: 500,
          message:
            "Da ist wohl etwas schief gelaufen!\nProbier es später nochmal.",
        },
      });
      return;
    }
  }

  // Check if it's a fetch error or has a status property
  if (error?.status === 500) {
    navigate("/error", {
      state: {
        code: 500,
        message:
          "Da ist wohl etwas schief gelaufen!\nProbier es später nochmal.",
      },
    });
    return;
  }

  // For other errors, re-throw to let caller handle
  throw error;
}

/**
 * Wrapper for fetch that automatically handles 500 errors
 * @param navigate - React Router navigate function
 * @returns fetch wrapper function
 */
export function createApiClient(navigate: NavigateFunction) {
  return async function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
    try {
      const response = await fetch(input, init);

      if (response.status === 500) {
        navigate("/error", {
          state: {
            code: 500,
            message:
              "Da ist wohl etwas schief gelaufen!\nProbier es später nochmal.",
          },
        });
        throw new Error("Server error");
      }

      return response;
    } catch (error) {
      handleApiError(error, navigate);
      throw error;
    }
  };
}
