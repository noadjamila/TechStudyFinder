import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, Card, CardContent } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaceIcon from "@mui/icons-material/Place";
import StarsIcon from "@mui/icons-material/Stars";
import { StudyProgramme } from "../types/StudyProgramme.types";
import theme from "../theme/theme";
import DataSource from "../components/DataSource";
import Back_Button from "../components/buttons/Back_Button";

/**
 * StudyProgrammeDetailPage displays detailed information about a single study programme.
 * Receives the programme ID from the URL parameters.
 */
const StudyProgrammeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data - replace with actual data fetching based on ID
  const studyProgrammes: StudyProgramme[] = [
    {
      id: 1,
      name: "Communication Systems and Networks",
      university: "Technische Hochschule Köln",
      degree: "Master",
    },
    {
      id: 2,
      name: "Betriebliche Umweltinformatik",
      university: "Hochschule für Technik und Wirtschaft Berlin",
      degree: "Master",
    },
    {
      id: 3,
      name: "Informatik",
      university: "Rheinische Friedrich-Wilhelms-Universität Bonn",
      degree: "Bachelor of Science",
    },
    {
      id: 4,
      name: "Medieninformatik",
      university: "Universität zu Lübeck",
      degree: "Bachelor of Science",
    },
    {
      id: 5,
      name: "Data Science",
      university: "Ludwig-Maximilians-Universität München",
      degree: "Master of Science",
    },
  ];

  const programme = studyProgrammes.find((p) => p.id === Number(id));

  if (!programme) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          overflow: "auto",
        }}
      >
        <DataSource />
        <Box
          sx={{
            maxWidth: 800,
            margin: "0 auto",
            padding: 3,
          }}
        >
          <Back_Button
            label="Zurück"
            onClick={() => navigate("/results")}
            sx={{
              marginBottom: 2,
            }}
          />
          <Typography variant="h6">Studiengang nicht gefunden</Typography>
        </Box>
      </Box>
    );
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        overflow: "auto",
      }}
    >
      <DataSource />
      <Box
        sx={{
          maxWidth: 800,
          margin: "0 auto",
          padding: 3,
        }}
      >
        {/* Back button */}
        <Back_Button
          label="Zurück"
          onClick={() => navigate("/results")}
          sx={{
            marginBottom: 3,
            height: { xs: "35px", sm: "45px" },
            fontSize: { xs: "0.80rem", sm: "1rem" },
            "& .MuiButton-startIcon": {
              "& .MuiSvgIcon-root": {
                fontSize: { xs: 16, sm: 20 },
              },
            },
          }}
        />

        {/* Study programme card */}
        <Card
          sx={{
            padding: { xs: 2, sm: 4 },
            backgroundColor: `${theme.palette.primary.main}33`,
            boxShadow: 3,
            borderRadius: 2,
            marginBottom: 3,
          }}
        >
          <CardContent
            sx={{ padding: 0, "&:last-child": { paddingBottom: 0 } }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 2,
                marginBottom: 3,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    marginBottom: 2,
                    color: theme.palette.text.header,
                    fontSize: { xs: "1.75rem", sm: "2.5rem" },
                  }}
                >
                  {programme.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    marginBottom: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PlaceIcon
                      sx={{
                        fontSize: 24,
                        color: theme.palette.text.subHeader,
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.subHeader,
                      fontSize: "1.1rem",
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
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <StarsIcon
                      sx={{
                        fontSize: 22,
                        color: theme.palette.text.subHeader,
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.subHeader,
                      fontSize: "1.1rem",
                    }}
                  >
                    {programme.degree}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={toggleFavorite}
                aria-label={
                  isFavorite
                    ? "Aus Favoriten entfernen"
                    : "Zu Favoriten hinzufügen"
                }
                sx={{
                  padding: 1,
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                {isFavorite ? (
                  <FavoriteIcon
                    sx={{
                      color: theme.palette.secondary.main,
                      fontSize: 36,
                    }}
                  />
                ) : (
                  <FavoriteBorderIcon
                    sx={{
                      color: theme.palette.favorites.inactive,
                      fontSize: 36,
                    }}
                  />
                )}
              </IconButton>
            </Box>

            {/* Additional details section */}
            <Box
              sx={{
                marginTop: 4,
                padding: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  marginBottom: 2,
                  color: theme.palette.text.header,
                }}
              >
                Studiengangs-Details
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                  lineHeight: 1.8,
                }}
              >
                Weitere Informationen zu diesem Studiengang werden hier
                angezeigt. Dies kann eine Beschreibung des Studiengangs,
                Zulassungsvoraussetzungen, Studiendauer und andere relevante
                Details enthalten.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default StudyProgrammeDetailPage;
