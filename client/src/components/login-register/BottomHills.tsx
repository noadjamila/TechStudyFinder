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
        height: { xs: "12vh", sm: "23vh", md: "18vh", lg: "18vh" },
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
            borderTopLeftRadius: {
              xs: "50% 60%",
              sm: "50% 40%",
              md: "50% 50%",
              lg: "50% 80%",
            },
            borderTopRightRadius: {
              xs: "50% 60%",
              sm: "50% 40%",
              md: "50% 50%",
              lg: "50% 80%",
            },
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
          bottom: "100%",
          left: { xs: "30%", sm: "35%", md: "33%", lg: "35%" },
          width: { xs: 60, sm: 55, md: 55, lg: 55 },
          zIndex: 1,
          objectFit: "contain",
        }}
      />
    </Box>
  );
}
