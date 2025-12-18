import { Box, Typography } from "@mui/material";

/**
 * FormHeader component.
 * Displays the logo and app title.
 * Reusable for Register, Login, and other auth pages.
 */
export default function FormHeader() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
      <Box
        component="img"
        src="/logo.png"
        alt="Logo"
        sx={{ width: 50, height: 50 }}
      />
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Tech Study Finder
        </Typography>
        <Typography variant="caption">Deine Reise zum Studiengang</Typography>
      </Box>
    </Box>
  );
}
