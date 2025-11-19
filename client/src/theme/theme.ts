import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#b9a5ff" },
    secondary: { main: "#f1e1ff" },
    grey: {
      900: "#2E2E2E",
      100: "#f7f7f7",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: { fontFamily: "'Open Sans', sans-serif" },
    h2: { fontFamily: "'Open Sans', sans-serif" },
    h3: { fontFamily: "'Open Sans', sans-serif" },
  },
});
export default theme;
