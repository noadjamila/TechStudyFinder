import React, { useState } from "react";
import { StudyProgramme } from "../../types/StudyProgramme.types";
import StudyProgrammeList from "../cards/StudyProgrammeList";

interface ResultsProps {
  studyProgrammes: StudyProgramme[];
}

/**
 * Results component displays filtered study programmes from quiz results.
 * Uses the reusable StudyProgrammeList base component with quiz results headline.
 *
 * @component
 * @param {ResultsProps} props - Component props
 * @returns {React.ReactElement} The results component
 */
const Results: React.FC<ResultsProps> = ({ studyProgrammes }) => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

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

  return (
    <StudyProgrammeList
      studyProgrammes={studyProgrammes}
      headline="Meine Ergebnisse"
      onToggleFavorite={toggleFavorite}
      favorites={favorites}
    />
  );
};

export default Results;
