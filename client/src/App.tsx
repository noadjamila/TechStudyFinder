import Homescreen from "./pages/Home/Homescreen";
import { Routes, Route } from "react-router-dom";
import QuizFlow from "./pages/Quiz/QuizFlow";
import ResultsPage from "./pages/ResultsPage";
import StudyProgrammeDetailPage from "./pages/StudyProgrammeDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homescreen />} />
      <Route path="/quiz/level/:level" element={<QuizFlow />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route
        path="/study-programme/:id"
        element={<StudyProgrammeDetailPage />}
      />
    </Routes>
  );
}
