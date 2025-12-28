import Homescreen from "./pages/Home/Homescreen";
import { Routes, Route } from "react-router-dom";
import QuizFlow from "./pages/QuizFlow";
import ResultsPage from "./pages/ResultsPage";
import StudyProgrammeDetailPage from "./pages/StudyProgrammeDetailPage";
import LevelSuccessScreen from "./components/quiz/LevelSuccessScreen";
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
      <Route path="/quiz" element={<QuizFlow />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route
        path="/study-programme/:id"
        element={<StudyProgrammeDetailPage />}
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
