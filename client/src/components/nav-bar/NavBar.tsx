import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";

interface NavBarProps {
  isSidebarMode?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ isSidebarMode = false }) => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();

  // Navigation Elements
  const navItems = [
    { label: "Home", icon: HomeIcon, path: "/" },
    { label: "Ergebnisse", icon: ResultIcon, path: "/results" },
    { label: "Favoriten", icon: FavoriteIcon, path: "/favorites" },
  ];

  const handleNavigation = (newValue: number, path: string) => {
    setValue(newValue);
    navigate(path);
  };

  //desktop view
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
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                // **1. Hintergrund (Rosa Pille)**
                ...(value === index && {
                  width: 50,
                  height: 40,
                  borderRadius: 999,
                  backgroundColor: theme.palette.secondary.light,
                }),
                mb: 0.5,
              }}
            >
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
            <Typography
              variant="caption"
              sx={{
                fontWeight: "bold",
                color:
                  value === index
                    ? theme.palette.secondary.main
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

  // mobile view
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
      elevation={3}
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
          backgroundColor: theme.palette.navigation.background,
          "& .MuiBottomNavigationAction-root": {
            minWidth: "auto",
            padding: "6px 20px",
            color: "#999",
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
