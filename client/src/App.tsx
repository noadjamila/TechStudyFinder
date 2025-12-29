import Homescreen from "./pages/Home/Homescreen";
import { Routes, Route } from "react-router-dom";
import QuizFlow from "./pages/Quiz/QuizFlow";
import ResultsPage from "./pages/ResultsPage";
import StudyProgrammeDetailPage from "./pages/StudyProgrammeDetailPage";
import LevelSuccessScreen from "./components/quiz/level-success/LevelSuccessScreen";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Favorites from "./pages/Favorites/Favorites";
import FavouritesNotLoggedIn from "./pages/Favorites/FavouritesNotLoggedIn";
import FavouritesEmpty from "./pages/Favorites/FavouritesEmpty";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homescreen />} />
      <Route path="/home" element={<Homescreen />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/quiz/level/:level" element={<QuizFlow />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route
        path="/study-programme/:id"
        element={<StudyProgrammeDetailPage />}
      />
      <Route
        path="/level-success/1"
        element={<LevelSuccessScreen currentLevel={1} />}
      />
      <Route
        path="/level-success/2"
        element={<LevelSuccessScreen currentLevel={2} />}
      />
      <Route
        path="/level-success/3"
        element={<LevelSuccessScreen currentLevel={3} />}
      />
      <Route
        path="/level-success/4"
        element={<LevelSuccessScreen currentLevel={4} />}
      />
      <Route path="/favorites" element={<Favorites />} />
      <Route
        path="/favorites-not-logged-in"
        element={<FavouritesNotLoggedIn />}
      />
      <Route path="/favorites-empty" element={<FavouritesEmpty />} />
    </Routes>
  );
}
