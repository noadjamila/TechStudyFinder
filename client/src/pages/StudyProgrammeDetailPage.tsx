import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaceIcon from "@mui/icons-material/Place";
import StarsIcon from "@mui/icons-material/Stars";
import { StudyProgramme } from "../types/StudyProgramme.types";
import theme from "../theme/theme";
import DataSource from "../components/DataSource";
import Back_Button from "../components/buttons/BackButton";
import DesktopLayout from "../layouts/DesktopLayout";

/**
 * StudyProgrammeDetailPage displays detailed information about a single study programme.
 * Receives the programme ID from the URL parameters.
 */
const StudyProgrammeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const muiTheme = useTheme();
  const toggleSidebar = () => {};
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("sm"));

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

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (!programme) {
    const NotFoundContent = isDesktop ? (
      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        <Box sx={{ padding: 3 }}>
          <Back_Button
            label="Zurück"
            onClick={() => navigate("/results")}
            sx={{
              marginBottom: 2,
            }}
          />
        </Box>
        <DataSource />
        <Box sx={{ padding: 3, paddingTop: 0 }}>
          <Typography variant="h6">Studiengang nicht gefunden</Typography>
        </Box>
      </Box>
    ) : (
      <>
        <Box sx={{ padding: 3 }}>
          <Back_Button
            label="Zurück"
            onClick={() => navigate("/results")}
            sx={{
              marginBottom: 2,
            }}
          />
        </Box>
        <DataSource />
        <Box sx={{ padding: 3, paddingTop: 0 }}>
          <Typography variant="h6">Studiengang nicht gefunden</Typography>
        </Box>
      </>
    );

    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          overflow: "auto",
        }}
      >
        {isDesktop ? (
          <DesktopLayout onMenuToggle={toggleSidebar}>
            {NotFoundContent}
          </DesktopLayout>
        ) : (
          NotFoundContent
        )}
      </div>
    );
  }

  // Content that's the same for both desktop and mobile
  const pageContent = (
    <Box sx={{ pb: { xs: "100px", sm: 3 } }}>
      {/* Back button */}
      <Box
        sx={{
          position: { xs: "fixed", sm: "static" },
          top: { xs: 0, sm: "auto" },
          left: { xs: 0, sm: "auto" },
          right: { xs: 0, sm: "auto" },
          zIndex: { xs: 1100, sm: "auto" },
          backgroundColor: {
            xs: theme.palette.background.default,
            sm: "transparent",
          },
          pt: { xs: 6, sm: 1.5 },
          px: 3,
          pb: { xs: 1, sm: 0 },
        }}
      >
        <Back_Button
          label="Zurück"
          onClick={() => navigate("/results")}
          sx={{
            marginBottom: { xs: 0, sm: 1.5 },
            height: { xs: "35px", sm: "45px" },
            fontSize: { xs: "0.80rem", sm: "1rem" },
            "& .MuiButton-startIcon": {
              "& .MuiSvgIcon-root": {
                fontSize: { xs: 16, sm: 20 },
              },
            },
          }}
        />
      </Box>

      <Box sx={{ pt: { xs: "80px", sm: 0 } }}>
        <DataSource />
      </Box>

      {/* Study programme card */}
      <Box sx={{ px: 3, pt: 5 }}>
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
                gap: { xs: 1.5, sm: 2 },
                marginBottom: 3,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0, maxWidth: "calc(100% - 40px)" }}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    color: theme.palette.text.header,
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
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
                  padding: { xs: 0.25, sm: 1 },
                  flexShrink: 0,
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                {isFavorite ? (
                  <FavoriteIcon
                    sx={{
                      color: theme.palette.secondary.main,
                      fontSize: { xs: 24, sm: 36 },
                    }}
                  />
                ) : (
                  <FavoriteBorderIcon
                    sx={{
                      color: theme.palette.favorites.inactive,
                      fontSize: { xs: 24, sm: 36 },
                    }}
                  />
                )}
              </IconButton>
            </Box>

            {/* Additional details section */}
            <Box
              sx={{
                marginTop: { xs: 0, sm: 4 },
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

  // Wrap content differently for desktop vs mobile
  const MainContent = isDesktop ? (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
        pt: 3,
      }}
    >
      {pageContent}
    </Box>
  ) : (
    <>{pageContent}</>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        overflow: "auto",
      }}
    >
      {/* Conditional Rendering based on viewport size */}
      {isDesktop ? (
        // DESKTOP VIEW: Content is placed inside the structured layout
        <DesktopLayout onMenuToggle={toggleSidebar}>
          {MainContent}
        </DesktopLayout>
      ) : (
        // MOBILE VIEW
        MainContent
      )}
    </div>
  );
};

export default StudyProgrammeDetailPage;
