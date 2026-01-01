import {
  TextField,
  TextFieldProps,
  Box,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

/**
 * A reusable form field component wrapping MUI TextField.
 * Can be used for login/register and other inputs.
 * Provides consistent styling across all forms in the app.
 * For password fields, includes a visibility toggle icon.
 */
export default function FormField({
  label,
  sx,
  type,
  ...props
}: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

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
        type={isPasswordField && showPassword ? "text" : type}
        sx={{
          mb: 0,
          "& .MuiOutlinedInput-root": {
            borderRadius: "7px",
            height: "36px",
          },
          "& .MuiOutlinedInput-input": {
            padding: "8px 12px",
            fontSize: "14px",
          },
          ...sx,
        }}
        InputProps={
          isPasswordField
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      size="small"
                      aria-label="Passwort-Sichtbarkeit umschalten"
                      sx={{
                        marginRight: "-8px",
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : undefined
        }
        {...props}
        label=""
      />
    </Box>
  );
}
