import React, { useEffect, useState } from "react";
import FavouritesNotLoggedIn from "./FavouritesNotLoggedIn";
import FavouritesEmpty from "./FavouritesEmpty";
import FavouritesList from "./FavouritesList";
import { Box, CircularProgress } from "@mui/material";
import theme from "../../theme/theme";

/**
 * Smart Favorites Router component.
 * Checks if the user is authenticated and how many favorites they have.
 * Routes to the appropriate page:
 * - Not logged in: Shows FavouritesNotLoggedIn
 * - Logged in with NO favorites: Shows FavouritesEmpty
 * - Logged in WITH favorites: Shows FavouritesList
 *
 * @returns {React.FC} The appropriate favorites page or loading indicator
 */
const Favorites: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<React.ReactNode>(null);

  /**
   * Check user authentication status and favorites count on component mount
   */
  useEffect(() => {
    const checkAuthAndFavorites = async () => {
      try {
        const response = await fetch("/api/users/favorites", {
          credentials: "include", // Include cookies for session
        });

        // User is not authenticated (401)
        if (response.status === 401) {
          setContent(<FavouritesNotLoggedIn />);
          setIsLoading(false);
          return;
        }

        // User is authenticated
        if (response.ok) {
          const data = await response.json();
          const favorites = data.favorites || [];

          // User has NO favorites - show empty state
          if (favorites.length === 0) {
            setContent(<FavouritesEmpty />);
            setIsLoading(false);
            return;
          }

          // User HAS favorites - show favorites list
          setContent(<FavouritesList favorites={favorites} />);
          setIsLoading(false);
          return;
        }

        // Handle other errors
        setContent(<FavouritesNotLoggedIn />);
        setIsLoading(false);
      } catch (err) {
        console.error("[FAVORITES] Error checking auth and favorites:", err);
        setContent(<FavouritesNotLoggedIn />);
        setIsLoading(false);
      }
    };

    checkAuthAndFavorites();
  }, []);

  // Show loading spinner while checking auth status
  if (isLoading) {
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

  return <>{content}</>;
};

export default Favorites;
