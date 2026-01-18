import { NavigateFunction } from "react-router-dom";

/**
 * Navigate to 500 error screen with standard message
 * @param navigate - React Router navigate function
 * @param intendedDestination - Optional URL of the page that caused the error (for retry, clicking the reload button)
 */
export function navigateTo500Error(
  navigate: NavigateFunction,
  intendedDestination?: string,
) {
  navigate("/error", {
    state: {
      code: 500,
      message: "Da ist wohl etwas schief gelaufen!\nProbier es später nochmal.",
      originalUrl: intendedDestination || window.location.pathname,
    },
  });
}
