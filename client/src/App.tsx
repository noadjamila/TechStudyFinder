import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "./theme/theme";
import Button from "./components/buttons/Button";
import Homescreen from "./pages/Homescreen";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <div>
        <Homescreen /> {/* Display the Home Screen component here */}
      </div>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.grey[100],
          minHeight: "100vh",
          p: 2,
        })}
      >
        <h1>Welcome to my Project!</h1>
        <Button />
      </Box>
    </ThemeProvider>
  );
}
