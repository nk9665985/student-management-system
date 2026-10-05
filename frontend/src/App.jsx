import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentsPage from "./pages/StudentsPage";
import SearchPage from "./pages/SearchPage";
import ProjectsPage from "./pages/ProjectsPage";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/students/:studentId/projects" element={<ProjectsPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/students" replace />} />
          <Route path="*" element={<Navigate to="/students" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
