import { IconButton, useTheme } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

interface HomeButtonProps {
  onClick?: () => void;
  size?: number;
}

export default function HomeButton({ size = 45, onClick }: HomeButtonProps) {
  const theme = useTheme();

  return (
    <IconButton
      onClick={onClick}
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1px solid ${theme.palette.background.paper}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <HomeIcon sx={{ fontSize: size * 0.5 }} /> {}
    </IconButton>
  );
}
