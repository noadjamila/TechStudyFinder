import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    quiz: {
      buttonColor: "#AFCEFF",
      buttonChecked: "#AFCEFF",
      cardBackground: "#E2FBBE",
      textColor: "#3F3E42",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default theme;
