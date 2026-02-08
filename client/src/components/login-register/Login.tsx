import React, { useState } from "react";
import { Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../buttons/PrimaryButton";
import BackButton from "../buttons/BackButton";
import FormField from "./InputField";
import { useAuth } from "../../contexts/AuthContext";

interface LoginProps {
  onSuccess: () => Promise<void>;
}

/**
 * Login page component.
 * Allows users to log in with username and password.
 * Similar layout to Registration page with FormHeader, FormFields, and navigation.
 *
 * @returns {React.ReactElement} The login page
 */
const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);

    // Validation of Username and Password
    if (!username.trim()) {
      setError("Bitte gib einen Username ein");
      return;
    }
    if (!password.trim()) {
      setError("Bitte gib dein Passwort ein");
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      onSuccess();
    } catch {
      // On error, show inline error message and clear both fields
      setError("Login fehlgeschlagen - bitte versuche es erneut!");
      setUsername("");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <FormField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
        inputProps={{ "aria-label": "Username" }}
      />

      <FormField
        label="Passwort"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
        sx={{ mb: 3 }}
        inputProps={{ "aria-label": "Passwort" }}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <BackButton
          label="Zurück"
          onClick={() => navigate(-1)}
          disabled={loading}
        />
        <PrimaryButton
          label={loading ? "Login..." : "Login"}
          onClick={handleLogin}
          disabled={loading}
          sx={{
            width: "auto",
          }}
        />
      </Box>
    </Box>
  );
};

export default Login;
