import React from "react";
import {
  Typography,
  alpha,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import theme from "../../theme/theme";
import { useCallback, useState } from "react";
import UploadIcon from "@mui/icons-material/Upload";
import FileIcon from "@mui/icons-material/FilePresent";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

type UploadStatus = "idle" | "success" | "error";

interface XmlUploadProps {
  filename: string;
  onUploaded: (file: File) => void;
  onRemoved: () => void;
}

interface UploadedFile {
  name: string;
  size: number;
  content: string;
}

export default function XmlUpload({
  filename,
  onUploaded,
  onRemoved,
}: XmlUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type !== "text/xml" && !file.name.endsWith(".xml")) {
        setStatus("error");
        setErrorMessage("Bitte nur XML-Dateien hochladen.");
        return;
      }

      setStatus("success");
      setErrorMessage(null);

      onUploaded(file);

      const reader = new FileReader();
      reader.onload = () => {
        setUploadedFile({
          name: file.name,
          size: file.size,
          content: reader.result as string,
        });
        setErrorMessage(null);
      };
      reader.readAsText(file);
    },
    [onUploaded],
  );

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setStatus("idle");
    setErrorMessage(null);
    onRemoved();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const uploadId = `xml-upload-${filename?.replace(/\./g, "-") || "default"}`;

  return (
    <Box sx={{ width: "100%" }}>
      {!uploadedFile && (
        <Box>
          <Box
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => document.getElementById(uploadId)?.click()}
            sx={{
              border: `2px dashed ${
                isDragging
                  ? theme.palette.primary.main
                  : theme.palette.decorative.blueDark
              }`,
              padding: 4,
              textAlign: "center",
              borderRadius: 3,
              backgroundColor: isDragging
                ? alpha(theme.palette.primary.main, 0.1)
                : alpha(theme.palette.decorative.blue, 0.1),
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: theme.palette.text.subHeader,
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.15),
                transform: "translateY(-2px)",
              },
            }}
          >
            <input
              type="file"
              accept=".xml"
              onChange={onFileSelect}
              style={{ display: "none" }}
              id={uploadId}
            />
            <UploadIcon
              sx={{
                fontSize: 48,
                color: isDragging
                  ? theme.palette.primary.main
                  : theme.palette.decorative.blueDark,
                transition: "all 0.3s ease",
              }}
            />
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 0.5,
                }}
              >
                {filename ? `${filename} hier ablegen` : "Datei hier ablegen"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.subHeader }}
              >
                oder klicken zum Auswählen
              </Typography>
            </Box>
          </Box>

          {status === "error" && (
            <Alert
              severity="error"
              icon={<ErrorIcon />}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              {errorMessage}
            </Alert>
          )}
        </Box>
      )}

      {/* DATEIANSICHT NACH UPLOAD */}
      {uploadedFile && (
        <Card
          elevation={0}
          sx={{
            mt: 2,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.decorative.green, 0.2),
            border: `2px solid ${theme.palette.decorative.greenDark}`,
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <CheckCircleIcon
                  sx={{
                    fontSize: 36,
                    color: theme.palette.decorative.greenDark,
                  }}
                />
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      my: 2,
                    }}
                  >
                    Datei erfolgreich hochgeladen
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      icon={<FileIcon />}
                      label={uploadedFile.name}
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.background.paper,
                        fontWeight: 500,
                      }}
                    />
                    <Chip
                      label={formatFileSize(uploadedFile.size)}
                      size="small"
                      sx={{
                        backgroundColor: alpha(
                          theme.palette.decorative.green,
                          0.3,
                        ),
                        color: theme.palette.text.primary,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              <IconButton
                onClick={removeFile}
                sx={{
                  color: theme.palette.error.main,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>

            {/* XML PREVIEW */}
            <Box>
              <Button
                onClick={() => setShowPreview(!showPreview)}
                endIcon={showPreview ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{
                  textTransform: "none",
                  color: theme.palette.text.primary,
                  mb: showPreview ? 2 : 0,
                }}
              >
                XML-Vorschau {showPreview ? "ausblenden" : "anzeigen"}
              </Button>
              <Collapse in={showPreview}>
                <Box
                  component="pre"
                  sx={{
                    maxHeight: "300px",
                    overflow: "auto",
                    backgroundColor: theme.palette.background.default,
                    padding: 2,
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
                    fontSize: "0.875rem",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {uploadedFile.content}
                </Box>
              </Collapse>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
