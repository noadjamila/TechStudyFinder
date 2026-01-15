import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginReminderDialog from "./dialogs/LoginReminderDialog";

interface LoginCheckpointProps {
  children: React.ReactNode;
  requiresCheckpoint?: boolean;
}

/**
 * LoginCheckpoint component shows a login reminder dialog INSTEAD of the page content
 * when user navigates from /results without being logged in.
 * Once the dialog is dismissed or user logs in, the actual page content is shown.
 */
const LoginCheckpoint: React.FC<LoginCheckpointProps> = ({
  children,
  requiresCheckpoint = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showCheckpoint, setShowCheckpoint] = useState(false);

  const hasQuizResults =
    localStorage.getItem("quizResults") !== null ||
    localStorage.getItem("quizCompleted") === "true";

  const comingFromResults =
    location.state?.from === "/results" ||
    sessionStorage.getItem("lastPath") === "/results";

  useEffect(() => {
    // Check if we should show the checkpoint dialog
    if (requiresCheckpoint && !user && hasQuizResults && comingFromResults) {
      setShowCheckpoint(true);
    }

    // Store current path for next navigation
    sessionStorage.setItem("lastPath", location.pathname);
  }, [
    requiresCheckpoint,
    user,
    hasQuizResults,
    comingFromResults,
    location.pathname,
  ]);

  const handleProceed = () => {
    // Navigate back to results instead of proceeding
    navigate("/results");
    sessionStorage.removeItem("lastPath");
  };

  const handleLoginClick = () => {
    const intendedDestination = location.pathname;
    navigate("/login", {
      state: { redirectTo: intendedDestination },
    });
  };

  // If checkpoint should be shown, render ONLY the dialog
  if (showCheckpoint) {
    return (
      <LoginReminderDialog
        open={true}
        onClose={handleProceed}
        onLoginClick={handleLoginClick}
        message={
          <>
            Beachte: <br />
            <strong>Du bist nicht eingeloggt.</strong>
            <br />
            Deine Ergebnisse können nicht gespeichert werden.
            <br />
            Wenn du deine Ergebnisse auch später noch sehen willst, logge dich
            jetzt ein.
          </>
        }
      />
    );
  }

  // Otherwise, render the actual page content
  return <>{children}</>;
};

export default LoginCheckpoint;
