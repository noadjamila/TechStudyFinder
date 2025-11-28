import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export interface QuizOption<T = string> {
  label: string;
  value: T;
  description?: string;
}

export interface QuizCardBaseProps<T = string> {
  title?: string; // Optional: z.B. "Level 1"
  question: string;
  options: QuizOption<T>[];
  selected?: T;
  onSelect: (value: T) => void;
}

const QuizCardBase = <T,>({
  title,
  question,
  options,
  selected,
  onSelect,
}: QuizCardBaseProps<T>) => {
  return (
    <Card
      sx={{
        maxWidth: 600,
        width: "100%",
        mx: "auto", // Zentriert die Karte horizontal
        boxShadow: 3, // Stärkerer Schatten für den "Card"-Effekt
        borderRadius: 2, // Etwas rundere Ecken
      }}
    >
      <CardContent>
        {/* Titel (optional) */}
        {title && (
          <Typography
            gutterBottom
            variant="overline"
            display="block"
            color="text.secondary"
          >
            {title}
          </Typography>
        )}

        {/* Die Frage */}
        <Typography variant="h5" component="div" gutterBottom sx={{ mb: 3 }}>
          {question}
        </Typography>

        {/* Die Antwortmöglichkeiten */}
        <Stack spacing={2} direction="column">
          {options.map((o) => {
            const isSelected = selected === o.value;
            return (
              <Button
                key={String(o.value)}
                variant={isSelected ? "contained" : "outlined"} // Gefüllt wenn ausgewählt, sonst Umrandung
                color={isSelected ? "primary" : "inherit"}
                onClick={() => onSelect(o.value)}
                size="large"
                fullWidth
                sx={{
                  justifyContent: "flex-start", // Text linksbündig sieht bei langen Antworten oft besser aus
                  textAlign: "left",
                  borderColor: isSelected ? "" : "rgba(0, 0, 0, 0.23)", // Leichte Border für nicht-ausgewählte
                }}
              >
                {o.label}
              </Button>
            );
          })}
        </Stack>
      </CardContent>

      {/*hier müsste noch der Zurück-Button rein */}
    </Card>
  );
};

export default QuizCardBase;
