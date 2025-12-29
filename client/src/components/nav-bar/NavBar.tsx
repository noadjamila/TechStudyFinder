import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ResultIcon from "@mui/icons-material/Bookmark";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

/**
 * Props for the NavBar component.
 * Controls the display mode of the navigation (sidebar for desktop or bottom bar for mobile).
 *
 * @interface NavBarProps
 * @property {boolean} [isSidebarMode=false] - If true, renders the vertical desktop sidebar; otherwise, renders the mobile bottom bar.
 */
interface NavBarProps {
  isSidebarMode?: boolean;
}

/**
 * NavBar component.
 * Renders the primary application navigation, adapting between a vertical sidebar (desktop)
 * and a horizontal bottom bar (mobile) based on the `isSidebarMode` prop.
 *
 * @param {NavBarProps} props - The component's props.
 * @returns {React.FC} The rendered navigation component.
 */
const NavBar: React.FC<NavBarProps> = ({ isSidebarMode = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Navigation Elements configuration
  const navItems = [
    { label: "Home", icon: HomeIcon, path: "/" },
    { label: "Ergebnisse", icon: ResultIcon, path: "/results" },
    { label: "Favoriten", icon: FavoriteIcon, path: "/favorites" },
  ];

  // Determine the current active index based on the current path
  const getCurrentIndex = () => {
    // Check for exact match first
    const index = navItems.findIndex((item) => item.path === location.pathname);
    if (index !== -1) return index;

    // Check if we're on a study programme detail page - should highlight "Ergebnisse"
    if (location.pathname.startsWith("/study-programme/")) {
      return navItems.findIndex((item) => item.path === "/results");
    }

    // Check if we're on favorites-empty page - should highlight "Favoriten"
    if (location.pathname === "/favorites-empty") {
      return navItems.findIndex((item) => item.path === "/favorites");
    }

    // Default to Home (index 0)
    return 0;
  };

  const [value, setValue] = useState(getCurrentIndex());

  // Update the selected value when the route changes
  useEffect(() => {
    setValue(getCurrentIndex());
  }, [location.pathname]);

  /**
   * Handles the navigation click event. Updates the selected index and navigates to the new path.
   *
   * @param {number} newValue - The index of the selected item.
   * @param {string} path - The route path to navigate to.
   */
  const handleNavigation = (newValue: number, path: string) => {
    setValue(newValue);
    navigate(path);
  };

  // desktop view (Vertical Sidebar)
  if (isSidebarMode) {
    return (
      <Box
        sx={{
          width: "100%",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 2,
          ml: 2,
        }}
      >
        {/* Iterate over navigation items */}
        {navItems.map((item, index) => (
          <Box
            key={item.label}
            onClick={() => handleNavigation(index, item.path)}
            sx={{
              width: 60,
              height: 75,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              mb: 1,
              bgcolor: "transparent",
              color: theme.palette.text.secondary,
              WebkitTapHighlightColor: "transparent",
              userSelect: "none",
            }}
          >
            {/* Icon Wrapper (Handles the active background style) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                ...(value === index && {
                  width: 50,
                  height: 40,
                  borderRadius: 999,
                  backgroundColor: theme.palette.secondary.light,
                }),
                mb: 0.5,
              }}
            >
              {/* Render the icon component */}
              <item.icon
                sx={{
                  fontSize: 24,
                  color:
                    value === index
                      ? "#FFFFFF !important"
                      : theme.palette.text.secondary,
                }}
              />
            </Box>
            {/* Navigation Label */}
            <Typography
              variant="caption"
              sx={{
                fontWeight: "bold",
                color:
                  value === index
                    ? theme.palette.text.secondary
                    : theme.palette.text.secondary,
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }

  // mobile view (Horizontal Bottom Bar)
  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        width: "80%",
        transform: "translateX(-50%)",
        borderRadius: 50,
        zIndex: 1000,
      }}
      elevation={0}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) =>
          handleNavigation(newValue, navItems[newValue].path)
        }
        sx={{
          height: 70,
          borderRadius: 999,
          backgroundColor: theme.palette.navigation.navbar,
          "& .MuiBottomNavigationAction-root": {
            minWidth: "auto",
            padding: "6px 20px",
            color: theme.palette.text.secondary,
          },
          "& .Mui-selected": {
            color: "#999",
          },
          "& .Mui-selected .MuiBottomNavigationAction-label": {
            color: "#999 !important",
            fontSize: "0.75rem",
            marginTop: 0.5,
          },
          "& .Mui-selected svg": {
            color: theme.palette.secondary.main,
          },
        }}
      >
        {/* Iterate over navigation items */}
        {navItems.map((item, index) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...(value === index && {
                    width: 45,
                    height: 35,
                    borderRadius: 999,
                    backgroundColor: theme.palette.secondary.light,
                  }),
                }}
              >
                {/* code and style for the icons */}
                <item.icon
                  sx={{
                    color: value === index ? "#FFFFFF !important" : undefined,
                  }}
                />
              </Box>
            }
            sx={{
              "&.Mui-selected svg": {
                color: theme.palette.secondary.main,
              },
              "&.Mui-selected": {
                color: theme.palette.secondary.main,
                borderRadius: 3,
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default NavBar;
