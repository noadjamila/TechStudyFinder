import { Button as MUIButton } from "@mui/material";

export default function Button() {
  return (
    <MUIButton
      variant="contained"
      sx={(theme) => ({
        backgroundColor: theme.palette.grey[100],
        color: theme.palette.grey[900],
        borderRadius: "20px",
        boxShadow: 3,
        ":hover": {
          backgroundColor: theme.palette.primary.main,
        },
      })}
    >
      Button
    </MUIButton>
  );
}
