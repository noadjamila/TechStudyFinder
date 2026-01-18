import Homescreen from "./pages/Homescreen";
import { Routes, Route } from "react-router-dom";
import QuizFlow from "./pages/QuizFlow";
import ResultsPage from "./pages/ResultsPage";
import StudyProgrammeDetailPage from "./pages/StudyProgrammeDetailPage";
import Settings from "./pages/Settings";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Favourites from "./pages/Favourites";
import ProtectedRoute from "./components/ProtectedRoute";
import { ErrorScreen } from "./pages/ErrorScreen";
import Impressum from "./pages/Impressum";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homescreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/quiz" element={<QuizFlow />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/favorites" element={<Favourites />} />
      <Route path="/impressum" element={<Impressum />} />
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
      <Route path="/error" element={<ErrorScreen />} />
      <Route
        path="*"
        element={
          <ErrorScreen code={404} message="Diese Seite gibt es nicht!" />
        }
      />
    </Routes>
  );
}
