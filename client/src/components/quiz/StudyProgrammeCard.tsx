import React from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaceIcon from "@mui/icons-material/Place";
import StarsIcon from "@mui/icons-material/Stars";
import { StudyProgramme } from "../../types/StudyProgramme.types";
import theme from "../../theme/theme";
import { useNavigate } from "react-router-dom";

interface StudyProgrammeCardProps {
  programme: StudyProgramme;
  isFavorite?: boolean;
  onToggleFavorite?: (programmeId: number) => void;
  clickable?: boolean;
}

/**
 * StudyProgrammeCard component displays a single study programme
 * in a card format with favorite functionality and optional navigation.
 */
const StudyProgrammeCard: React.FC<StudyProgrammeCardProps> = ({
  programme,
  isFavorite = false,
  onToggleFavorite,
  clickable = true,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (clickable) {
      navigate(`/study-programme/${programme.id}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(programme.id);
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: `${theme.palette.primary.main}33`,
        boxShadow: 3,
        borderRadius: 2,
        cursor: clickable ? "pointer" : "default",
        transition: "background-color 0.3s",
        "&:hover": clickable
          ? {
              backgroundColor: `${theme.palette.primary.main}80`,
            }
          : {},
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ padding: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 500,
                marginBottom: 1,
                color: theme.palette.text.primary,
              }}
            >
              {programme.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                marginBottom: 1,
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PlaceIcon
                  sx={{
                    fontSize: 20,
                  }}
                />
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                }}
              >
                {programme.university}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <StarsIcon
                  sx={{
                    fontSize: 18,
                  }}
                />
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                }}
              >
                {programme.degree}
              </Typography>
            </Box>
          </Box>
          {onToggleFavorite && (
            <IconButton
              onClick={handleFavoriteClick}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
              sx={{ ml: 1 }}
            >
              {isFavorite ? (
                <FavoriteIcon
                  sx={{
                    color: theme.palette.secondary.main,
                  }}
                />
              ) : (
                <FavoriteBorderIcon
                  sx={{
                    color: theme.palette.favorites.inactive,
                  }}
                />
              )}
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StudyProgrammeCard;
