import { useState } from "react";
import { Box, Alert, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import BackButton from "../../components/buttons/BackButton";
import FormField from "../../components/login-register/FormField";
import FormHeader from "../../components/login-register/FormHeader";
import theme from "../../theme/theme";
import BottomHills from "../../components/login-register/BottomHills";

// Password validation rules (must match server-side)
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

// Registration page component
export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);

    // Validation of Username and Password
    if (!username.trim()) {
      setError("Bitte gib einen Username ein");
      return;
    }
    if (!password.trim()) {
      setError("Bitte gib ein Passwort ein");
      return;
    }

    // Validate password strength
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
        // Handle specific error responses from the server
        if (response.status === 409) {
          setError("Username existiert bereits");
        } else {
          // Server errors are already in German
          setError(data.error || "Registrierung fehlgeschlagen");
        }
        return;
      }

      // Navigate to login page after successful registration
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
        />

        <FormField
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
              !confirmPassword.trim() ||
              password !== confirmPassword ||
              !validatePassword(password).valid
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
