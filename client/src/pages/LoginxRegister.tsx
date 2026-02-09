/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import FormHeader from "../components/login-register/FormHeader";
import theme from "../theme/theme";
import BottomHills from "../components/login-register/BottomHills";
import Register from "../components/login-register/Register";
import Login from "../components/login-register/Login";
import { loadQuizResults } from "../session/persistQuizResults";
import { saveQuizResults } from "../api/quizApi";
import { StudyProgramme } from "../types/StudyProgramme.types";
import AuthSuccessDialog from "../components/dialogs/AuthSuccessDialog";

/**
 * Login page component.
 * Allows users to log in with username and password.
 * Similar layout to Registration page with FormHeader, FormFields, and navigation.
 *
 * @returns {React.ReactElement} The login page
 */
export default function LoginxRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState<"login" | "register">("login");
  const [results, setResults] = useState<
    { studiengang_id: string; similarity?: number }[]
  >([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleSuccess = async () => {
    setShowSuccessDialog(true);

    if (Array.isArray(results) && results.length > 0) {
      try {
        await saveQuizResults(results);
      } catch (e) {
        console.error("Failed to save quiz results:", e);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const results = ((await loadQuizResults()) as StudyProgramme[]) ?? [];
        if (!isMounted) return;

        if (results.length > 0) {
          const mappedResults = results.map((item) => ({
            studiengang_id: item.studiengang_id,
            similarity: item.similarity ?? undefined,
          }));

          setResults(mappedResults);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Failed to load persisted quiz session:", error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: 360, sm: 400, md: 400 },
          position: "relative",
          zIndex: 1,
          pb: { xs: 18, sm: 20, md: 22 },
        }}
      >
        <FormHeader />

        {state == "login" ? (
          <Login
            onSuccess={async () => {
              handleSuccess();
            }}
          />
        ) : (
          <Register
            onSuccess={async () => {
              handleSuccess();
            }}
          />
        )}

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="body2">
            {state === "login" ? "Kein Konto? " : "Bereits registriert? "}
            <Typography
              component="span"
              variant="body2"
              sx={{
                cursor: "pointer",
                fontWeight: "bold",
                textDecoration: "underline",
                "&:hover": {
                  color: theme.palette.detailspage.link,
                },
              }}
              onClick={() => setState(state === "login" ? "register" : "login")}
            >
              {state === "login" ? "Registrieren" : "Login"}
            </Typography>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: theme.palette.detailspage.link,
                cursor: "pointer",
                textDecoration: "underline",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
              onClick={() => navigate("/datenschutz")}
            >
              Datenschutz
            </Typography>
          </Typography>
        </Box>
      </Box>
      <BottomHills />

      <AuthSuccessDialog
        open={showSuccessDialog}
        state={state}
        onClose={() => {
          const redirectTo = location.state?.redirectTo || "/";
          navigate(redirectTo);
        }}
      />
    </Box>
  );
}
