import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarsIcon from "@mui/icons-material/Stars";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SchoolIcon from "@mui/icons-material/School";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { StudyProgramme } from "../../types/StudyProgramme.types";
import theme from "../../theme/theme";
import { useNavigate, useLocation } from "react-router-dom";

interface CollapsibleStudyProgrammeCardProps {
  programmes: StudyProgramme[];
  isFavorites: Map<string, boolean>;
  onToggleFavorite?: (programmeId: string) => void;
}

/**
 * CollapsibleStudyProgrammeCard displays multiple study programmes with the same name
 * in a collapsible accordion format. Shows a summary of the group and expands to show
 * individual programmes.
 */
const CollapsibleStudyProgrammeCard: React.FC<
  CollapsibleStudyProgrammeCardProps
> = ({ programmes, isFavorites, onToggleFavorite }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const handleCardClick = (programme: StudyProgramme) => {
    navigate(`/study-programme/${programme.studiengang_id}`, {
      state: { previousPage: location.pathname },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, programme: StudyProgramme) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/study-programme/${programme.studiengang_id}`, {
        state: { previousPage: location.pathname },
      });
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent, programmeId: string) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(programmeId);
    }
  };

  const isAnyFavorite = programmes.some((p) =>
    isFavorites.get(p.studiengang_id),
  );
  const programmeCount = programmes.length;
  const uniqueUniversities = [...new Set(programmes.map((p) => p.hochschule))]
    .length;

  // Calculate similarity range
  const similarities = programmes
    .map((p) => p.similarity)
    .filter((s): s is number => s !== undefined && s !== null);
  const hasSimilarities = similarities.length > 0;
  const minSimilarity = hasSimilarities ? Math.min(...similarities) : null;
  const maxSimilarity = hasSimilarities ? Math.max(...similarities) : null;

  return (
    <Card
      sx={{
        backgroundColor: `${theme.palette.primary.main}33`,
        boxShadow: 3,
        borderRadius: 2,
        overflow: "visible",
      }}
    >
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          "&.MuiAccordion-root": {
            margin: 0,
          },
          "&.MuiAccordion-root:before": {
            display: "none",
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            padding: 2,
            "&:hover": {
              backgroundColor: `${theme.palette.primary.main}1A`,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              width: "100%",
              flexDirection: { xs: "column", sm: "row" },
              "@media (min-width: 376px)": {
                flexDirection: "row",
                alignItems: "center",
              },
            }}
          >
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                width: { xs: "100%", sm: "auto" },
                "@media (min-width: 376px)": {
                  width: "auto",
                },
              }}
            >
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: 500,
                  marginBottom: 1,
                  color: theme.palette.text.primary,
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {programmes[0]?.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {programmeCount}{" "}
                {programmeCount === 1 ? "Studiengang" : "Studiengänge"} •{" "}
                {uniqueUniversities}{" "}
                {uniqueUniversities === 1 ? "Hochschule" : "Hochschulen"}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                marginTop: { xs: 1, sm: 0 },
                justifyContent: { xs: "flex-start", sm: "flex-end" },
                "@media (min-width: 376px)": {
                  marginTop: 0,
                  justifyContent: "flex-end",
                },
              }}
            >
              {hasSimilarities &&
                minSimilarity !== null &&
                maxSimilarity !== null && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      flexShrink: 0,
                    }}
                  >
                    <AutoAwesomeIcon
                      sx={{
                        fontSize: 18,
                        color: theme.palette.success.main,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.success.main,
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        fontWeight: 500,
                      }}
                    >
                      {minSimilarity === maxSimilarity
                        ? `${Math.round(maxSimilarity * 100)}%`
                        : `${Math.round(minSimilarity * 100)}-${Math.round(maxSimilarity * 100)}%`}
                    </Typography>
                  </Box>
                )}
              {onToggleFavorite && isAnyFavorite && (
                <FavoriteIcon
                  sx={{
                    color: theme.palette.secondary.main,
                    fontSize: { xs: 20, sm: 24 },
                    flexShrink: 0,
                  }}
                />
              )}
            </Box>
          </Box>
        </AccordionSummary>

        <AccordionDetails
          sx={{
            padding: 0,
            backgroundColor: `${theme.palette.primary.main}0D`,
          }}
        >
          <Stack spacing={1} sx={{ padding: 2, paddingTop: 1 }}>
            {programmes.map((programme) => {
              const isFavorite = isFavorites.get(programme.studiengang_id);
              return (
                <Card
                  key={programme.studiengang_id}
                  onClick={() => handleCardClick(programme)}
                  onKeyDown={(e) => handleKeyDown(e, programme)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Details anzeigen für ${programme.name} an ${programme.hochschule}`}
                  sx={{
                    backgroundColor: theme.palette.background.default,
                    boxShadow: 1,
                    borderRadius: 1,
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    "&:hover": {
                      backgroundColor: `${theme.palette.primary.main}33`,
                    },
                  }}
                >
                  <CardContent
                    sx={{ padding: 1.5, "&:last-child": { pb: 1.5 } }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 1,
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            marginBottom: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <SchoolIcon
                              sx={{
                                fontSize: 18,
                              }}
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.text.primary,
                              fontSize: { xs: "0.8rem", sm: "0.9rem" },
                              fontWeight: 500,
                              wordBreak: "break-word",
                            }}
                          >
                            {programme.hochschule}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            marginBottom: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <StarsIcon
                              sx={{
                                fontSize: 16,
                              }}
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.text.primary,
                              fontSize: { xs: "0.8rem", sm: "0.9rem" },
                            }}
                          >
                            {programme.abschluss}
                          </Typography>
                        </Box>

                        {/* Similarity Score */}
                        {programme.similarity !== undefined &&
                          programme.similarity !== null && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 18,
                                  height: 18,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <AutoAwesomeIcon
                                  sx={{
                                    fontSize: 16,
                                    color: theme.palette.success.main,
                                  }}
                                />
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: theme.palette.success.main,
                                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                                  fontWeight: 500,
                                }}
                              >
                                Match: {Math.round(programme.similarity * 100)}%
                              </Typography>
                            </Box>
                          )}
                      </Box>
                      {onToggleFavorite && (
                        <IconButton
                          onClick={(e) =>
                            handleFavoriteClick(e, programme.studiengang_id)
                          }
                          aria-label={
                            isFavorite
                              ? "Aus Favoriten entfernen"
                              : "Zu Favoriten hinzufügen"
                          }
                          sx={{
                            padding: 0.5,
                            flexShrink: 0,
                          }}
                        >
                          {isFavorite ? (
                            <FavoriteIcon
                              sx={{
                                color: theme.palette.secondary.main,
                                fontSize: { xs: 20, sm: 24 },
                              }}
                            />
                          ) : (
                            <FavoriteBorderIcon
                              sx={{
                                color: theme.palette.favorites.inactive,
                                fontSize: { xs: 20, sm: 24 },
                              }}
                            />
                          )}
                        </IconButton>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};

export default CollapsibleStudyProgrammeCard;
