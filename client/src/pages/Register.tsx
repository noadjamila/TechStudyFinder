import React, { useState } from "react";
import { Box, Alert, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/buttons/PrimaryButton";
import BackButton from "../components/buttons/BackButton";
import InputField from "../components/login-register/InputField";
import FormHeader from "../components/login-register/FormHeader";
import theme from "../theme/theme";
import BottomHills from "../components/login-register/BottomHills";

/**
 * Validates the username based on registration requirements (at least 5 characters)
 * @param {string} username - The username to validate
 * @returns {{valid: boolean, message?: string}} Validation result with optional error message
 */
function validateUsername(username: string): {
  valid: boolean;
  message?: string;
} {
  if (!username || username.length < 5) {
    return {
      valid: false,
      message: "Username muss mindestens 5 Zeichen lang sein.",
    };
  }
  return { valid: true };
}

/**
 * Validates the password based on security requirements
 * Password must be 8-72 characters with at least one letter, number, and special character
 * @param {string} password - The password to validate
 * @returns {{valid: boolean, message?: string}} Validation result with optional error message
 */
function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (!password || password.length < 8) {
    return {
      valid: false,
      message: "Passwort muss mindestens 8 Zeichen lang sein.",
    };
  }
  if (password.length > 72) {
    return {
      valid: false,
      message: "Passwort darf maximal 72 Zeichen lang sein.",
    };
  }
  if (!/[A-Za-z]/.test(password)) {
    return {
      valid: false,
      message: "Passwort muss mindestens einen Buchstaben enthalten.",
    };
  }
  if (!/\d/.test(password)) {
    return {
      valid: false,
      message: "Passwort muss mindestens eine Zahl enthalten.",
    };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return {
      valid: false,
      message: "Passwort muss mindestens ein Sonderzeichen enthalten.",
    };
  }
  return { valid: true };
}

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

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !loading) {
      handleRegister();
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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <InputField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
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
          onKeyPress={handleKeyPress}
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
          onKeyPress={handleKeyPress}
          disabled={loading}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <BackButton
            label="Zurück"
            onClick={() => navigate(-1)}
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
                cursor: "pointer",
                fontWeight: "bold",
                textDecoration: "underline",
                "&:hover": {
                  color: theme.palette.detailspage.link,
                },
              }}
              onClick={() => navigate("/login")}
            >
              Login
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
    </Box>
  );
}
