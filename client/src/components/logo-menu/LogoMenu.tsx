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

/**
 * LogoMenu component.
 * Renders the top navigation bar primarily used in mobile view.
 * It includes a menu icon for a dropdown, the app title, and the logo, all horizontally arranged.
 *
 * @returns {React.FC} The rendered App Bar component.
 */
const LogoMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  /**
   * Handles the click on the Menu icon and sets the anchor element.
   *
   * @param {React.MouseEvent<HTMLElement>} event - The click event.
   */
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the Menu by resetting the anchor element state.
   */
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
        {/* Menu Icon, left-aligned*/}
        <IconButton
          edge="start"
          onClick={handleMenuClick}
          aria-label="Open menu"
          sx={{
            ml: 2,
            mr: 1.5,
          }}
        >
          <MenuIcon fontSize="large" />
        </IconButton>

        {/*Tech Study Finder Headline, centered*/}
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
          }}
        >
          Tech Study Finder
        </Typography>

        {/* Logo (Right-aligned) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            pr: 2,
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

        {/* Dropdown Menu (Hidden by default) */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          disableScrollLock={true}
        >
          {/* Menu Items */}
          <MenuItem onClick={handleMenuClose}>Einloggen</MenuItem>
          <MenuItem onClick={handleMenuClose}>Impressum</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default LogoMenu;
