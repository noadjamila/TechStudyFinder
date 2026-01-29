import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import theme from "../theme/theme";
import DropMenu from "./DropdownMenu";
import LoginReminderDialog from "./dialogs/LoginReminderDialog";
import { useAuth } from "../contexts/AuthContext";

interface LogoMenuProps {
  fixed?: boolean;
  hasResults?: boolean;
}

/**
 * LogoMenu component.
 * Renders the top navigation bar primarily used in mobile view.
 * It includes a menu icon for a dropdown, the app title, and the logo, all horizontally arranged.
 *
 * @param {boolean} fixed - Whether the AppBar should have fixed positioning. Defaults to false.
 * @returns {React.FC} The rendered App Bar component.
 */
const LogoMenu: React.FC<LogoMenuProps> = ({
  fixed = false,
  hasResults = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleHomeNavigation = () => {
    if (location.pathname === "/results" && !user && !isLoading && hasResults) {
      setIsDialogOpen(true);
    } else {
      navigate("/");
    }
  };

  const handleProceedNavigation = () => {
    setIsDialogOpen(false);
    navigate("/");
  };

  return (
    <AppBar
      position={fixed ? "fixed" : "static"}
      sx={{
        backgroundColor: theme.palette.background.default,
        boxShadow: "none",
        pt: 2,
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
        <div
          style={{
            marginLeft: "25px",
          }}
        >
          <DropMenu hasResults={hasResults} />
        </div>

        {/*Tech Study Finder Headline, centered*/}
        <Typography
          onClick={handleHomeNavigation}
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: theme.palette.text.primary,
            whiteSpace: "nowrap",
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
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
      </Toolbar>

      <LoginReminderDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onLoginClick={() =>
          navigate("/login", {
            state: { redirectTo: "/" },
          })
        }
        onProceedNavigation={handleProceedNavigation}
      />
    </AppBar>
  );
};

export default LogoMenu;
