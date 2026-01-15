import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Select,
  MenuItem,
  FormControl,
  Snackbar,
} from "@mui/material";
import theme from "../../theme/theme";
import { StudyProgramme } from "../../types/StudyProgramme.types";
import PlaceIcon from "@mui/icons-material/Place";
import StarsIcon from "@mui/icons-material/Stars";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import StudyProgrammeCard from "../cards/StudyProgrammeCard";
import { useNavigate, useLocation } from "react-router-dom";
import GreenCard from "../cards/GreenCardBaseNotQuiz";
import PrimaryButton from "../buttons/PrimaryButton";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../../api/favoritesApi";
import { useAuth } from "../../contexts/AuthContext";
import { useApiClient } from "../../hooks/useApiClient";

interface ResultsProps {
  studyProgrammes: StudyProgramme[];
}

/**
 * Results component displays filtered study programmes.
 * Receives study programmes as props from parent component.
 */
const Results: React.FC<ResultsProps> = ({ studyProgrammes }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { apiFetch } = useApiClient();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedDegree, setSelectedDegree] = useState<string>("");
  const [showLoginSnackbar, setShowLoginSnackbar] = useState(false);

  // Load favorites from API on component mount and when location changes
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favoriteIds = await getFavorites(apiFetch);
        setFavorites(new Set(favoriteIds));
      } catch (error) {
        console.error("Failed to load favorites:", error);
      }
    };

    loadFavorites();
  }, [location]);

  const handleQuizStart = () => {
    navigate("/quiz");
  };

  const toggleFavorite = async (programmeId: string) => {
    // Check if user is authenticated
    if (!user) {
      setShowLoginSnackbar(true);
      return;
    }

    // Check current state before updating
    const isFavorited = favorites.has(programmeId);

    // Update local state immediately for UX
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(programmeId)) {
        newFavorites.delete(programmeId);
      } else {
        newFavorites.add(programmeId);
      }
      return newFavorites;
    });

    // Save/remove favorite in database
    try {
      if (isFavorited) {
        // Remove from favorites
        await removeFavorite(programmeId, apiFetch);
      } else {
        // Add to favorites
        await addFavorite(programmeId, apiFetch);
      }
    } catch (error: any) {
      // Handle 409 Conflict (already exists) by keeping it as favorited
      if (error.message && error.message.includes("409")) {
        console.debug("Favorite already exists, keeping as favorited");
        setFavorites((prev) => {
          const newFavorites = new Set(prev);
          newFavorites.add(programmeId); // Keep it favorited
          return newFavorites;
        });
      } else {
        console.error("Error toggling favorite:", error);
        // For other errors, revert the local state
        setFavorites((prev) => {
          const reverted = new Set(prev);
          if (isFavorited) {
            reverted.add(programmeId);
          } else {
            reverted.delete(programmeId);
          }
          return reverted;
        });
      }
    }
  };

  // Get unique locations and degrees for filter options
  const locations = useMemo(() => {
    const allLocations = studyProgrammes.flatMap((p) => p.standorte || []);
    const uniqueLocations = [...new Set(allLocations)];
    return uniqueLocations.sort();
  }, [studyProgrammes]);

  const degrees = useMemo(() => {
    const uniqueDegrees = [...new Set(studyProgrammes.map((p) => p.abschluss))];
    return uniqueDegrees.sort();
  }, [studyProgrammes]);

  // Filter programmes based on selected filters
  const filteredProgrammes = useMemo(() => {
    return studyProgrammes.filter((programme) => {
      const matchesLocation =
        !selectedLocation ||
        (programme.standorte && programme.standorte.includes(selectedLocation));
      const matchesDegree =
        !selectedDegree || programme.abschluss === selectedDegree;
      return matchesLocation && matchesDegree;
    });
  }, [studyProgrammes, selectedLocation, selectedDegree]);

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: { xs: "0 auto", sm: "0" },
        paddingBottom: { xs: "120px", sm: 3 },
        minHeight: "100vh",
      }}
    >
      <Typography variant="h2">Meine Ergebnisse</Typography>

      {studyProgrammes.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 12 }}>
          <GreenCard>
            <Typography variant="subtitle1" sx={{ mb: 3, lineHeight: 1.3 }}>
              Keine Studiengänge gefunden!
              <br />
              Versuche, deine Quizantworten anzupassen.
            </Typography>

            <PrimaryButton
              label={"Quiz beginnen"}
              onClick={handleQuizStart}
              ariaText="Quiz beginnen"
            />
          </GreenCard>
        </Box>
      ) : (
        <>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ marginBottom: 3, width: "100%" }}
          >
            <FormControl
              sx={{
                minWidth: { xs: "100%", sm: 250 },
                maxWidth: { xs: "100%", sm: 400 },
                flex: { sm: 1 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                  backgroundColor: theme.palette.background.default,
                },
              }}
            >
              <Select
                id="location-filter"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                displayEmpty
                IconComponent={ArrowDropDownIcon}
                aria-label="Filter nach Standort"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: theme.palette.background.default,
                      maxWidth: { xs: "calc(100vw - 32px)", sm: 400 },
                      "& .MuiMenuItem-root": {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        "&:hover": {
                          backgroundColor: `${theme.palette.primary.main}33`,
                        },
                        "&.Mui-selected": {
                          backgroundColor: `${theme.palette.primary.main}4D`,
                          "&:hover": {
                            backgroundColor: `${theme.palette.primary.main}66`,
                          },
                        },
                      },
                    },
                  },
                }}
                renderValue={(selected) => (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 0,
                    }}
                  >
                    <PlaceIcon
                      sx={{
                        fontSize: 20,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        color: selected
                          ? theme.palette.text.primary
                          : theme.palette.text.skipButton,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {selected || "Stadt"}
                    </Typography>
                  </Box>
                )}
                sx={{
                  borderRadius: "25px",
                  "& .MuiSelect-select": {
                    paddingTop: "10px",
                    paddingBottom: "10px",
                  },
                  "& .MuiSelect-icon": {
                    color: theme.palette.text.primary,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.decorative.blue,
                  },
                }}
              >
                <MenuItem value="">
                  <Box
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "100%",
                    }}
                  >
                    Alle Städte
                  </Box>
                </MenuItem>
                {locations.map((location) => (
                  <MenuItem key={location} value={location}>
                    <Box
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                    >
                      {location}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              sx={{
                minWidth: { xs: "100%", sm: 250 },
                maxWidth: { xs: "100%", sm: 400 },
                flex: { sm: 1 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                  backgroundColor: theme.palette.background.default,
                },
              }}
            >
              <Select
                id="degree-filter"
                value={selectedDegree}
                onChange={(e) => setSelectedDegree(e.target.value)}
                displayEmpty
                IconComponent={ArrowDropDownIcon}
                aria-label="Filter nach Abschluss"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: theme.palette.background.default,
                      maxWidth: { xs: "calc(100vw - 32px)", sm: 400 },
                      "& .MuiMenuItem-root": {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        "&:hover": {
                          backgroundColor: `${theme.palette.primary.main}33`,
                        },
                        "&.Mui-selected": {
                          backgroundColor: `${theme.palette.primary.main}4D`,
                          "&:hover": {
                            backgroundColor: `${theme.palette.primary.main}66`,
                          },
                        },
                      },
                    },
                  },
                }}
                renderValue={(selected) => (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 0,
                    }}
                  >
                    <StarsIcon
                      sx={{
                        fontSize: 20,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        color: selected
                          ? theme.palette.text.primary
                          : theme.palette.text.skipButton,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {selected || "Abschluss"}
                    </Typography>
                  </Box>
                )}
                sx={{
                  borderRadius: "25px",
                  "& .MuiSelect-select": {
                    paddingTop: "10px",
                    paddingBottom: "10px",
                  },
                  "& .MuiSelect-icon": {
                    color: theme.palette.text.primary,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.decorative.blue,
                  },
                }}
              >
                <MenuItem value="">
                  <Box
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "100%",
                    }}
                  >
                    Alle Abschlüsse
                  </Box>
                </MenuItem>
                {degrees.map((degree) => (
                  <MenuItem key={degree} value={degree}>
                    <Box
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                    >
                      {degree}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack spacing={2}>
            {filteredProgrammes.map((programme) => {
              return (
                <StudyProgrammeCard
                  key={programme.studiengang_id}
                  programme={programme}
                  isFavorite={favorites.has(programme.studiengang_id)}
                  onToggleFavorite={toggleFavorite}
                />
              );
            })}
          </Stack>
        </>
      )}

      {/* Login Required Snackbar */}
      <Snackbar
        open={showLoginSnackbar}
        autoHideDuration={1800}
        onClose={() => setShowLoginSnackbar(false)}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.decorative.green,
            borderRadius: 4,
            boxShadow: 3,
            px: { xs: 2, md: 4 },
            py: { xs: 3, md: 4 },
            maxWidth: { xs: 280, md: 400 },
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              color: theme.palette.text.primary,
              fontSize: { xs: "0.95rem", md: "1rem" },
              fontWeight: 500,
            }}
          >
            Du musst dich erst einloggen, um deine Favoriten speichern zu
            können.
          </Typography>
        </Box>
      </Snackbar>
    </Box>
  );
};

export default Results;
