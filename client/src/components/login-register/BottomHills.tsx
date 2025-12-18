import { Box } from "@mui/material";
import theme from "../../theme/theme";

export default function BottomHills() {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: { xs: 80, sm: 100, md: 120, lg: 150 },
        display: "flex",
        zIndex: 0,
      }}
    >
      {[
        theme.palette.decorative.pink,
        theme.palette.decorative.green,
        theme.palette.decorative.blue,
        theme.palette.decorative.yellow,
      ].map((color, i) => (
        <Box
          key={i}
          sx={{
            flex: 1,
            backgroundColor: color,
            borderTopLeftRadius: "50% 35%",
            borderTopRightRadius: "50% 35%",
          }}
        />
      ))}

      {/* Mascot on the hills */}
      <Box
        component="img"
        src="/mascot_walking_yellow.svg"
        alt="Mascot"
        sx={{
          position: "absolute",
          bottom: 0,
          left: { xs: "30%", md: "30%" },
          width: { xs: 60, md: 80, lg: 100 },
          zIndex: 1,
          objectFit: "contain",
          pb: 9.8,
        }}
      />
    </Box>
  );
}
