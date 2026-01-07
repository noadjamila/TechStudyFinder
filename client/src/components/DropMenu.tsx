import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  MenuItem,
  IconButton,
  Box,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import FolderIcon from "@mui/icons-material/Folder";
import theme from "../theme/theme";
import { useAuth } from "../contexts/AuthContext";

/**
 * DropMenu component that provides a dropdown menu with navigation options.
 *
 * @component
 * @returns {JSX.Element} The DropMenu component.
 */
export default function DropMenu() {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const { user, isLoading } = useAuth();

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
  const handleLoginLogout = async () => {
    handleMenuClose();
    if (user) {
      // User is logged in - navigate to home with confirmation dialog
      sessionStorage.setItem("showLogoutConfirmation", "true");
      navigate("/home");
    } else {
      // User is not logged in - navigate to login
      navigate("/login");
    }
  };
  return (
    <div>
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
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
        }}
      >
        {/* Menu Items */}
        {isLoading ? null : user ? (
          <MenuItem
            onClick={handleLoginLogout}
            sx={{
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
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Ausloggen</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={handleLoginLogout}
            sx={{
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
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Einloggen</ListItemText>
          </MenuItem>
        )}

        {/* Settings - only show if user is logged in */}
        {!isLoading && user && (
          <MenuItem
            component="a"
            href="/settings"
            onClick={handleMenuClose}
            sx={{
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
            }}
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Einstellungen</ListItemText>
          </MenuItem>
        )}

        <MenuItem
          onClick={handleMenuClose}
          sx={{
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
          }}
        >
          <ListItemIcon>
            <FolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Impressum</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={handleMenuClose}
          sx={{
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
          }}
        >
          <ListItemIcon>
            <FolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Datenschutz</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}
