import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Select,
  MenuItem,
  FormControl,
  Button,
  Popover,
  Divider,
} from "@mui/material";
import theme from "../../theme/theme";
import { StudyProgramme } from "../../types/StudyProgramme.types";
import StarsIcon from "@mui/icons-material/Stars";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FilterListIcon from "@mui/icons-material/FilterList";
import SchoolIcon from "@mui/icons-material/School";
import StudyProgrammeCard from "../cards/StudyProgrammeCard";
import CollapsibleStudyProgrammeCard from "../cards/CollapsibleStudyProgrammeCard";
import { useNavigate, useLocation } from "react-router-dom";
import GreenCard from "../cards/GreenCardBaseNotQuiz";
import PrimaryButton from "../buttons/PrimaryButton";
import DataSource from "../DataSource";
import LoginReminderDialog, {
  FAVORITES_LOGIN_MESSAGE,
} from "../dialogs/LoginReminderDialog";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../../api/favoritesApi";
import { useAuth } from "../../contexts/AuthContext";
import { useApiClient } from "../../hooks/useApiClient";

interface ResultsProps {
  studyProgrammes: StudyProgramme[];
  isFreshResults?: boolean;
}

/**
 * Results component displays filtered study programmes with interactive features.
 *
 * Receives study programmes as props from parent component and provides:
 * - Filtering options by university and degree type
 * - Favorite/unfavorite functionality (requires user authentication)
 * - Login reminder dialog when attempting to favorite while not logged in
 * - Automatic loading of user's favorites on component mount and navigation
 */
const Results: React.FC<ResultsProps> = ({
  studyProgrammes,
  isFreshResults = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { apiFetch } = useApiClient();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedDegree, setSelectedDegree] = useState<string>("");
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const isFilterOpen = Boolean(filterAnchorEl);

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
      setShowLoginDialog(true);
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

  // Get available filter options based on current selections
  const availableUniversities = useMemo(() => {
    const filtered = studyProgrammes.filter((programme) => {
      const matchesDegree =
        !selectedDegree || programme.abschluss === selectedDegree;
      return matchesDegree;
    });
    const uniqueUniversities = [...new Set(filtered.map((p) => p.hochschule))];
    return uniqueUniversities.sort();
  }, [studyProgrammes, selectedDegree]);

  const availableDegrees = useMemo(() => {
    const filtered = studyProgrammes.filter((programme) => {
      const matchesUniversity =
        !selectedUniversity || programme.hochschule === selectedUniversity;
      return matchesUniversity;
    });
    const uniqueDegrees = [...new Set(filtered.map((p) => p.abschluss))];
    return uniqueDegrees.sort();
  }, [studyProgrammes, selectedUniversity]);

  // Filter programmes based on selected filters
  const filteredProgrammes = useMemo(() => {
    return studyProgrammes.filter((programme) => {
      const matchesDegree =
        !selectedDegree || programme.abschluss === selectedDegree;
      const matchesUniversity =
        !selectedUniversity || programme.hochschule === selectedUniversity;
      return matchesDegree && matchesUniversity;
    });
  }, [studyProgrammes, selectedDegree, selectedUniversity]);

  // Group programmes by name and limit to 20 items total
  const groupedProgrammes = useMemo(() => {
    const groups: Map<string, StudyProgramme[]> = new Map();

    // Group by programme name
    filteredProgrammes.forEach((programme) => {
      const name = programme.name;
      if (!groups.has(name)) {
        groups.set(name, []);
      }
      groups.get(name)!.push(programme);
    });

    // Convert to array, maintaining insertion order
    const groupArray = Array.from(groups.entries()).map(([name, items]) => ({
      name,
      programmes: items,
    }));

    // Limit to 20 total items (each group or individual programme = 1 item)
    const MAX_ITEMS = 20;
    const limitedGroups = groupArray.slice(0, MAX_ITEMS);

    return limitedGroups;
  }, [filteredProgrammes]);

  return (
    <Box
      sx={{
        maxWidth: 650,
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      <DataSource />
      <Typography variant="h2">
        {isFreshResults ? "Meine Ergebnisse" : "Meine letzten Ergebnisse"}
      </Typography>

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
          <Box sx={{ marginBottom: 3, display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleFilterClick}
              sx={{
                borderRadius: "25px",
                paddingX: 3,
                paddingY: 1,
                textTransform: "none",
                borderColor: theme.palette.primary.main,
                color: theme.palette.text.primary,
                fontSize: "16px",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: `${theme.palette.primary.main}1A`,
                },
              }}
            >
              Filter
            </Button>

            {(selectedDegree || selectedUniversity) && (
              <Button
                variant="text"
                onClick={() => {
                  setSelectedDegree("");
                  setSelectedUniversity("");
                }}
                sx={{
                  borderRadius: "25px",
                  paddingX: 3,
                  paddingY: 1,
                  textTransform: "none",
                  color: theme.palette.text.primary,
                  fontSize: "16px",
                  "&:hover": {
                    backgroundColor: `${theme.palette.primary.main}1A`,
                  },
                }}
              >
                Filter zurücksetzen
              </Button>
            )}

            <Popover
              open={isFilterOpen}
              anchorEl={filterAnchorEl}
              onClose={handleFilterClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              sx={{
                "& .MuiPopover-paper": {
                  backgroundColor: theme.palette.background.default,
                  borderRadius: "16px",
                  padding: 2,
                  minWidth: 300,
                  maxWidth: { xs: "calc(100vw - 32px)", sm: 400 },
                },
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Filter Optionen
              </Typography>

              <Stack spacing={2}>
                <FormControl fullWidth>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Hochschule
                  </Typography>
                  <Select
                    id="university-filter"
                    value={selectedUniversity}
                    onChange={(e) => setSelectedUniversity(e.target.value)}
                    displayEmpty
                    IconComponent={ArrowDropDownIcon}
                    aria-label="Filter nach Hochschule"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: theme.palette.background.default,
                          maxHeight: 300,
                          "& .MuiMenuItem-root": {
                            whiteSpace: "normal",
                            wordWrap: "break-word",
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
                        <SchoolIcon
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
                          {selected || "Alle Hochschulen"}
                        </Typography>
                      </Box>
                    )}
                    sx={{
                      borderRadius: "12px",
                      backgroundColor: theme.palette.background.paper,
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
                        Alle Hochschulen
                      </Box>
                    </MenuItem>
                    {availableUniversities.map((university) => (
                      <MenuItem key={university} value={university}>
                        {university}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Divider />

                <FormControl fullWidth>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Abschluss
                  </Typography>
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
                          maxHeight: 300,
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
                          {selected || "Alle Abschlüsse"}
                        </Typography>
                      </Box>
                    )}
                    sx={{
                      borderRadius: "12px",
                      backgroundColor: theme.palette.background.paper,
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
                    {availableDegrees.map((degree) => (
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
            </Popover>
          </Box>

          <Stack spacing={2}>
            {groupedProgrammes.map((group) => {
              // Create a Map of favorites for this group
              const isFavoritesMap = new Map(
                group.programmes.map((p) => [
                  p.studiengang_id,
                  favorites.has(p.studiengang_id),
                ]),
              );

              // If only one programme in the group, render as normal card
              if (group.programmes.length === 1) {
                const programme = group.programmes[0];
                return (
                  <StudyProgrammeCard
                    key={programme.studiengang_id}
                    programme={programme}
                    isFavorite={favorites.has(programme.studiengang_id)}
                    onToggleFavorite={toggleFavorite}
                  />
                );
              }

              // If multiple programmes with same name, render as collapsible
              return (
                <CollapsibleStudyProgrammeCard
                  key={`group-${group.name}`}
                  programmes={group.programmes}
                  isFavorites={isFavoritesMap}
                  onToggleFavorite={toggleFavorite}
                />
              );
            })}
          </Stack>
        </>
      )}

      {/* Login Required Dialog */}
      <LoginReminderDialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        onLoginClick={() =>
          navigate("/login", { state: { redirectTo: location.pathname } })
        }
        message={FAVORITES_LOGIN_MESSAGE}
      />
    </Box>
  );
};

export default Results;
