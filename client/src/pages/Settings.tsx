import { Box } from "@mui/material";
import MainLayout from "../layouts/MainLayout";
import PrimaryButton from "../components/buttons/PrimaryButton";
import SecondaryButton from "../components/buttons/SecondaryButton";
import Dialog from "../components/dialogs/Dialog";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Settings() {
  const navigate = useNavigate();

  const [openDialog, setDialogOpen] = useState(false);

  const changePassword = () => {
    // Logic to change password
  };

  const deleteProfile = () => {
    // Logic to delete profile

    setDialogOpen(false);
    navigate("/");
  };
  return (
    <MainLayout>
      <Box>
        <h1>Passwort ändern</h1>
        <PrimaryButton
          label={"Passwort ändern"}
          onClick={() => changePassword()}
          ariaText="Passwort ändern"
        />
      </Box>

      <Box>
        <h1>Profil löschen</h1>
        <p>
          Möchtest du dein Profil mit all deinen gespeicherten Daten löschen?
        </p>
        <SecondaryButton
          label={"Profil löschen"}
          onClick={() => setDialogOpen(true)}
          ariaText="Profil löschen"
        />
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
