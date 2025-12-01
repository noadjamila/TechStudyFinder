import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    text: {
      primary: "#3F3E42", // Your most common text color
      header: "#4A4458",
    },
    quiz: {
      buttonColor: "#AFCEFF",
      buttonChecked: "#AFCEFF",
      cardBackground: "#E2FBBE",
      textColor: "#3F3E42",
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
  },
});

export default theme;
