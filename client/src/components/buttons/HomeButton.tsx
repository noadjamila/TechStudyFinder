import { IconButton, useTheme } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

interface HomeButtonProps {
  onClick?: () => void;
  size?: number;
}

export default function HomeButton({ size = 45 }: HomeButtonProps) {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <IconButton
      onClick={() => navigate("/")}
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
