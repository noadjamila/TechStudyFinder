import React, { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Box,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import theme from "../../theme/theme";
import MenuIcon from "@mui/icons-material/Menu";
import UploadIcon from "@mui/icons-material/Upload";
import SettingsIcon from "@mui/icons-material/Settings";
import SourceIcon from "@mui/icons-material/Source";

const MENU_ITEM_SX = {
  borderRadius: 999,
  mx: 1,
  my: 0.5,
  "&:hover": {
    backgroundColor: theme.palette.secondary.light,
    color: "#FFFFFF",
    "& .MuiListItemIcon-root": {
      color: "#FFFFFF",
    },
  },
};

interface MenuItemConfig {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}

/**
 * LogoMenu component.
 * Renders the top navigation bar primarily used in mobile view.
 * It includes a menu icon for a dropdown, the app title, and the logo, all horizontally arranged.
 *
 * @param {boolean} fixed - Whether the AppBar should have fixed positioning. Defaults to false.
 * @returns {React.FC} The rendered App Bar component.
 */
const LogoMenu = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems: MenuItemConfig[] = [
    {
      label: "Daten aktualisieren",
      icon: <UploadIcon fontSize="small" />,
      onClick: () => {
        navigate("/admin/upload");
      },
    },
    {
      label: "Daten verwalten",
      icon: <SettingsIcon fontSize="small" />,
      onClick: () => {
        navigate("/admin/edit");
      },
    },
    {
      label: "Anleitungen",
      icon: <SourceIcon fontSize="small" />,
      onClick: () => {
        navigate("/admin/instructions");
      },
    },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: theme.palette.background.default,
        boxShadow: "none",
        pt: 2,
        pb: 1,
        top: 0,
        zIndex: 1100,
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
        <div
          style={{
            marginLeft: "25px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              position: "relative",
              left: "50%",
              transform: "translateX(-28%)",
            }}
          >
            <IconButton
              edge="start"
              onClick={handleMenuClick}
              aria-label="Open menu"
              sx={{
                color: theme.palette.text.secondary,
                backgroundColor: "transparent",
                width: { xs: 44, sm: "auto" },
                height: { xs: 44, sm: "auto" },
              }}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            disableScrollLock
          >
            {menuItems.map((item) => (
              <MenuItem
                key={item.label}
                onClick={item.onClick}
                sx={MENU_ITEM_SX}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText>{item.label}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </div>

        {/*Tech Study Finder Headline, centered*/}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
              lineHeight: 1.2,
            }}
          >
            Tech Study Finder
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: theme.palette.error.main,
              fontWeight: 600,
              letterSpacing: 0.6,
              textTransform: "uppercase",
              mt: 0.6,
            }}
          >
            Admin-Bereich
          </Typography>
        </Box>

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
      </Toolbar>
    </AppBar>
  );
};

export default LogoMenu;
