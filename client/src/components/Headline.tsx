import { Typography } from "@mui/material";

interface HeadlineProps {
  label: string;
}

export default function Headline({ label }: HeadlineProps) {
  return (
    <Typography
      variant="h2"
      component="h1"
      gutterBottom
      color="text.header"
      sx={{
        marginBottom: 3,
        fontWeight: 700,
        fontSize: "2rem",
      }}
    >
      {label}
    </Typography>
  );
}
