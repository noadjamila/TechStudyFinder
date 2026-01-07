import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Stack,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import theme from "../../theme/theme";
import { StudyProgramme } from "../../types/StudyProgramme.types";
import PlaceIcon from "@mui/icons-material/Place";
import StarsIcon from "@mui/icons-material/Stars";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import StudyProgrammeCard from "../cards/StudyProgrammeCard";
import { useNavigate } from "react-router-dom";
import EmptyStateCard from "./EmptyStateCard";

interface ResultsProps {
  studyProgrammes: StudyProgramme[];
}

/**
 * Results component displays filtered study programmes.
 * Receives study programmes as props from parent component.
 */
const Results: React.FC<ResultsProps> = ({ studyProgrammes }) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedDegree, setSelectedDegree] = useState<string>("");

  const handleQuizStart = () => {
    navigate("/quiz");
  };

  const toggleFavorite = (programmeId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(programmeId)) {
        newFavorites.delete(programmeId);
      } else {
        newFavorites.add(programmeId);
      }
      return newFavorites;
    });
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
        <Box sx={{ textAlign: "center", mt: { xs: 4, sm: 5 } }}>
          <EmptyStateCard
            message={
              <>
                Keine Studiengänge gefunden!
                <br />
                Versuche, deine Quizantworten anzupassen.
              </>
            }
            buttonLabel="Quiz beginnen"
            onButtonClick={handleQuizStart}
          />
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
    </Box>
  );
};

export default Results;
