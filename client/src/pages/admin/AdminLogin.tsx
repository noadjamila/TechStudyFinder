import { useState } from "react";
import { Box, Alert, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import FormField from "../../components/login-register/InputField";
import theme from "../../theme/theme";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

/**
 * Login page component.
 * Allows users to log in with username and password.
 * Similar layout to Registration page with FormHeader, FormFields, and navigation.
 *
 * @returns {React.ReactElement} The login page
 */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
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

      navigate("/admin");
    } catch (err) {
      console.error("Admin Login failed: ", err);
      setError("Login fehlgeschlagen: " + err);
      setUsername("");
      setPassword("");
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 0, mb: 4 }}>
          <Box
            component="img"
            src="/logo.png"
            alt="Logo"
            sx={{ width: 50, height: 50 }}
          />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Tech Study Finder
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.error.main,
                fontWeight: 600,
                letterSpacing: 0.6,
                textTransform: "uppercase",
                mt: 0.6,
              }}
            >
              ADMIN-BEREICH
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

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

        <Box sx={{ display: "flex", justifyContent: "end" }}>
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
    </Box>
  );
}
