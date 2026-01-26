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
import AdminLogin from "./pages/admin/AdminLogin";
import AdminPage from "./pages/admin/AdminDashboard";
import AdminUpload from "./pages/admin/AdminUpload";
import AdminInstructions from "./pages/admin/AdminInstructions";
import AdminEdit from "./pages/admin/AdminEdit";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
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

      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminPage />
          </AdminProtectedRoute>
        }
      />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/upload"
        element={
          <AdminProtectedRoute>
            <AdminUpload />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/instructions"
        element={
          <AdminProtectedRoute>
            <AdminInstructions />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/edit"
        element={
          <AdminProtectedRoute>
            <AdminEdit />
          </AdminProtectedRoute>
        }
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
