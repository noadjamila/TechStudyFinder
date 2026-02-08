/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import * as React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { SpeechBubble } from "../components/error-screen/SpeechBubble";
import PrimaryButton from "../components/buttons/PrimaryButton";
import SecondaryButton from "../components/buttons/SecondaryButton";

type ErrorScreenProps = {
  /** HTTP status or custom error code */
  code?: number | string;

  /** Optional headline above the bubble ("Ooops!") */
  title?: string;

  /** Main error message shown inside the speech bubble */
  message?: string;

  /** Max width of the content */
  maxWidth?: number;
};

/**
 * Displays error pages for 404, 401, and 500 errors.
 * Shows error code and a speech bubble with the error message.
 * Provides navigation options to reload, go back, or return to the home page.
 * Accessible at '/error' with error details passed via location state.
 *
 * @param {number | string} [code] - HTTP status code or custom error code
 * @param {string} [title] - Error title displayed in the speech bubble
 * @param {string} [message] - Error message shown to the user
 * @param {number} [maxWidth] - Maximum width of the speech bubble content
 */
export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  code: propCode,
  title = "Oooops!",
  message: propMessage,
  maxWidth = 360,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use props or fallback to location.state
  const code = propCode ?? location.state?.code;
  const message =
    propMessage ?? location.state?.message ?? "Ein Fehler ist aufgetreten.";
  const intendedDestination = location.state?.originalUrl;

  const handleReload = () => {
    if (intendedDestination) {
      navigate(intendedDestination);
    } else {
      window.location.reload();
    }
  };

  React.useEffect(() => {
    // Prevent all scrolling
    const html = document.documentElement;
    const body = document.body;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.height = "100%";
    body.style.height = "100%";

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
      html.style.height = "";
      body.style.height = "";
    };
  }, []);

  return (
    <Box
      role="alert"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        maxWidth: "100vw",
        maxHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        padding: 0,
      }}
    >
      {code && (
        <Typography
          variant="errorScreenTitle"
          color="secondary"
          sx={{
            position: "absolute",
            top: { xs: "40%", md: "43.5%" },
            left: "50%",
            transform: "translate(-50%, calc(-50% - 120px))",
            zIndex: 2,
          }}
        >
          {code}
        </Typography>
      )}

      <Box sx={{ ml: 13, mb: 20 }}>
        <SpeechBubble maxWidth={maxWidth}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Typography variant="body1" fontWeight={600}>
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ whiteSpace: "pre-line", textAlign: "center" }}
            >
              {message}
            </Typography>
          </Box>
        </SpeechBubble>
      </Box>

      <Box
        component="img"
        src="/mascot_standing_grey_sad.svg"
        alt="Mascot"
        sx={{
          position: "absolute",
          bottom: "35%",
          left: { xs: "13%", sm: "35%", md: "33%", lg: "43%" },
          width: { xs: 60, sm: 55, md: 55, lg: 55 },
          zIndex: 1,
          objectFit: "contain",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        {code === 500 && (
          <SecondaryButton label="Seite neu laden" onClick={handleReload} />
        )}
        <PrimaryButton
          label="Zurück zur vorherigen Seite"
          onClick={() => navigate(-1)}
        />
        <SecondaryButton label="Zur Startseite" onClick={() => navigate("/")} />
      </Box>
    </Box>
  );
};
