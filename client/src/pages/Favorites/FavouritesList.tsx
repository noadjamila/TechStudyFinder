import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { StudyProgramme } from "../../types/StudyProgramme.types";
import StudyProgrammeList from "../../components/cards/StudyProgrammeList";

interface FavouritesListProps {
  favorites: string[]; // Array of study programme IDs (e.g., ["g1234", "g5678"])
}

/**
 * FavouritesList component displays a user's favorite study programmes.
 * Fetches the actual study programme data and displays them using the
 * StudyProgrammeList base component, with the headline "Meine Favoriten".
 *
 * @component
 * @param {FavouritesListProps} props - Component props
 * @returns {React.ReactElement} The favorites list component
 */
const FavouritesList: React.FC<FavouritesListProps> = ({ favorites }) => {
  const [studyProgrammes, setStudyProgrammes] = useState<StudyProgramme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteSet] = useState<Set<string>>(new Set(favorites));

  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // favorites are already in string format (e.g., ["g1234", "g5678"])
        const response = await fetch(
          `/api/quiz/programmes?ids=${favorites.join(",")}`,
          {
            credentials: "include", // Include cookies for session
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch programmes: ${response.statusText}`);
        }

        const data = await response.json();
        const programmes: StudyProgramme[] = data.programmes.map(
          (prog: any) => ({
            id: prog.id,
            name: prog.name,
            university: prog.university,
            degree: prog.degree,
          }),
        );

        setStudyProgrammes(programmes);
      } catch (err) {
        console.error("Failed to fetch favorite study programmes:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching programs",
        );
        setStudyProgrammes([]);
      } finally {
        setLoading(false);
      }
    };

    if (favorites && favorites.length > 0) {
      fetchFavoriteDetails();
    } else {
      setStudyProgrammes([]);
      setLoading(false);
    }
  }, [favorites]);

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

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: 3,
        }}
      >
        <div style={{ color: "red", textAlign: "center" }}>
          <p>Error loading favorites: {error}</p>
        </div>
      </Box>
    );
  }

  return (
    <StudyProgrammeList
      studyProgrammes={studyProgrammes}
      headline="Meine Favoriten"
      favorites={favoriteSet}
    />
  );
};

export default FavouritesList;
