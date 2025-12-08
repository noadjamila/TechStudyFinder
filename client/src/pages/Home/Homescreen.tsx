import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import StartButton from "../../components/buttons/Button";
import "./Homescreen.css";
import { useNavigate } from "react-router-dom";
import CardStack from "../../../src/components/quiz/CardStack";
import theme from "../../theme/theme";
import mascotImage from "../../assets/Männchen_Home_Level1.png";
import LogoMenu from "../../components/logo-menu/LogoMenu";
import Navigationbar from "../../components/nav-bar/NavBar";
import DesktopLayout from "../../layouts/DesktopLayout";

const Homescreen: React.FC = () => {
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("sm"));
  const handleQuizStart = () => {
    navigate("/quiz/level/1");
  };

  const mainTitle = "Finde dein Studium";
  const subTitle = "Du weißt nicht, was du studieren möchtest?";
  const infoText1 = "Kein Problem!";
  const infoText2 =
    "Tech Study Finder unterstützt dich dabei, Studiengänge zu finden, die zu deinen persönlichen Interessen passen.";
  const cardQuestion = "Bist du bereit, dich auf die Reise zu begeben?";

  const MainContent = (
    <Box
      className="page-content-wrapper"
      sx={{
        maxWidth: { xs: "90%", sm: "600px", md: "700px" },
        mx: "auto",
        px: { xs: 1, sm: 0 },
        textAlign: "center",
        mt: 4,
        position: "relative",
        color: theme.palette.text.primary,
      }}
    >
      <Typography
        className="title"
        sx={{
          fontWeight: "bold",
          fontSize: "1.8rem",
          mb: 2,
        }}
      >
        {mainTitle}
      </Typography>

      <Typography
        variant="body1"
        className="subtitle"
        sx={{ fontWeight: "bold", lineHeight: 1.3, mb: 3 }}
      >
        {subTitle}
      </Typography>

      {/*box for the info texts*/}
      <Box className="info-text" sx={{ mt: 2, mb: 6 }}>
        <Typography
          variant="body1"
          sx={{ px: { xs: 2, sm: 1, lineHeight: 1.3 } }}
        >
          {infoText1}
          <br />
          {infoText2}
        </Typography>
      </Box>

      {/*card box*/}
      <CardStack currentIndex={1} totalCards={1}>
        <Box
          sx={{
            p: 6,
            backgroundColor: theme.palette.decorative.green,
            borderRadius: 2,
            boxShadow: 3,
            mt: 13,
            mx: "auto",
            px: { sm: 1 },
            position: "relative",
          }}
        >
          <Box
            component="img"
            src={mascotImage}
            alt="Maskottchen"
            sx={{
              position: "absolute",
              width: { xs: 40, sm: 60 },
              height: "auto",
              top: {
                xs: -60,
                sm: -85,
              },
              right: { xs: 20, sm: 30 },
            }}
          />

          <Typography
            variant="subtitle1"
            sx={{
              mb: 3,
              lineHeight: 1.3,
            }}
          >
            {cardQuestion}
          </Typography>

          <StartButton
            label="Quiz beginnen"
            onClick={handleQuizStart}
            sx={{
              borderRadius: 3.5,
              padding: "12px 20px",
              fontSize: "1.1rem",
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
  );

  return (
    <div className="homescreen-container">
      {isDesktop ? (
        // DESKTOP: Umschließe den Hauptinhalt mit dem DesktopLayout
        <DesktopLayout>{MainContent}</DesktopLayout>
      ) : (
        // MOBIL: LogoMenu und Navigationbar als separate Elemente, gefolgt vom Inhalt
        <>
          <LogoMenu />
          <Navigationbar />
          {MainContent} {/* Der Inhalt wird direkt darunter gerendert */}
        </>
      )}
    </div>
  );
};

export default Homescreen;
