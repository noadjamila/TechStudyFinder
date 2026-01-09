import Homescreen from "./pages/Homescreen";
import { Routes, Route } from "react-router-dom";
import QuizFlow from "./pages/QuizFlow";
import ResultsPage from "./pages/ResultsPage";
import StudyProgrammeDetailPage from "./pages/StudyProgrammeDetailPage";
import Settings from "./pages/Settings";
import Register from "./pages/Register";
import Login from "./pages/Login/Login";
import Favourites from "./pages/Favourites/FavouritesContainer";
import ProtectedRoute from "./components/ProtectedRoute";
import NavigationGuard from "./components/NavigationGuard";

export default function App() {
  return (
    <NavigationGuard>
      <Routes>
        <Route path="/" element={<Homescreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quiz" element={<QuizFlow />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/favorites" element={<Favourites />} />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study-programme/:id"
          element={<StudyProgrammeDetailPage />}
        />
      </Routes>
    </NavigationGuard>
  );
}
