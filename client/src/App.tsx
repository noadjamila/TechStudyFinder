/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import Homescreen from "./pages/Homescreen";
import { Routes, Route } from "react-router-dom";
import QuizFlow from "./pages/QuizFlow";
import ResultsPage from "./pages/ResultsPage";
import StudyProgrammeDetailPage from "./pages/StudyProgrammeDetailPage";
import Settings from "./pages/Settings";
import LoginxRegister from "./pages/LoginxRegister";
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
import Datenschutz from "./pages/Datenschutz";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homescreen />} />
      <Route path="/login-register" element={<LoginxRegister />} />
      <Route path="/quiz" element={<QuizFlow />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/favorites" element={<Favourites />} />
      <Route path="/impressum" element={<Impressum />} />
      <Route path="/datenschutz" element={<Datenschutz />} />
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
      <Route
        path="*"
        element={
          <ErrorScreen code={404} message="Diese Seite gibt es nicht!" />
        }
      />
    </Routes>
  );
}
