import React from "react";
import Results from "../components/quiz/Results";
import { StudyProgramme } from "../types/StudyProgramme.types";

const ResultsPage: React.FC = () => {
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
  ]; // Replace with actual data retrieval logic

  return <Results studyProgrammes={studyProgrammes} />;
};

export default ResultsPage;
