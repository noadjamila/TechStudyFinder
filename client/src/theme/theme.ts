import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      primaryButton: string;
      secondaryButton: string;
      tertiaryButton: string;
      secondaryBorder: string;
      tertiaryBorder: string;
    };
  }
  interface ThemeOptions {
    custom?: {
      primaryButton?: string;
      secondaryButton?: string;
      tertiaryButton?: string;
      secondaryBorder?: string;
      tertiaryBorder?: string;
    };
  }
  interface Palette {
    quiz: {
      buttonChecked: string;
      cardBackground: string;
      progressBg: string;
      progressFill: string;
    };
  }
  interface PaletteOptions {
    quiz?: {
      buttonChecked?: string;
      cardBackground?: string;
      progressBg?: string;
      progressFill?: string;
    };
  }
}

const theme = createTheme({
  custom: {
    primaryButton: "#AFCEFF",
    secondaryButton: "#FFFFFF",
    tertiaryButton: "#FFFFFF",
    secondaryBorder: "#AFCEFF",
    tertiaryBorder: "#D9D9D9",
  },
  palette: {
    mode: "light",
    text: {
      primary: "#3F3E42",
    },
    quiz: {
      buttonChecked: "#AFCEFF",
      cardBackground: "#E2FBBE",
      progressBg: "#FFD7F5",
      progressFill: "#FFA5E9",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default theme;
