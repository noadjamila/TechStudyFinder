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
  const { user, isLoading } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      sessionStorage.setItem("showLogoutConfirmation", "true");
      navigate("/");
    } else {
      navigate("/login");
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
    navigate("/login", { state: { redirectTo: intendedDestination } });
  };

  const menuItems: MenuItemConfig[] = [
    {
      label: user ? "Ausloggen" : "Einloggen",
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
      onClick: handleMenuClose,
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
            color: { xs: "#FFFFFF", sm: theme.palette.text.secondary },
            backgroundColor: {
              xs: theme.palette.secondary.light,
              sm: "transparent",
            },
            borderRadius: { xs: "50%", sm: 0 },
            width: { xs: 44, sm: "auto" },
            height: { xs: 44, sm: "auto" },
            "&:hover": {
              backgroundColor: {
                xs: theme.palette.secondary.main,
                sm: "transparent",
              },
            },
          }}
        >
          <MenuIcon fontSize="medium" />
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
    </>
  );
}
