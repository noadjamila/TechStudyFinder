import { TextField, TextFieldProps, Box, Typography } from "@mui/material";

/**
 * A reusable form field component wrapping MUI TextField.
 * Can be used for login/register and other inputs.
 * Provides consistent styling across all forms in the app.
 */
export default function FormField({ label, sx, ...props }: TextFieldProps) {
  return (
    <Box sx={{ mb: 2 }}>
      {label && (
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          {label}
        </Typography>
      )}
      <TextField
        fullWidth
        variant="outlined"
        sx={{
          mb: 0,
          "& .MuiOutlinedInput-root": {
            borderRadius: "7px",
            height: "40px",
          },
          "& .MuiOutlinedInput-input": {
            padding: "8px 12px",
            fontSize: "14px",
          },
          ...sx, // Merge any custom sx passed in
        }}
        {...props}
        label=""
      />
    </Box>
  );
}
