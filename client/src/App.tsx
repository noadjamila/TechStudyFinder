import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "./theme/theme";
import Button from "./components/Button";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          backgroundColor: "lightGrey",
          minHeight: "100vh",
          p: 2,
        }}
      >
        <h1>Welcome to my Project!</h1>
        <Button />
      </Box>
    </ThemeProvider>
  );
}
