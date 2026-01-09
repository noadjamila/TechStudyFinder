import { useState } from "react";
import { Box, Alert, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import BackButton from "../../components/buttons/BackButton";
import FormField from "../../components/login-register/InputField";
import FormHeader from "../../components/login-register/FormHeader";
import theme from "../../theme/theme";
import BottomHills from "../../components/login-register/BottomHills";
import LoginResultDialog from "../../components/dialogs/LoginResultDialog";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Login page component.
 * Allows users to log in with username and password.
 * Similar layout to Registration page with FormHeader, FormFields, and navigation.
 *
 * @returns {React.ReactElement} The login page
 */
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

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
      // Show success popup
      setLoginSuccess(true);
      setShowResultDialog(true);
    } catch {
      // On error, show inline error message and clear both fields
      setError("Login fehlgeschlagen - bitte versuche es erneut!");
      setUsername("");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const handleResultDialogClose = () => {
    setShowResultDialog(false);
    if (loginSuccess) {
      // Redirect to the intended destination, or home if not specified
      const redirectTo = location.state?.redirectTo || "/";
      navigate(redirectTo);
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

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <BackButton
            label="Zurück"
            onClick={() => navigate("/")}
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
      <LoginResultDialog
        open={showResultDialog}
        success={loginSuccess}
        onClose={handleResultDialogClose}
      />
    </Box>
  );
}
