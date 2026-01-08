import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import { StudyProgramme } from "../../types/StudyProgramme.types";
import StudyProgrammeCard from "../../components/cards/StudyProgrammeCard";
import { getStudyProgrammeById } from "../../api/quizApi";
import { removeFavorite } from "../../api/favoritesApi";
import MainLayout from "../../layouts/MainLayout";
import FavouritesEmpty from "./FavouritesEmpty";

interface FavouritesListProps {
  favorites: string[]; // Array of study programme IDs (e.g., ["g1234", "g5678"])
}

/**
 * FavouritesList component displays a user's favorite study programmes.
 * Shows cards without Results filters. When last favorite is unliked, fades out and transitions to FavouritesEmpty.
 *
 * @component
 * @param {FavouritesListProps} props - Component props
 * @returns {React.ReactElement} The favorites list component
 */
const FavouritesList: React.FC<FavouritesListProps> = ({ favorites }) => {
  const [studyProgrammes, setStudyProgrammes] = useState<StudyProgramme[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);

  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      if (!favorites || favorites.length === 0) {
        setStudyProgrammes([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      // Fetch each favorite programme
      const promises = favorites.map((id: string) => getStudyProgrammeById(id));
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

  const toggleFavorite = async (programmeId: string) => {
    // Remove card from display
    const newProgrammes = studyProgrammes.filter(
      (p) => p.studiengang_id !== programmeId,
    );

    // If this is the last card, start fade animation
    if (newProgrammes.length === 0) {
      setIsFading(true);

      // Remove from database
      try {
        await removeFavorite(programmeId);
      } catch (error) {
        console.error("Error removing favorite:", error);
        // Re-add the card if removal failed
        getStudyProgrammeById(programmeId).then((data) => {
          if (data) {
            setStudyProgrammes([data]);
            setIsFading(false);
          }
        });
        return;
      }

      // After 1800ms, show empty state
      setTimeout(() => {
        setShowEmpty(true);
      }, 1800);
    } else {
      // Not the last card, just remove it
      setStudyProgrammes(newProgrammes);

      // Remove from database
      try {
        await removeFavorite(programmeId);
      } catch (error) {
        console.error("Error removing favorite:", error);
        // Re-add the card if removal failed
        getStudyProgrammeById(programmeId).then((data) => {
          if (data) {
            setStudyProgrammes((prev) => [...prev, data]);
          }
        });
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
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
      </MainLayout>
    );
  }

  // Show empty state after transition
  if (showEmpty) {
    return <FavouritesEmpty />;
  }

  return (
    <MainLayout>
      <Box
        sx={{
          maxWidth: 800,
          margin: { xs: "0 auto", sm: "0" },
          paddingBottom: { xs: "120px", sm: 3 },
          opacity: isFading ? 0 : 1,
          transition: "opacity 1800ms ease-in-out",
        }}
      >
        <Typography variant="h2" sx={{ marginBottom: 3 }}>
          Meine Favoriten
        </Typography>

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
    </MainLayout>
  );
};

export default FavouritesList;
