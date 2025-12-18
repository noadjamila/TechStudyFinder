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
        height: 120,
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
            borderTopLeftRadius: "30%",
            borderTopRightRadius: "30%",
          }}
        />
      ))}
    </Box>
  );
}
