import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/theme";
import Homescreen from "./pages/Homescreen";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <div>
        <Homescreen /> {/* Display the Home Screen component here */}
      </div>
    </ThemeProvider>
  );
}
