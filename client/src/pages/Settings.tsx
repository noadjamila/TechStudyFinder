import { Box, Alert } from "@mui/material";
import MainLayout from "../layouts/MainLayout";
import PrimaryButton from "../components/buttons/PrimaryButton";
import SecondaryButton from "../components/buttons/SecondaryButton";
import Dialog from "../components/dialogs/Dialog";
import InputField from "../components/InputField";
import Headline from "../components/Headline";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { changePassword, deleteUser } from "../api/authApi";
import { validatePassword } from "../services/passwordValidation";

/**
 * Manages the settings of a user.
 * The user can change their password and delete their profile.
 * Accessible at '/settings'.
 *
 * @returns {JSX.Element} The user's settings page.
 */
export default function Settings() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [openDialog, setDialogOpen] = useState(false);

  const { user, logout } = useAuth();

  const change_password = async () => {
    if (!password.trim()) {
      setError("Bitte gib dein Passwort ein");
      return;
    }
    if (!newPassword.trim()) {
      setError("Bitte gib dein neues Passwort ein");
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.valid) {
      setError(validation.message ?? "Das Passwort ist ungültig.");
      return;
    }

    setLoading(true);
    try {
      const success = await changePassword(password, newPassword);
      if (!success) {
        throw new Error("Passwortänderung fehlgeschlagen");
      }
      setSuccess("Passwort erfolgreich geändert.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ein unerwarteter Fehler ist aufgetreten",
      );
    } finally {
      setLoading(false);
      setPassword("");
      setNewPassword("");
      setTimeout(() => setError(null), 5000);
      setTimeout(() => setSuccess(null), 5000);
    }
  };

  const deleteProfile = async () => {
    try {
      const success = await deleteUser();
      if (!success) {
        throw new Error();
      }
      logout();
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ein unbekannter Fehler ist aufgetreten",
      );
    } finally {
      setDialogOpen(false);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Headline label="Passwort ändern" />
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <InputField
          label="Nutzername"
          type="text"
          disabled={true}
          value={user?.username ?? ""}
        />
        <InputField
          label="Aktuelles Passwort"
          type="password"
          placeholder="Gib dein aktuelles Passwort ein"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputField
          label="Neues Passwort"
          type="password"
          placeholder="Gib dein neues Passwort ein"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <PrimaryButton
            label={"Passwort ändern"}
            onClick={() => change_password()}
            ariaText="Passwort ändern"
            disabled={loading || !password.trim() || !newPassword.trim()}
          />
        </Box>
      </Box>

      <Box>
        <Headline label="Profil löschen" />
        <p>
          Möchtest du dein Profil mit all deinen gespeicherten Daten löschen?
        </p>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <SecondaryButton
            label={"Profil löschen"}
            onClick={() => setDialogOpen(true)}
            ariaText="Profil löschen"
          />
        </Box>
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setDialogOpen(false)}
        title="Möchtest du dein Profil wirklich löschen?"
        text="Deine letzten Ergebnisse und deine Favoriten werden dabei gelöscht."
        cancelLabel="NEIN"
        confirmLabel="JA"
        onConfirm={() => deleteProfile()}
      />
    </MainLayout>
  );
}
