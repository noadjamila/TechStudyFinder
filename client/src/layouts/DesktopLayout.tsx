import React, { ReactNode, useState } from "react";
import {
  Box,
  useTheme,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import NavBar from "../../src/components/nav-bar/NavBar";
import MenuIcon from "@mui/icons-material/Menu"; //

interface DesktopLayoutProps {
  children: ReactNode;
  onMenuToggle: () => void;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({ children }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    //{/*Background*/}
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        bgcolor: theme.palette.background.paper,
      }}
    >
      {/*Header + Logo rechts oben */}
      <Box
        sx={{
          position: "absolute",
          top: 24,
          right: 32,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="h6" fontWeight="bold">
            Tech Study Finder
          </Typography>
          <Typography variant="caption">Deine Reise zum Studiengang</Typography>
        </Box>

        <Box
          component="img"
          src="/logo.png"
          alt="Logo"
          sx={{ width: 40, height: 40 }}
        />
      </Box>

      {/* Navigation Items (vertikal zentriert) */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          left: 0,
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Menu über der Navbar */}
        <Box
          sx={{
            width: "100%",
            position: "relative",
            left: "50%",
            transform: "translateX(-28%)",
          }}
        >
          {/* Klickbares Icon (ersetzt den Text-Platzhalter) */}
          <IconButton
            edge="start"
            onClick={handleMenuClick}
            aria-label="Open menu"
            sx={{
              left: 24,
              color: theme.palette.text.secondary, // Farbe anpassen
            }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          disableScrollLock={true}
        >
          <MenuItem onClick={handleMenuClose}>Einloggen</MenuItem>
          <MenuItem onClick={handleMenuClose}>Impressum</MenuItem>
        </Menu>

        <NavBar isSidebarMode />
      </Box>

      {/* Hauptinhalt zentriert */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="main"
          sx={{
            width: "75%",
            maxWidth: 900,
            height: "80%",
            bgcolor: theme.palette.background.default,
            borderRadius: 10,
            px: 6,
            py: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DesktopLayout;
