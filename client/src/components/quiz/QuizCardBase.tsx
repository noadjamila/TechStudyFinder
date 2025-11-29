import React, { ReactNode } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import { quizColors } from "./quizColorTheme";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SxProps, Theme } from "@mui/material/styles";

/**
 * Interface defining selectable options within the quiz card.
 * The radio buttons are the default, set to true, but can be set false, so they disappear.
 * Other buttons or actions can be implemented with the children prop.
 * @template T The type of the option's unique identifier (value).
 */

export interface QuizOption<T = string> {
  label: string;
  value: T;
  description?: string;
}

export interface QuizCardBaseProps<T = string> {
  question: string;
  options?: QuizOption<T>[];
  selected?: T;
  onSelect?: (value: T) => void;
  showRadioButtons?: boolean;
  children?: ReactNode;
  sx?: SxProps<Theme>;
  imageSrc?: string;
}

/**
 * A generic, styled React component that renders a single question card
 * with a set of radio button options.
 *
 * It uses Material UI (MUI) components (Card, Radio, FormControlLabel, etc.)
 * and applies custom theming for radio button colors based on quizColorTheme.
 *
 * @template T The type of the option's unique identifier (value).
 * @param {QuizCardBaseProps<T>} props The props defining the card content and behavior.
 * @returns {JSX.Element} The Quiz Card component.
 */

const quizRadioTheme = createTheme({
  components: {
    MuiRadio: {
      styleOverrides: {
        root: {
          color: quizColors.text,
          "&.Mui-checked": {
            color: quizColors.buttonColorChecked,
          },
        },
      },
    },
  },
});

const QuizCardBase = <T,>({
  question,
  options,
  selected,
  onSelect,
  showRadioButtons = true,
  children,
  sx,
  imageSrc,
}: QuizCardBaseProps<T>) => {
  const renderRadioOptions = showRadioButtons && options && options.length > 0;
  return (
    <ThemeProvider theme={quizRadioTheme}>
      <Card
        sx={{
          position: "relative",
          maxWidth: 600,
          width: "100%",
          mx: "auto",
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: quizColors.cardColour,
          fontFamily: "Roboto",
          color: quizColors.text,
          pt: 2,
          pb: 6,
          overflow: "visible",
          ...sx,
        }}
      >
        {/* rendert the mascot in case that the level has a mascot */}
        {imageSrc && (
          <Box
            component="img"
            src={imageSrc}
            alt="Quiz Mascot"
            sx={{
              position: "absolute",
              top: -90,
              right: 40,
              width: 60,
              height: 90,
            }}
          />
        )}

        <CardContent
          sx={{
            px: "30px",
          }}
        >
          {/* the question*/}
          <Typography variant="h5" component="div" gutterBottom sx={{ mb: 3 }}>
            {question}
          </Typography>

          {/* the answer-possibilites */}
          {renderRadioOptions && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {options!.map((o) => {
                const isSelected = selected === o.value;
                return (
                  <FormControlLabel
                    key={String(o.value)}
                    onClick={() => onSelect?.(o.value)}
                    control={
                      showRadioButtons ? (
                        <Radio checked={isSelected} value={String(o.value)} />
                      ) : (
                        <></>
                      )
                    }
                    label={o.label}
                    sx={{ mr: 0 }}
                  />
                );
              })}
            </Box>
          )}
          {children && (
            <Box sx={{ mt: renderRadioOptions ? 3 : 0 }}>{children}</Box>
          )}
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default QuizCardBase;
