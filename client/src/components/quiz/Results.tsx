import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  ThemeProvider,
  Stack,
  List,
  ListItem,
  Divider,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { GridLegacy as Grid } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import theme from "../../theme/theme";
import { StudyProgramme } from "../../types/StudyProgramme.types";
import PlaceIcon from "@mui/icons-material/Place";
import StarsIcon from "@mui/icons-material/Stars";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface ResultsProps {
  studyProgrammes: StudyProgramme[];
}

/**
 * Results component displays filtered study programmes.
 * Receives study programmes as props from parent component.
 */
const Results: React.FC<ResultsProps> = ({ studyProgrammes }) => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [selectedDegree, setSelectedDegree] = useState<string>("");

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
      ...new Set(studyProgrammes.map((p) => p.university)),
    ];
    return uniqueUniversities.sort();
  }, [studyProgrammes]);

  const degrees = useMemo(() => {
    const uniqueDegrees = [...new Set(studyProgrammes.map((p) => p.degree))];
    return uniqueDegrees.sort();
  }, [studyProgrammes]);

  // Filter programmes based on selected filters
  const filteredProgrammes = useMemo(() => {
    return studyProgrammes.filter((programme) => {
      const matchesUniversity =
        !selectedUniversity || programme.university === selectedUniversity;
      const matchesDegree =
        !selectedDegree || programme.degree === selectedDegree;
      return matchesUniversity && matchesDegree;
    });
  }, [studyProgrammes, selectedUniversity, selectedDegree]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          maxWidth: 800,
          margin: "0 auto",
          padding: 3,
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
          <Box sx={{ padding: 2 }}>
            <Typography variant="h6">No study programmes found</Typography>
            <Typography variant="body2">
              Try adjusting your quiz answers
            </Typography>
          </Box>
        ) : (
          <>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{ marginBottom: 3 }}
            >
              <FormControl
                sx={{
                  minWidth: { xs: 250, sm: 250 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "25px",
                    backgroundColor: theme.palette.results.background,
                  },
                }}
              >
                <Select
                  id="university-filter"
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  displayEmpty
                  IconComponent={ArrowDropDownIcon}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PlaceIcon
                        sx={{
                          fontSize: 20,
                        }}
                      />
                      <Typography
                        sx={{
                          color: selected
                            ? theme.palette.results.filterSelected
                            : theme.palette.results.filterUnselected,
                        }}
                      >
                        {selected || "Universität/Hochschule"}
                      </Typography>
                    </Box>
                  )}
                  sx={{
                    borderRadius: "25px",
                    "& .MuiSelect-icon": {
                      color: theme.palette.results.filterBorder,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.quiz.buttonColor,
                    },
                  }}
                >
                  <MenuItem value="">Alle Universitäten/Hochschulen</MenuItem>
                  {universities.map((university) => (
                    <MenuItem key={university} value={university}>
                      {university}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                sx={{
                  minWidth: { xs: 250, sm: 250 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "25px",
                    backgroundColor: theme.palette.results.background,
                  },
                }}
              >
                <Select
                  id="degree-filter"
                  value={selectedDegree}
                  onChange={(e) => setSelectedDegree(e.target.value)}
                  displayEmpty
                  IconComponent={ArrowDropDownIcon}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <StarsIcon
                        sx={{
                          fontSize: 20,
                        }}
                      />
                      <Typography
                        sx={{
                          color: selected
                            ? theme.palette.results.filterSelected
                            : theme.palette.results.filterUnselected,
                        }}
                      >
                        {selected || "Abschluss"}
                      </Typography>
                    </Box>
                  )}
                  sx={{
                    borderRadius: "25px",
                    "& .MuiSelect-icon": {
                      color: theme.palette.results.filterBorder,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.quiz.buttonColor,
                    },
                  }}
                >
                  <MenuItem value="">Alle Abschlüsse</MenuItem>
                  {degrees.map((degree) => (
                    <MenuItem key={degree} value={degree}>
                      {degree}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <List sx={{ width: "100%" }}>
              {filteredProgrammes.map((programme, index) => (
                <React.Fragment key={programme.id}>
                  <ListItem
                    sx={{
                      padding: 2,
                      transition: "background-color 0.3s",
                      "&:hover": {
                        backgroundColor: theme.palette.results.hoverBackground,
                      },
                    }}
                  >
                    <Grid
                      container
                      spacing={2}
                      alignItems="flex-start"
                      sx={{ width: "100%" }}
                    >
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                          {programme.name}
                        </Typography>
                        <IconButton
                          aria-label="favorite"
                          onClick={() => toggleFavorite(programme.id)}
                          sx={{ ml: 1 }}
                        >
                          {favorites.has(programme.id) ? (
                            <FavoriteIcon
                              sx={{
                                color:
                                  theme.palette.results.favoriteIconToggled,
                              }}
                            />
                          ) : (
                            <FavoriteBorderIcon
                              sx={{
                                color:
                                  theme.palette.results.favoriteIconUntoggled,
                              }}
                            />
                          )}
                        </IconButton>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Stack direction="row" alignItems="center" gap={0.5}>
                          <PlaceIcon sx={{ fontSize: 20 }} />
                          <Typography variant="body1">
                            {programme.university}
                          </Typography>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Stack direction="row" alignItems="center" gap={0.5}>
                          <StarsIcon sx={{ fontSize: 20 }} />
                          <Typography variant="body1">
                            {programme.degree}
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </ListItem>
                  {index < filteredProgrammes.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Results;
