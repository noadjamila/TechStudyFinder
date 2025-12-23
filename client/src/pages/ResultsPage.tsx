import React from "react";
import { useMediaQuery, useTheme, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import Results from "../components/quiz/Results";
import DataSource from "../components/DataSource";
import { StudyProgramme } from "../types/StudyProgramme.types";
import { RiasecType } from "../types/RiasecTypes";
import LogoMenu from "../components/logo-menu/LogoMenu";
import Navigationbar from "../components/nav-bar/NavBar";
import DesktopLayout from "../layouts/DesktopLayout";

const ResultsPage: React.FC = () => {
  const muiTheme = useTheme();
  const toggleSidebar = () => {};
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("sm"));
  const location = useLocation();

  // Access RIASEC scores passed from QuizPage_L2 via navigation state
  const riasecScores = location.state?.riasecScores as
    | { type: RiasecType; score: number }[]
    | undefined;

  console.log("Received RIASEC scores:", riasecScores);

  const studyProgrammes: StudyProgramme[] = [
    {
      id: 1,
      name: "Communication Systems and Networks",
      hochschule: "Technische Universität Berlin",
      abschluss: "Master of Science",
      homepage:
        "https://www.tu.berlin/en/studying/study-programs/all-study-programs/communication-systems-and-networks-msc/",
      studienbeitrag: "300 EUR per semester",
      beitrag_kommentar: "Includes semester ticket for public transport",
      anmerkungen: "Focus on modern communication technologies",
      regelstudienzeit: "4 semesters",
      zulassungssemester: "Winter semester",
      zulassungsmodus: "Direct admission",
      zulassungsvoraussetzungen:
        "Bachelor's degree in related field, proof of English proficiency",
      zulassungslink:
        "https://www.tu.berlin/en/studying/application-admission/online-application/",
      schwerpunkte: ["Wireless Communications", "Network Security", "IoT"],
      sprachen: ["English", "German"],
      standorte: ["Berlin"],
      studienfelder: ["Engineering", "Computer Science"],
      studienform: "Full-time",
    },
    {
      id: 2,
      name: "Betriebliche Umweltinformatik",
      hochschule: "Hochschule für Technik und Wirtschaft Berlin",
      abschluss: "Bachelor of Engineering",
      homepage:
        "https://www.htw-berlin.de/studium/studienangebot/betriebliche-umweltinformatik-b-eng/",
      studienbeitrag: "300 EUR per semester",
      beitrag_kommentar: "Includes semester ticket for public transport",
      anmerkungen: "Combination of environmental science and IT",
      regelstudienzeit: "7 semesters",
      zulassungssemester: "Winter semester",
      zulassungsmodus: "Direct admission",
      zulassungsvoraussetzungen:
        "General university entrance qualification, proof of German proficiency",
      zulassungslink:
        "https://www.htw-berlin.de/studium/bewerbung-und-zulassung/bewerbung/",
      schwerpunkte: [
        "Environmental Data Management",
        "Sustainability Reporting",
      ],
      sprachen: ["German"],
      standorte: ["Berlin"],
      studienfelder: ["Environmental Science", "Information Technology"],
      studienform: "Full-time",
    },
    {
      id: 3,
      name: "Informatik",
      hochschule: "Rheinische Friedrich-Wilhelms-Universität Bonn",
      abschluss: "Bachelor of Science",
      homepage:
        "https://www.uni-bonn.de/en/study/study-programs/all-study-programs/informatics-bsc",
      studienbeitrag: "300 EUR per semester",
      beitrag_kommentar: "Includes semester ticket for public transport",
      anmerkungen: "Strong theoretical foundation",
      regelstudienzeit: "6 semesters",
      zulassungssemester: "Winter semester",
      zulassungsmodus: "Direct admission",
      zulassungsvoraussetzungen:
        "General university entrance qualification, proof of German proficiency",
      zulassungslink:
        "https://www.uni-bonn.de/en/study/application-admission/online-application/",
      schwerpunkte: [
        "Algorithms",
        "Software Engineering",
        "Artificial Intelligence",
      ],
      sprachen: ["German", "English"],
      standorte: ["Bonn"],
      studienfelder: ["Computer Science"],
      studienform: "Full-time",
    },
  ]; // Replace with actual data retrieval logic

  const MainContent = isDesktop ? (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <DataSource />
      <Results studyProgrammes={studyProgrammes} />
    </Box>
  ) : (
    <Box sx={{ pt: "50px" }}>
      {" "}
      {/* Offset for mobile navbar */}
      <DataSource />
      <Results studyProgrammes={studyProgrammes} />
    </Box>
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
        // MOBILE VIEW: Logo menu and navigation bar are rendered outside the main content flow
        <>
          <LogoMenu fixed={true} />
          <Navigationbar />
          {MainContent}
        </>
      )}
    </div>
  );
};

export default ResultsPage;
