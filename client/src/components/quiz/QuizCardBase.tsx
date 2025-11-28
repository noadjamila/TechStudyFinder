import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";

export interface QuizOption<T = string> {
  label: string;
  value: T;
  description?: string;
}

export interface QuizCardBaseProps<T = string> {
  question: string;
  options: QuizOption<T>[];
  selected?: T;
  onSelect: (value: T) => void;
}

const QuizCardBase = <T,>({
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
        mx: "auto",
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#E2FBBE",
        fontFamily: "Roboto",
      }}
    >
      <CardContent>
        {/* Die Frage */}
        <Typography variant="h5" component="div" gutterBottom sx={{ mb: 3 }}>
          {question}
        </Typography>

        {/* Die Antwortmöglichkeiten */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {options.map((o) => {
            const isSelected = selected === o.value;
            return (
              <FormControlLabel
                key={String(o.value)}
                onClick={() => onSelect(o.value)}
                control={<Radio checked={isSelected} value={String(o.value)} />}
                label={o.label}
                sx={{
                  width: "100%",
                  mr: 0,
                  "& .MuiTypography-root": {
                    fontWeight: "normal",
                  },
                }}
              />
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuizCardBase;
