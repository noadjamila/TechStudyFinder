import React, { useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import LoginReminderDialog from "./dialogs/LoginReminderDialog";
import LogoutDialog from "../components/dialogs/Dialog";

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

export default function DropMenu({
  hasResults = false,
}: {
  hasResults?: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [intendedDestination, setIntendedDestination] = useState("");

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoginLogout = () => {
    handleMenuClose();
    if (user) {
      setIsLogoutOpen(true);
    } else {
      navigate("/login-register");
    }
  };

  const handleNavigate = (path: string) => {
    handleMenuClose();
    if (location.pathname === "/results" && !user && !isLoading && hasResults) {
      setIsDialogOpen(true);
      setIntendedDestination(path);
    } else {
      navigate(path);
    }
  };

  const handleProceedNavigation = () => {
    setIsDialogOpen(false);
    navigate(intendedDestination);
  };

  const handleLoginClick = () => {
    setIsDialogOpen(false);
    navigate("/login-register", { state: { redirectTo: intendedDestination } });
  };

  const handleConfirmLogout = async () => {
    setIsLogoutOpen(false);

    try {
      await logout();
      sessionStorage.setItem("showLogoutConfirmation", "true");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCancelLogout = () => {
    setIsLogoutOpen(false);
  };

  const menuItems: MenuItemConfig[] = [
    {
      label: user ? "Ausloggen" : "Einloggen/Registrieren",
      icon: <LogoutIcon fontSize="small" />,
      onClick: handleLoginLogout,
    },
    ...(user
      ? [
          {
            label: "Einstellungen",
            icon: <SettingsIcon fontSize="small" />,
            onClick: () => handleNavigate("/settings"),
          },
        ]
      : []),
    {
      label: "Impressum",
      icon: <FolderIcon fontSize="small" />,
      onClick: () => handleNavigate("/impressum"),
    },
    {
      label: "Datenschutz",
      icon: <FolderIcon fontSize="small" />,
      onClick: () => handleNavigate("/datenschutz"),
    },
  ];

  if (isLoading) return null;

  return (
    <>
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
            borderRadius: "50%",
            width: { xs: 50, sm: "auto" },
            height: { xs: 50, sm: "auto" },
            "&:hover": {
              backgroundColor: theme.palette.secondary.main,
              color: "#FFFFFF",
            },
          }}
        >
          <MenuIcon
            sx={{
              fontSize: {
                xs: 36, // mobil
                sm: 32,
                md: 24, // große Bildschirme → kleiner
              },
            }}
          />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        disableScrollLock
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        {menuItems.map((item) => (
          <MenuItem key={item.label} onClick={item.onClick} sx={MENU_ITEM_SX}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>

      <LoginReminderDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onLoginClick={handleLoginClick}
        onProceedNavigation={handleProceedNavigation}
      />

      <LogoutDialog
        open={isLogoutOpen}
        onClose={() => handleCancelLogout()}
        title="Möchtest du dich wirklich ausloggen?"
        text=""
        cancelLabel="NEIN"
        confirmLabel="JA"
        onConfirm={() => handleConfirmLogout()}
      />
    </>
  );
}
