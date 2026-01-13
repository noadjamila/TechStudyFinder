import React from "react";
import { Typography, alpha } from "@mui/material";
import theme from "../../theme/theme";
import { useCallback, useState } from "react";
import UploadIcon from "@mui/icons-material/Upload";

type UploadStatus = "idle" | "success" | "error";

import Layout from "../../layouts/AdminLayout";

export default function AdminUpload() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (file.type !== "text/xml" && !file.name.endsWith(".xml")) {
      setStatus("error");
      setErrorMessage("Bitte nur XML-Dateien hochladen.");
      return;
    }

    setFileName(file.name);
    setStatus("success");
    setErrorMessage(null);

    // OPTIONAL: Dateiinhalt lesen
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      console.log("XML Inhalt:", content);
      // hier z. B. XML validieren oder an API senden
    };
    reader.readAsText(file);
  }, []);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Layout>
      <Typography variant="h2" align="center" mt={4}>
        Daten aktualisieren
      </Typography>

      <Typography variant="h5" align="center" mt={2}>
        Laden Sie eine XML-Datei hoch, um die Studiendaten zu aktualisieren.
      </Typography>
      <div>
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          style={{
            border: `2px dashed ${theme.palette.decorative.greenDark}`,
            padding: "40px",
            textAlign: "center",
            borderRadius: "8px",
            backgroundColor: alpha(theme.palette.decorative.green, 0.2),
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            color: theme.palette.text.subHeader,
            marginTop: "30px",
          }}
          onClick={() => document.getElementById("xml-upload")?.click()}
        >
          <input
            type="file"
            accept=".xml"
            onChange={onFileSelect}
            style={{ display: "none" }}
            id="xml-upload"
          />
          <UploadIcon fontSize="large" />

          <label htmlFor="xml-upload">
            <strong>XML-Datei hier ablegen</strong>
            <br />
            oder klicken zum Auswählen
          </label>
        </div>

        {status === "success" && (
          <p style={{ color: "green" }}>✅ {fileName} erfolgreich geladen</p>
        )}

        {status === "error" && (
          <p style={{ color: "red" }}>❌ {errorMessage}</p>
        )}
      </div>
    </Layout>
  );
}
