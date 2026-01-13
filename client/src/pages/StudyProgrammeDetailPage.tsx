import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  Link,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaceIcon from "@mui/icons-material/Place";
import StarsIcon from "@mui/icons-material/Stars";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { StudyProgramme } from "../types/StudyProgramme.types";
import theme from "../theme/theme";
import DataSource from "../components/DataSource";
import BackButton from "../components/buttons/BackButton";
import DesktopLayout from "../layouts/DesktopLayout";
import { getStudyProgrammeById } from "../api/quizApi";
import { getFavorites, addFavorite, removeFavorite } from "../api/favoritesApi";
import DeadlineDisplay from "../components/DeadlineDisplay";
import { useAuth } from "../contexts/AuthContext";
import LoginReminderDialog, {
  FAVORITES_LOGIN_MESSAGE,
} from "../components/dialogs/LoginReminderDialog";

/**
 * StudyProgrammeDetailPage displays detailed information about a single study programme.
 * Receives the programme ID from the URL parameters.
 */
const StudyProgrammeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [programme, setProgramme] = useState<StudyProgramme | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginReminder, setShowLoginReminder] = useState(false);
  const muiTheme = useTheme();
  const toggleSidebar = () => {};
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("sm"));

  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Load favorite state from API
  useEffect(() => {
    const loadFavoriteState = async () => {
      if (!id) return;
      try {
        const favoriteIds = await getFavorites();
        setIsFavorite(favoriteIds.includes(id));
      } catch (error) {
        console.error("Failed to load favorites:", error);
      }
    };

    loadFavoriteState();
  }, [id]);

  // Fetch study programme data
  useEffect(() => {
    const fetchProgramme = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getStudyProgrammeById(id);
        setProgramme(data);
      } catch (err) {
        console.error("Error fetching study programme:", err);
        setError("Fehler beim Laden des Studiengangs");
      } finally {
        setLoading(false);
      }
    };

    fetchProgramme();
  }, [id]);

  const toggleFavorite = async () => {
    if (!id) return;

    // Check if user is logged in
    if (!user) {
      setShowLoginReminder(true);
      return;
    }

    const wasFavorited = isFavorite;
    setIsFavorite(!isFavorite);

    try {
      if (wasFavorited) {
        await removeFavorite(id);
      } else {
        await addFavorite(id);
      }
    } catch (error: any) {
      if (error.message && error.message.includes("409")) {
        setIsFavorite(true);
      } else {
        console.error("Error toggling favorite:", error);
        setIsFavorite(wasFavorited);
      }
    }
  };

  if (loading) {
    const loadingContent = (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography>Lädt...</Typography>
      </Box>
    );

    const LoadingContent = isDesktop ? (
      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          margin: "0 auto",
          pt: 3,
        }}
      >
        {loadingContent}
      </Box>
    ) : (
      loadingContent
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
            {LoadingContent}
          </DesktopLayout>
        ) : (
          LoadingContent
        )}
      </div>
    );
  }

  if (error || !programme) {
    const notFoundContent = (
      <>
        <Box sx={{ padding: 3 }}>
          <BackButton
            label="Zurück"
            onClick={() => {
              const previousPage = (location.state as any)?.previousPage;
              if (previousPage) {
                navigate(previousPage);
              } else {
                navigate(-1);
              }
            }}
            sx={{
              marginBottom: 2,
            }}
          />
        </Box>
        <Box sx={{ paddingTop: 3 }}>
          <DataSource />
        </Box>
        <Box sx={{ padding: 3, paddingTop: 0 }}>
          <Typography variant="h6">
            {error || "Studiengang nicht gefunden"}
          </Typography>
        </Box>
      </>
    );

    const NotFoundContent = isDesktop ? (
      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        {notFoundContent}
      </Box>
    ) : (
      notFoundContent
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
          pt: { xs: 6, sm: 1.5 }, // extra top padding for mobile to account for navbar
          px: 3,
          pb: { xs: 1, sm: 0 },
        }}
      >
        <BackButton
          label="Zurück"
          onClick={() => {
            const previousPage = (location.state as any)?.previousPage;
            if (previousPage) {
              navigate(previousPage);
            } else {
              navigate(-1);
            }
          }}
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

      <Box sx={{ pt: { xs: "80px", sm: 0 }, pl: "30px", pr: "30px" }}>
        {" "}
        {/* Offset for fixed back button on mobile */}
        <Box sx={{ paddingTop: 3 }}>
          <DataSource />
        </Box>
      </Box>

      {/* Study programme card */}
      <Box sx={{ px: 3, pt: 1 }}>
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
                      fontSize: { xs: "0.95rem", sm: "1.1rem" },
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
                      fontSize: { xs: "0.95rem", sm: "1.1rem" },
                    }}
                  >
                    {programme.abschluss}
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
                marginTop: { xs: 2, sm: 4 },
              }}
            >
              {/* Basic Information */}
              {((programme.studienform?.length ?? 0) > 0 ||
                programme.regelstudienzeit ||
                (programme.standorte?.length ?? 0) > 0 ||
                (programme.sprachen?.length ?? 0) > 0) && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      marginBottom: 2,
                      color: theme.palette.text.header,
                      fontSize: { xs: "1.1rem", sm: "1.5rem" },
                    }}
                  >
                    Allgemeine Informationen
                  </Typography>
                  {programme.studienform &&
                    programme.studienform.length > 0 && (
                      <Box sx={{ mb: 1.5 }}>
                        <Typography
                          component="span"
                          sx={{ fontWeight: 600, mr: 1 }}
                        >
                          Studienform:
                        </Typography>
                        <Typography component="span">
                          {programme.studienform.join(", ")}
                        </Typography>
                      </Box>
                    )}
                  {programme.regelstudienzeit && (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography
                        component="span"
                        sx={{ fontWeight: 600, mr: 1 }}
                      >
                        Regelstudienzeit:
                      </Typography>
                      <Typography component="span">
                        {programme.regelstudienzeit}
                      </Typography>
                    </Box>
                  )}
                  {programme.standorte && programme.standorte.length > 0 && (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography
                        component="span"
                        sx={{ fontWeight: 600, mr: 1 }}
                      >
                        Standorte:
                      </Typography>
                      <Typography component="span">
                        {programme.standorte.join(", ")}
                      </Typography>
                    </Box>
                  )}
                  {programme.sprachen && programme.sprachen.length > 0 && (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography
                        component="span"
                        sx={{ fontWeight: 600, mr: 1 }}
                      >
                        Sprachen:
                      </Typography>
                      <Typography component="span">
                        {programme.sprachen.join(", ")}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Schwerpunkte */}
              {programme.schwerpunkte && programme.schwerpunkte.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      marginBottom: 2,
                      color: theme.palette.text.header,
                      fontSize: "1.5rem",
                    }}
                  >
                    Schwerpunkte
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {programme.schwerpunkte.map((schwerpunkt, index) => (
                      <Chip
                        key={index}
                        label={schwerpunkt}
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          fontSize: "16px",
                          height: "auto",
                          "& .MuiChip-label": {
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            padding: "8px 12px",
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Studienfelder */}
              {programme.studienfelder &&
                programme.studienfelder.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        marginBottom: 2,
                        color: theme.palette.text.header,
                        fontSize: "1.5rem",
                      }}
                    >
                      Studienfelder
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {programme.studienfelder.map((feld, index) => (
                        <Chip
                          key={index}
                          label={feld}
                          sx={{
                            backgroundColor: `${theme.palette.secondary.main}80`,
                            fontSize: "16px",
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

              {/* Zulassung - Collapsible */}
              <Accordion
                sx={{
                  backgroundColor: `${theme.palette.primary.main}1A`,
                  mb: 2,
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                  },
                  "&.Mui-expanded": {
                    backgroundColor: `${theme.palette.primary.main}1A`,
                  },
                  "&.Mui-expanded:hover": {
                    backgroundColor: `${theme.palette.primary.main}1A`,
                  },
                  "&:before": {
                    display: "none",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="zulassung-content"
                  id="zulassung-header"
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.header,
                      fontSize: "1.5rem",
                    }}
                  >
                    Zulassung
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {programme.zulassungssemester && (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography
                        component="span"
                        sx={{ fontWeight: 600, mr: 1 }}
                      >
                        Zulassungssemester:
                      </Typography>
                      <Typography component="span">
                        {programme.zulassungssemester}
                      </Typography>
                    </Box>
                  )}
                  {programme.zulassungsmodus && (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography
                        component="span"
                        sx={{ fontWeight: 600, mr: 1 }}
                      >
                        Zulassungsmodus:
                      </Typography>
                      <Typography component="span">
                        {programme.zulassungsmodus}
                      </Typography>
                    </Box>
                  )}
                  {programme.zulassungsvoraussetzungen && (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography
                        component="span"
                        sx={{ fontWeight: 600, mr: 1 }}
                      >
                        Voraussetzungen:
                      </Typography>
                      <Typography component="span">
                        {programme.zulassungsvoraussetzungen}
                      </Typography>
                    </Box>
                  )}
                  {programme.zulassungslink && (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography
                        component="span"
                        sx={{ fontWeight: 600, mr: 1 }}
                      >
                        Weitere Informationen:
                      </Typography>
                      <Link
                        href={programme.zulassungslink}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: theme.palette.detailspage.link,
                          textDecorationColor: theme.palette.detailspage.link,
                        }}
                      >
                        Zulassungsseite
                      </Link>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>

              {/* Kosten - Collapsible */}
              {(programme.studienbeitrag || programme.beitrag_kommentar) && (
                <Accordion
                  sx={{
                    backgroundColor: `${theme.palette.primary.main}1A`,
                    mb: 2,
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                    },
                    "&.Mui-expanded": {
                      backgroundColor: `${theme.palette.primary.main}1A`,
                    },
                    "&.Mui-expanded:hover": {
                      backgroundColor: `${theme.palette.primary.main}1A`,
                    },
                    "&:before": {
                      display: "none",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="kosten-content"
                    id="kosten-header"
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.header,
                        fontSize: "1.5rem",
                      }}
                    >
                      Kosten
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {programme.studienbeitrag && (
                      <Box sx={{ mb: 1.5 }}>
                        <Typography
                          component="span"
                          sx={{ fontWeight: 600, mr: 1 }}
                        >
                          Studienbeitrag:
                        </Typography>
                        <Typography component="span">
                          {programme.studienbeitrag}
                        </Typography>
                      </Box>
                    )}
                    {programme.beitrag_kommentar && (
                      <Box sx={{ mb: 1.5 }}>
                        <Typography
                          component="span"
                          sx={{ fontWeight: 600, mr: 1 }}
                        >
                          Hinweis:
                        </Typography>
                        <Typography component="span">
                          {programme.beitrag_kommentar}
                        </Typography>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              )}

              {/* Fristen (Deadlines) - Collapsible */}
              {programme.fristen && programme.fristen.length > 0 && (
                <Accordion
                  sx={{
                    backgroundColor: `${theme.palette.primary.main}1A`,
                    mb: 2,
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                    },
                    "&.Mui-expanded": {
                      backgroundColor: `${theme.palette.primary.main}1A`,
                    },
                    "&.Mui-expanded:hover": {
                      backgroundColor: `${theme.palette.primary.main}1A`,
                    },
                    "&:before": {
                      display: "none",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="fristen-content"
                    id="fristen-header"
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.header,
                        fontSize: "1.5rem",
                      }}
                    >
                      Fristen
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <DeadlineDisplay fristen={programme.fristen} />
                  </AccordionDetails>
                </Accordion>
              )}

              {/* Anmerkungen */}
              {programme.anmerkungen && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      marginBottom: 2,
                      color: theme.palette.text.header,
                      fontSize: "1.5rem",
                    }}
                  >
                    Anmerkungen
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.primary,
                      lineHeight: 1.8,
                    }}
                  >
                    {programme.anmerkungen}
                  </Typography>
                </Box>
              )}

              {/* Homepage Link */}
              {programme.homepage && (
                <Box sx={{ mt: 3 }}>
                  <Link
                    href={programme.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      fontSize: "1.1rem",
                      fontWeight: 500,
                      color: theme.palette.detailspage.link,
                      textDecorationColor: theme.palette.detailspage.link,
                    }}
                  >
                    Zur Studiengangs-Homepage →
                  </Link>
                </Box>
              )}
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

      {/* Login reminder dialog for not logged in users trying to add favorites */}
      <LoginReminderDialog
        open={showLoginReminder}
        onClose={() => setShowLoginReminder(false)}
        message={FAVORITES_LOGIN_MESSAGE}
        onLoginClick={() => {
          const previousPage = (location.state as any)?.previousPage;
          navigate("/login", {
            state: {
              redirectTo: location.pathname,
              previousPage: previousPage,
            },
          });
        }}
      />
    </div>
  );
};

export default StudyProgrammeDetailPage;
