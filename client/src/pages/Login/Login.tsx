import { useState } from "react";
import { Box, Alert, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import BackButton from "../../components/buttons/BackButton";
import FormField from "../../components/login-register/FormField";
import FormHeader from "../../components/login-register/FormHeader";
import theme from "../../theme/theme";
import BottomHills from "../../components/login-register/BottomHills";

/**
 * Login page component.
 * Allows users to log in with username and password.
 * Similar layout to Registration page with FormHeader, FormFields, and navigation.
 *
 * @returns {React.ReactElement} The login page
 */
export default function Login() {
  const navigate = useNavigate();
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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error responses from the server
        if (response.status === 401) {
          setError("Username oder Passwort ist ungültig");
        } else {
          setError(data.error || "Login fehlgeschlagen");
        }
        return;
      }

      // Navigate to home page after successful login
      navigate("/home");
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
        pl: 2,
        pr: 2,
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

        <Box sx={{ mb: 3 }}>
          <BackButton
            label="Zurück"
            onClick={() => navigate("/")}
            disabled={loading}
          />
        </Box>

        <FormField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />

        <FormField
          label="Passwort"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <PrimaryButton
            label={loading ? "Login..." : "Login"}
            onClick={handleLogin}
            disabled={loading || username.length < 5 || password.length < 8}
            sx={{
              width: "auto",
            }}
          />
        </Box>

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="body2">
            Kein Konto?{" "}
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: theme.palette.decorative.blue,
                cursor: "pointer",
                fontWeight: "bold",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate("/register")}
            >
              Registrieren
            </Typography>
          </Typography>
        </Box>
      </Box>
      <BottomHills />
    </Box>
  );
}
