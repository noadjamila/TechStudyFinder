import { Button as MUIButton } from "@mui/material";

export default function Button() {
  return (
    <MUIButton
      variant="contained"
      sx={{
        backgroundColor: "lightGrey",
        color: "darkGrey",
        borderRadius: "20px",
        boxShadow: 3,
        ":hover": {
          backgroundColor: "purple",
        },
      }}
    >
      Button
    </MUIButton>
  );
}