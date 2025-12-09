import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    text: {
      primary: "#3F3E42",
      header: "#4A4458",
      subHeader: "#6B6B6B",
      skipButton: "#706F74",
    },

    // Base colors - reusable across app
    primary: {
      main: "#AFCEFF", // Primary blue - buttons, highlights, cards (less opacity)
    },
    secondary: {
      main: "#FFA5E9", // Pink accent - navigation, active favorites, errorNumber
    },
    background: {
      default: "#FFFFFD", // Main background
      paper: "#E9E9E9", // Speech bubbles
    },

    // Four colors of the Launch Screen
    decorative: {
      pink: "#FFBDEE",
      green: "#E7F9CE", // card backgrounds
      blue: "#D8E7FF",
      yellow: "#FFF8AD",
      blueDark: "#A6B8D5", // primary button hover
    },

    // Feature-specific
    quiz: {
      secondary: "#D9D9D9",
      progressUnfilled: "#FFD7F5",
    },

    navigation: {
      background: "#EFEFEF",
    },

    favorites: {
      inactive: "#CAC4D0",
    },
  },
  typography: {
    fontFamily: "Fira Sans, sans-serif",
    h2: {
      fontFamily: '"Lexend Deca", Fira Sans, sans-serif',
    },
    h6: {
      fontFamily: '"Lexend Deca", Fira Sans, sans-serif',
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
