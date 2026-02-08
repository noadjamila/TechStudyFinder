import React, { useState } from "react";
import { Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../buttons/PrimaryButton";
import BackButton from "../buttons/BackButton";
import InputField from "../login-register/InputField";
import {
  validatePassword,
  validateUsername,
} from "../../services/credentialsValidation";

interface RegisterProps {
  onSuccess: () => Promise<void>;
}

/**
 * Registration page component for user account creation
 * Handles username and password validation with form submission
 * @component
 * @returns {JSX.Element} Register form with validation
 */
const Register: React.FC<RegisterProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);

    if (!username.trim()) {
      setError("Bitte gib einen Username ein");
      return;
    }

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      setError(usernameValidation.message || "Username ist ungültig");
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
        if (response.status === 409) {
          setError("Username existiert bereits");
        } else {
          setError(data.error || "Registrierung fehlgeschlagen");
        }
        return;
      }

      onSuccess();
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
    <Box>
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
        inputProps={{ "aria-label": "Username" }}
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
        inputProps={{ "aria-label": "Password" }}
      />

      <InputField
        label="Passwort bestätigen"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
        sx={{ mb: 3 }}
        inputProps={{ "aria-label": "Password-Confirm" }}
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
          disabled={loading}
          sx={{
            width: "auto",
          }}
        />
      </Box>
    </Box>
  );
};

export default Register;
