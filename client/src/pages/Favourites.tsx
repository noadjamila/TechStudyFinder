import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../contexts/AuthContext";
import FavouritesNotLoggedIn from "../components/favourites/FavouritesNotLoggedIn";
import FavouritesEmpty from "../components/favourites/FavouritesEmpty";
import FavouritesList from "../components/favourites/FavouritesList";
import theme from "../theme/theme";

/**
 * Favourites page component.
 * Displays different content based on user authentication status and favorites count:
 * - Not logged in: Shows login prompt
 * - Logged in with NO favorites: Shows empty state with quiz prompt
 * - Logged in WITH favorites: Shows favorites list
 *
 * @returns {React.FC} The Favourites page
 */
const Favourites: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  /**
   * Check user authentication status and favorites count on component mount
   */
  useEffect(() => {
    const checkAuthAndFavorites = async () => {
      // Wait for auth context to finish loading
      if (authLoading) {
        return;
      }

      // User is not authenticated
      if (!user) {
        setIsLoading(false);
        return;
      }

      // User IS authenticated - fetch their favorites
      try {
        const response = await fetch("/api/users/favorites", {
          credentials: "include", // Include cookies for session
        });

        if (!response.ok) {
          // If we can't fetch favorites, show empty state (no favorites yet)
          setFavorites([]);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        setFavorites(data.favorites || []);
        setIsLoading(false);
      } catch (err) {
        console.error("[FAVORITES] Error fetching favorites:", err);
        // On error, show empty state
        setFavorites([]);
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      checkAuthAndFavorites();
    }
  }, [user, authLoading]);

  // Determine which content to show
  const getContent = () => {
    if (!user) {
      return <FavouritesNotLoggedIn />;
    }

    if (favorites.length === 0) {
      return <FavouritesEmpty />;
    }

    return <FavouritesList favorites={favorites} />;
  };

  // Show loading spinner while checking auth status
  if (isLoading || authLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: theme.palette.background.default,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <MainLayout>{getContent()}</MainLayout>;
};

export default Favourites;
