/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { navigateTo500Error } from "../utils/errorHandler";

/**
 * Custom hook that provides a fetch wrapper with automatic 500 error handling
 * @returns apiFetch function that redirects to error screen on 500 errors
 */
export function useApiClient() {
  const navigate = useNavigate();

  const apiFetch = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const response = await fetch(input, init);

        if (response.status === 500) {
          navigateTo500Error(navigate);
          throw new Error("Server error");
        }

        return response;
      } catch (error) {
        // If it's already a navigation error, don't re-throw
        if (error instanceof Error && error.message === "Server error") {
          throw error;
        }
        // For network errors, also redirect to 500
        navigateTo500Error(navigate);
        throw error;
      }
    },
    [navigate],
  );

  return { apiFetch };
}
