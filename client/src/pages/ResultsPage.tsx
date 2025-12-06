import React from "react";
import Results from "../components/quiz/Results";
import DataSource from "../components/DataSource";
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
  ]; // Replace with actual data retrieval logic

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        overflow: "auto",
      }}
    >
      <DataSource />
      <Results studyProgrammes={studyProgrammes} />
    </div>
  );
};

export default ResultsPage;
