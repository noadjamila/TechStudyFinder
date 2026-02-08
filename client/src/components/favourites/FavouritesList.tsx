import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import { StudyProgramme } from "../../types/StudyProgramme.types";
import StudyProgrammeCard from "../cards/StudyProgrammeCard";
import { getStudyProgrammeById } from "../../api/quizApi";
import { removeFavorite } from "../../api/favoritesApi";
import FavouritesEmpty from "./FavouritesEmpty";
import { useApiClient } from "../../hooks/useApiClient";
import DataSource from "../DataSource";

interface FavouritesListProps {
  favorites: string[]; // Array of study programme IDs
}

/**
 * FavouritesList component displays a user's favorite study programmes.
 * Shows cards for each favorite. When last favorite is removed, transitions to FavouritesEmpty.
 * Used by the Favourites page when user has favorites.
 *
 * @component
 * @param {FavouritesListProps} props - Component props
 * @param {string[]} props.favorites - Array of favourite study programme IDs
 * @returns {React.ReactElement} The favorites list content
 */
const FavouritesList: React.FC<FavouritesListProps> = ({ favorites }) => {
  const { apiFetch } = useApiClient();
  const [studyProgrammes, setStudyProgrammes] = useState<StudyProgramme[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);

  /**
   * Fetch detailed information for each favorite programme
   */
  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      if (!favorites || favorites.length === 0) {
        setStudyProgrammes([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      // Fetch each favorite programme in parallel
      const promises = favorites.map((id: string) =>
        getStudyProgrammeById(id, apiFetch),
      );
      const results = await Promise.allSettled(promises);

      // Process results - filter successful ones
      const validResults: StudyProgramme[] = [];
      results.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value !== null) {
          validResults.push(result.value);
        } else if (result.status === "rejected") {
          console.error(
            `Failed to load favorite programme ${favorites[index]}:`,
            result.reason,
          );
        } else if (result.status === "fulfilled" && result.value === null) {
          console.warn(`Favorite programme ${favorites[index]} not found`);
        }
      });

      setStudyProgrammes(validResults);
      setLoading(false);
    };

    fetchFavoriteDetails();
  }, [favorites]);

  /**
   * Handle unfavoriting a programme
   * If it's the last favourite, triggers fade animation and transitions to empty state
   *
   * @param {string} programmeId - The ID of the programme to unfavourite
   */
  const toggleFavorite = async (programmeId: string) => {
    // Remove card from display immediately for better UX
    const newProgrammes = studyProgrammes.filter(
      (p) => p.studiengang_id !== programmeId,
    );

    // If this is the last card, start fade animation
    if (newProgrammes.length === 0) {
      setIsFading(true);

      // Remove from database
      try {
        await removeFavorite(programmeId, apiFetch);
      } catch (error) {
        console.error("Error removing favorite:", error);
        // Re-add the card if removal failed
        getStudyProgrammeById(programmeId, apiFetch).then((data) => {
          if (data) {
            setStudyProgrammes([data]);
            setIsFading(false);
          }
        });
        return;
      }

      // After 1800ms (fade animation duration), show empty state
      setTimeout(() => {
        setShowEmpty(true);
      }, 1800);
    } else {
      // Not the last card, just remove it immediately
      setStudyProgrammes(newProgrammes);

      // Remove from database
      try {
        await removeFavorite(programmeId, apiFetch);
      } catch (error) {
        console.error("Error removing favorite:", error);
        // Re-add the card if removal failed
        getStudyProgrammeById(programmeId, apiFetch).then((data) => {
          if (data) {
            setStudyProgrammes((prev) => [...prev, data]);
          }
        });
      }
    }
  };

  // Show loading spinner while fetching programme details
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show empty state after fade animation completes
  if (showEmpty) {
    return <FavouritesEmpty />;
  }

  return (
    <Box
      sx={{
        maxWidth: 650,
        margin: "0 auto",
        opacity: isFading ? 0 : 1,
        transition: "opacity 1800ms ease-in-out",
      }}
    >
      <DataSource />
      <Typography variant="h2" sx={{ marginBottom: 3 }}>
        Deine Favoriten
      </Typography>

      {/* Display favorite programmes as cards */}
      <Stack spacing={2}>
        {studyProgrammes.map((programme) => (
          <StudyProgrammeCard
            key={programme.studiengang_id}
            programme={programme}
            isFavorite={true}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default FavouritesList;
