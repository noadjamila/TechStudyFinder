import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import theme from "../../theme/theme";
import { useAuth } from "../../contexts/AuthContext";

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

  const { user, isLoading, logout } = useAuth();

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
      >
        {/* Menu Items */}
        {isLoading ? null : user ? (
          <div>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/settings");
              }}
            >
              Einstellungen
            </MenuItem>

            <MenuItem
              onClick={async () => {
                handleMenuClose();
                logout();
                navigate("/");
              }}
            >
              Ausloggen
            </MenuItem>
          </div>
        ) : (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate("/login");
            }}
          >
            Einloggen
          </MenuItem>
        )}
        <MenuItem onClick={handleMenuClose}>Impressum</MenuItem>
      </Menu>
    </div>
  );
}
