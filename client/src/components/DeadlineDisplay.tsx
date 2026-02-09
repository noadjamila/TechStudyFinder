/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import { Box, Typography } from "@mui/material";
import { Deadline } from "../types/StudyProgramme.types";

/**
 * Information about a deadline type including its category, display label, and sort order.
 */
interface DeadlineTypeInfo {
  /** The category this deadline belongs to (application, aptitude, registration, lecture) */
  category: string;
  /** The human-readable label to display for this deadline type */
  label: string;
  /** Sort order within the category (lower numbers appear first) */
  order: number;
}

/**
 * Maps deadline type identifiers to their display information and categorization.
 * Used to organize and label different types of deadlines consistently.
 */
const deadlineTypeMap: Record<string, DeadlineTypeInfo> = {
  application_restricted: {
    category: "application",
    label: "Zulassungsbeschränkt",
    order: 1,
  },
  application_unrestricted: {
    category: "application",
    label: "Zulassungsfrei",
    order: 2,
  },
  application_eu: {
    category: "application",
    label: "EU",
    order: 3,
  },
  application_non_eu: {
    category: "application",
    label: "Nicht-EU",
    order: 4,
  },
  application_unrestricted_eu: {
    category: "application",
    label: "Zulassungsfrei (EU)",
    order: 5,
  },
  application_unrestricted_non_eu: {
    category: "application",
    label: "Zulassungsfrei (Nicht-EU)",
    order: 6,
  },
  registration_unrestricted: {
    category: "registration",
    label: "Einschreibefrist",
    order: 7,
  },
  application_aptitude_test: {
    category: "aptitude",
    label: "Bewerbung zur Eignungsprüfung",
    order: 8,
  },
  aptitude_test: {
    category: "aptitude",
    label: "Eignungsprüfung",
    order: 9,
  },
  lecture_period: {
    category: "lecture",
    label: "Vorlesungszeit",
    order: 10,
  },
};

/**
 * Formats a date string into German locale format (DD.MM.YYYY).
 *
 * @param dateStr - The date string to format (ISO format expected)
 * @returns Formatted date string in German format, or empty string if input is null/undefined
 */
const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Formats a date range into a human-readable German string.
 * Handles various cases: both dates, only start date, only end date, or no dates.
 *
 * @param startDate - The start date of the range
 * @param endDate - The end date of the range
 * @returns Formatted date range string (e.g., "15.01.2026 – 31.03.2026", "ab 15.01.2026", "bis 31.03.2026")
 */
const formatDateRange = (
  startDate: string | null | undefined,
  endDate: string | null | undefined,
): string => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  if (start && end) return `${start} – ${end}`;
  if (start) return `ab ${start}`;
  if (end) return `bis ${end}`;
  return "";
};

/**
 * Props for the DeadlineDisplay component.
 */
interface DeadlineDisplayProps {
  /** Array of deadlines to display, grouped and formatted by category */
  fristen: Deadline[];
}

/**
 * Displays study programme deadlines organized into categories.
 *
 * @param props - Component props
 * @returns Formatted deadline display or null if no deadlines
 */
const DeadlineDisplay: React.FC<DeadlineDisplayProps> = ({ fristen }) => {
  // Group deadlines by category
  const groupedDeadlines = fristen.reduce(
    (acc, deadline) => {
      const typeInfo = deadlineTypeMap[deadline.typ];
      if (!typeInfo) return acc;

      if (!acc[typeInfo.category]) {
        acc[typeInfo.category] = [];
      }
      acc[typeInfo.category].push({ ...deadline, typeInfo });
      return acc;
    },
    {} as Record<string, Array<Deadline & { typeInfo: DeadlineTypeInfo }>>,
  );

  // Sort deadlines within each category
  Object.values(groupedDeadlines).forEach((deadlines) => {
    deadlines.sort((a, b) => a.typeInfo.order - b.typeInfo.order);
  });

  /**
   * Checks if EU and Non-EU application deadlines have identical dates.
   * Used to determine whether to merge them into a single "Alle" entry.
   *
   * @param category - The deadline category to check
   * @returns True if both EU and Non-EU deadlines exist and have matching dates
   */
  const shouldMergeEuNonEu = (category: string) => {
    const deadlines = groupedDeadlines[category] || [];
    const eu = deadlines.find((d) => d.typ === "application_eu");
    const nonEu = deadlines.find((d) => d.typ === "application_non_eu");

    if (eu && nonEu) {
      return eu.start === nonEu.start && eu.ende === nonEu.ende;
    }
    return false;
  };

  /**
   * Renders a single deadline entry with its label, dates, semester, and comments.
   *
   * @param deadline - The deadline to render with its type information
   * @param index - Optional index for generating unique React keys
   * @returns JSX element displaying the deadline, or null if it should be skipped
   */
  const renderDeadline = (
    deadline: Deadline & { typeInfo: DeadlineTypeInfo },
    index?: number,
  ) => {
    // Create unique key combining type, dates, and index
    const uniqueKey = `${deadline.typ}-${deadline.start}-${deadline.ende}-${index ?? ""}`;

    return (
      <Box key={uniqueKey} sx={{ mb: 1 }}>
        <Typography component="span" sx={{ fontWeight: 600, mr: 1 }}>
          {deadline.typeInfo.label}:
        </Typography>
        <Typography component="span">
          {formatDateRange(deadline.start, deadline.ende)}
        </Typography>
        {deadline.semester && (
          <Typography component="div" sx={{ fontSize: "0.9rem", mt: 0.5 }}>
            Semester {deadline.semester}
          </Typography>
        )}
        {deadline.kommentar && (
          <Typography
            component="div"
            sx={{
              fontSize: "0.9rem",
              fontStyle: "italic",
              mt: 0.5,
              wordBreak: "break-word",
            }}
          >
            {deadline.kommentar}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box>
      {/* Bewerbung & Einschreibung */}
      {(groupedDeadlines.application || groupedDeadlines.registration) && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 2, fontSize: "1.25rem" }}
          >
            Bewerbung & Einschreibung
          </Typography>

          {groupedDeadlines.application && (
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>
                Bewerbungsfrist:
              </Typography>
              <Box sx={{ pl: 2 }}>
                {shouldMergeEuNonEu("application") ? (
                  <>
                    {groupedDeadlines.application
                      .filter(
                        (d) =>
                          !["application_eu", "application_non_eu"].includes(
                            d.typ,
                          ),
                      )
                      .map((d, idx) => renderDeadline(d, idx))}
                    {groupedDeadlines.application.find(
                      (d) => d.typ === "application_eu",
                    ) && (
                      <Box sx={{ mb: 1 }}>
                        <Typography
                          component="span"
                          sx={{ fontWeight: 600, mr: 1 }}
                        >
                          Alle:
                        </Typography>
                        <Typography component="span">
                          {formatDateRange(
                            groupedDeadlines.application.find(
                              (d) => d.typ === "application_eu",
                            )?.start,
                            groupedDeadlines.application.find(
                              (d) => d.typ === "application_eu",
                            )?.ende,
                          )}
                        </Typography>
                      </Box>
                    )}
                  </>
                ) : (
                  groupedDeadlines.application.map((d, idx) =>
                    renderDeadline(d, idx),
                  )
                )}
              </Box>
            </Box>
          )}

          {groupedDeadlines.registration?.map((d, idx) =>
            renderDeadline(d, idx),
          )}
        </Box>
      )}

      {/* Eignungsprüfung */}
      {groupedDeadlines.aptitude && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 2, fontSize: "1.25rem" }}
          >
            Eignungsprüfung
          </Typography>
          <Box sx={{ pl: 2 }}>
            {groupedDeadlines.aptitude.map((d, idx) => renderDeadline(d, idx))}
          </Box>
        </Box>
      )}

      {/* Vorlesungszeit */}
      {groupedDeadlines.lecture && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 2, fontSize: "1.25rem" }}
          >
            Vorlesungszeit
          </Typography>
          <Box sx={{ pl: 2 }}>
            {groupedDeadlines.lecture.map((d, idx) => renderDeadline(d, idx))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DeadlineDisplay;
