import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "./LogoMenu.css";
import theme from "../../theme/theme";

const LogoMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 0,
        }}
      >
        {/* Menu and Tech Study Finder Headline*/}
        <IconButton
          edge="start"
          onClick={handleMenuClick}
          aria-label="Open menu"
          sx={{
            ml: 2,
            mr: 3,
          }}
        >
          <MenuIcon fontSize="large" />
        </IconButton>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
              whiteSpace: "nowrap",
            }}
          >
            Tech Study Finder
          </Typography>
        </Box>

        {/*Logo */}
        <Typography
          variant="h6"
          sx={{
            ml: 1,
            mr: 4,
            display: "flex",
            alignItems: "center",
          }}
        >
          <img src="/logo.png" alt="Logo" className="logo" />
        </Typography>

        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Einloggen</MenuItem>
          <MenuItem onClick={handleMenuClose}>Impressum</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default LogoMenu;
