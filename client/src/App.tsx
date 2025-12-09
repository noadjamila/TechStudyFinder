import Homescreen from "./pages/Home/Homescreen";
import { Routes, Route } from "react-router-dom";
import QuizFlow from "./pages/Quiz/QuizFlow";
import ResultsPage from "./pages/ResultsPage";
import LevelSuccessScreen from "./components/quiz/level-success/LevelSuccessScreen";
import { useParams } from "react-router-dom";

type Level = 1 | 2 | 3;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homescreen />} />
      <Route path="/quiz/level/:level" element={<QuizFlow />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route
        path="/level-1"
        element={<LevelSuccessScreen currentLevel={1} />}
      />
      <Route
        path="/level-success/:level"
        element={<LevelSuccessScreenWithParams />}
      />
    </Routes>
  );
}

const LevelSuccessScreenWithParams = () => {
  const { level } = useParams();
  const currentLevel = parseInt(level || "1", 10) as Level;
  return <LevelSuccessScreen currentLevel={currentLevel} />;
};
