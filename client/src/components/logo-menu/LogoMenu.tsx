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
        mt: 1.5,
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
        {/* Menu Icon*/}
        <IconButton
          edge="start"
          onClick={handleMenuClick}
          aria-label="Open menu"
          sx={{
            ml: 2,
            mr: 10,
          }}
        >
          <MenuIcon fontSize="large" />
        </IconButton>

        {/*Tech Study Finder Headline*/}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: theme.palette.text.primary,
            whiteSpace: "nowrap",
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pr: 2,
          }}
        >
          Tech Study Finder
        </Typography>

        {/* 3. Logo (Rechtsbündig) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            pr: 1.5,
          }}
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="logo-image"
            style={{
              width: 40,
              height: 40,
              objectFit: "contain",
            }}
          />
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
      </Toolbar>
    </AppBar>
  );
};

export default LogoMenu;
