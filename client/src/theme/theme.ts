import { createTheme } from "@mui/material/styles";

const defaultTheme = createTheme();

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
      blueDark: "#93BAF9", // primary button hover
      greenDark: "#D7F7AB", // card hover
    },

    // Feature-specific
    quiz: {
      secondary: "#D9D9D9",
      progressUnfilled: "#FFD7F5",
    },

    navigation: {
      navbar: "#E6E6E6",
    },

    favorites: {
      inactive: "#CAC4D0",
    },

    detailspage: {
      link: "#1976d2",
    },
  },
  typography: {
    fontFamily: "Fira Sans, sans-serif",
    h2: {
      fontFamily: '"Lexend Deca", Fira Sans, sans-serif',
      fontSize: "2.2rem", // 35.2px on desktop
      fontWeight: "bold",
      marginBottom: "16px", // 2 * 8px (MUI spacing unit)
      "@media (max-width:600px)": {
        fontSize: "1.8rem", // 28.8px on mobile
      },
    },
    h3: {
      fontFamily: '"Lexend Deca", Fira Sans, sans-serif',
      fontSize: "24px",
      fontWeight: "bold",
      lineHeight: 1.2,
    },
    h4: {
      fontSize: "1.6rem",
      fontFamily: '"Lexend Deca", Fira Sans, sans-serif',
    },
    h5: {
      fontSize: "1.25rem",
      lineHeight: 1.6,
    },
    h6: {
      fontFamily: '"Lexend Deca", Fira Sans, sans-serif',
      fontSize: "35px",
      fontWeight: "bold",
      lineHeight: 1.2,
    },
    subtitle1: {
      fontSize: "20px",
      fontFamily: "Fira Sans, sans-serif",
      fontWeight: "normal",
    },
    errorScreenTitle: {
      ...defaultTheme.typography.h1,
      fontFamily: '"Lexend Deca", Fira Sans, sans-serif',
      marginBottom: "2000px",
      fontWeight: 700,
      lineHeight: 1.167, // MUI h1 default
      letterSpacing: "-0.01562em",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          userSelect: "none",
          WebkitUserSelect: "none",
          msUserSelect: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "9px",
          height: "50px",
          fontWeight: 400,
        },
      },
    },
  },
});

export default theme;
