import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import FolderIcon from "@mui/icons-material/Folder";
import { useNavigate, Link } from "react-router-dom";
import theme from "../../theme/theme";
import { useAuth } from "../../contexts/AuthContext";

interface LogoMenuProps {
  fixed?: boolean;
}
/**
 * LogoMenu component.
 * Renders the top navigation bar primarily used in mobile view.
 * It includes a menu icon for a dropdown, the app title, and the logo, all horizontally arranged.
 *
 * @param {boolean} fixed - Whether the AppBar should have fixed positioning. Defaults to false.
 * @returns {React.FC} The rendered App Bar component.
 */
const LogoMenu: React.FC<LogoMenuProps> = ({ fixed = false }) => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
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

  /**
   * Handles login/logout action
   */
  const handleLoginLogout = () => {
    handleMenuClose();

    if (user) {
      // User is logged in - navigate to home with confirmation dialog
      sessionStorage.setItem("showLogoutConfirmation", "true");
      navigate("/");
    } else {
      // User is not logged in - navigate to login
      navigate("/login");
    }
  };

  return (
    <AppBar
      position={fixed ? "fixed" : "static"}
      sx={{
        backgroundColor: theme.palette.background.default,
        boxShadow: "none",
        pt: 1.5,
        top: 0,
        zIndex: fixed ? 1100 : "auto",
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
          onMouseEnter={() => setIsHoveringMenu(true)}
          onMouseLeave={() => setIsHoveringMenu(false)}
          aria-label="Open menu"
          disableRipple
          disableFocusRipple
          sx={{
            ml: 2,
            mr: 1.5,
            backgroundColor: isHoveringMenu
              ? theme.palette.secondary.main
              : theme.palette.secondary.light,
            color: "#FFFFFF",
            borderRadius: "50%",
            width: 44,
            height: 44,
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
          {isLoading ? null : user ? (
            <div>
              <MenuItem onClick={handleLoginLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Ausloggen</ListItemText>
              </MenuItem>
              <MenuItem
                component={Link}
                to="/settings"
                onClick={handleMenuClose}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Einstellungen</ListItemText>
              </MenuItem>
            </div>
          ) : (
            <MenuItem onClick={handleLoginLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Einloggen</ListItemText>
            </MenuItem>
          )}
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <FolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Impressum</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <FolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Datenschutz</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
export default LogoMenu;
