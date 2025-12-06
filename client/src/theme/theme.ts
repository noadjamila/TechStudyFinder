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
      primary: "#3F3E42", // Your most common text color
      header: "#4A4458",
    },
    quiz: {
      buttonChecked: "#AFCEFF",
      cardBackground: "#E2FBBE",
      progressBg: "#FFD7F5",
      progressFill: "#FFA5E9",
    },
    results: {
      background: "#FFFFFF",
      filterBorder: "#3F3E42",
      filterSelected: "#3F3E42",
      filterUnselected: "#9E9E9E",
      hoverBackground: "#f0f6ffff",
      favoriteIconToggled: "#FFBDEE",
      favoriteIconUntoggled: "#c2c2c2ff",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h2: {
      fontFamily: '"Lexend Deca", Roboto, sans-serif',
    },
    h6: {
      fontFamily: '"Lexend Deca", Roboto, sans-serif',
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "9px",
          fontWeight: "600",
          height: "50px",
        },
      },
    },
  },
});

export default theme;
