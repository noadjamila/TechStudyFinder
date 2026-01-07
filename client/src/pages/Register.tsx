import { useState } from "react";
import { Box, Alert, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/buttons/PrimaryButton";
import BackButton from "../components/buttons/BackButton";
import FormHeader from "../components/login-register/FormHeader";
import theme from "../theme/theme";
import BottomHills from "../components/login-register/BottomHills";
import InputField from "../components/InputField";
import {
  validatePassword,
  validateUsername,
} from "../services/credentialsValidation";

/**
 * Registration page component for user account creation
 * Handles username and password validation with form submission
 * @component
 * @returns {JSX.Element} Register form with validation
 */
export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);

    /**
     * Validates username and password fields before submission
     * Ensures all fields are filled and meet strength requirements
     */
    if (!username.trim()) {
      setError("Bitte gib einen Username ein");
      return;
    }

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      setError(usernameValidation.message || "Username is invalid");
      return;
    }

    if (!password.trim()) {
      setError("Bitte gib ein Passwort ein");
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message || "Password is invalid");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        /**
         * Handles various error responses from the server
         * Returns specific error messages based on HTTP status code
         */
        if (response.status === 409) {
          setError("Username existiert bereits");
        } else {
          setError(data.error || "Registrierung fehlgeschlagen");
        }
        return;
      }

      navigate("/login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ein unbekannter Fehler ist aufgetreten",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: theme.spacing(2),
        pt: { xs: 8, sm: 12, md: 16, lg: 18 },
        p: "30px",
        pb: 4,
        "@media (max-width: 375px)": {
          pt: 6,
          pb: 2,
          pl: 2,
          pr: 2,
        },
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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <InputField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          helperText={
            !validateUsername(username).valid
              ? "Dein Username muss mindestens aus 5 Zeichen bestehen"
              : ""
          }
        />

        <InputField
          label="Passwort"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          helperText={
            !validatePassword(password).valid
              ? "Dein Passwort muss mindestens aus 8 Zeichen bestehen, davon mindestens eine Zahl, ein Buchstabe und ein Sonderzeichen."
              : ""
          }
        />

        <InputField
          label="Passwort bestätigen"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <BackButton
            label="Zurück"
            onClick={() => navigate("/")}
            disabled={loading}
          />
          <PrimaryButton
            label={loading ? "Registrierung..." : "Registrieren"}
            onClick={handleRegister}
            disabled={
              loading ||
              !username.trim() ||
              !password.trim() ||
              !confirmPassword.trim()
            }
            sx={{
              width: "auto",
            }}
          />
        </Box>

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="body2">
            Bereits registriert?{" "}
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: theme.palette.text.primary,
                cursor: "pointer",
                fontWeight: "bold",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Typography>
          </Typography>
        </Box>
      </Box>
      <BottomHills />
    </Box>
  );
}
