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
import AdminPage from "./pages/admin/AdminDashboard";
import AdminUpload from "./pages/admin/AdminUpload";
import AdminInstructions from "./pages/admin/AdminInstructions";
import AdminEdit from "./pages/admin/AdminEdit";

export default function App() {
  return (
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
      <Route path="/admin/*" element={<AdminPage />} />
      <Route path="/admin/upload" element={<AdminUpload />} />
      <Route path="/admin/instructions" element={<AdminInstructions />} />
      <Route path="/admin/edit" element={<AdminEdit />} />
    </Routes>
  );
}
