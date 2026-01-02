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
import StudyProgrammeCard from "./StudyProgrammeCard";
import { useNavigate } from "react-router-dom";
import StartButton from "../buttons/Button";
import CardStack from "./CardStack";

interface ResultsProps {
  studyProgrammes: StudyProgramme[];
}

/**
 * Results component displays filtered study programmes.
 * Receives study programmes as props from parent component.
 */
const Results: React.FC<ResultsProps> = ({ studyProgrammes }) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [selectedDegree, setSelectedDegree] = useState<string>("");

  const handleQuizStart = () => {
    navigate("/quiz");
  };

  const toggleFavorite = (programmeId: number) => {
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

  // Get unique universities and degrees for filter options
  const universities = useMemo(() => {
    const uniqueUniversities = [
      ...new Set(studyProgrammes.map((p) => p.hochschule)),
    ];
    return uniqueUniversities.sort();
  }, [studyProgrammes]);

  const degrees = useMemo(() => {
    const uniqueDegrees = [...new Set(studyProgrammes.map((p) => p.abschluss))];
    return uniqueDegrees.sort();
  }, [studyProgrammes]);

  // Filter programmes based on selected filters
  const filteredProgrammes = useMemo(() => {
    return studyProgrammes.filter((programme) => {
      const matchesUniversity =
        !selectedUniversity || programme.hochschule === selectedUniversity;
      const matchesDegree =
        !selectedDegree || programme.abschluss === selectedDegree;
      return matchesUniversity && matchesDegree;
    });
  }, [studyProgrammes, selectedUniversity, selectedDegree]);

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: { xs: "0 auto", sm: "0" },
        padding: 3,
        paddingBottom: { xs: "120px", sm: 3 },
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        color="text.header"
        sx={{
          marginBottom: 3,
          fontWeight: 700,
          fontSize: "2.5rem", // Desktop: 40px
          "@media (max-width:600px)": {
            fontSize: "2rem", // Mobile: 32px
          },
        }}
      >
        Meine Ergebnisse
      </Typography>

      {studyProgrammes.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: { xs: 4, sm: 5 } }}>
          <CardStack currentIndex={1} totalCards={1}>
            <Box
              sx={{
                width: { xs: "100%", md: "120%" },
                maxWidth: { xs: 360, sm: 520 },
                px: { xs: 3, md: 6 },
                py: { xs: 3, md: 4 },
                mx: "auto",
                backgroundColor: theme.palette.decorative.green,
                borderRadius: 4,
                boxShadow: 3,
                justifyContent: "center",
                position: "relative",
              }}
            >
              {/* Mascot Image */}
              <Box
                component="img"
                src="/mascot_standing_blue.svg"
                alt="Maskottchen"
                sx={{
                  position: "absolute",
                  width: { xs: 40, sm: 40 },
                  height: "auto",
                  top: { xs: -60, sm: -58 },
                  right: { xs: 60, sm: 50 },
                }}
              />

              {/* Card Text */}
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 3,
                  lineHeight: 1.3,
                }}
              >
                Keine Studiengänge gefunden!
                <br />
                Versuche, deine Quizantworten anzupassen.
              </Typography>

              {/* Start Quiz Button */}
              <StartButton
                label="Quiz beginnen"
                onClick={handleQuizStart}
                sx={{
                  borderRadius: 3,
                  padding: "8px 16px",
                  fontSize: "1.0rem",
                  width: "fit-content",
                  mx: "auto",
                  display: "block",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.text.primary,
                  fontWeight: "normal",
                }}
              />
            </Box>
          </CardStack>
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
                id="university-filter"
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                displayEmpty
                IconComponent={ArrowDropDownIcon}
                aria-label="Filter nach Universität oder Hochschule"
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
                      {selected || "Universität/Hochschule"}
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
                    Alle Universitäten/Hochschulen
                  </Box>
                </MenuItem>
                {universities.map((university) => (
                  <MenuItem key={university} value={university}>
                    <Box
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                    >
                      {university}
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
            {filteredProgrammes.map((programme) => (
              <StudyProgrammeCard
                key={programme.id}
                programme={programme}
                isFavorite={favorites.has(programme.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default Results;
