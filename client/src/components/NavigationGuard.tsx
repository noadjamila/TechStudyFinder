import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginReminderResultList from "./dialogs/LoginReminderResultList";

/**
 * NavigationGuard shows a reminder dialog when user tries to leave
 * Results page without being logged in.
 */
export default function NavigationGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showDialog, setShowDialog] = useState(false);
  const [intendedDestination, setIntendedDestination] = useState<string | null>(
    null,
  );
  const previousPathRef = useRef<string>(location.pathname);
  const allowNavigationRef = useRef<boolean>(false);

  const hasQuizResults =
    localStorage.getItem("quizResults") !== null ||
    localStorage.getItem("quizCompleted") === "true";

  useEffect(() => {
    console.log(
      "[NavigationGuard] Effect running - location:",
      location.pathname,
      "allowNav:",
      allowNavigationRef.current,
    );

    if (allowNavigationRef.current) {
      console.log(
        "[NavigationGuard] Navigation allowed, updating previousPath",
      );
      previousPathRef.current = location.pathname;
      allowNavigationRef.current = false;
      return;
    }

    const wasOnResults = previousPathRef.current === "/results";
    const isNowOnResults = location.pathname === "/results";
    const isLeavingResults = wasOnResults && !isNowOnResults;
    const isGoingToDetailView =
      location.pathname.startsWith("/study-programme/");
    const isGoingToAuth =
      location.pathname === "/login" || location.pathname === "/register";

    if (
      !user &&
      hasQuizResults &&
      isLeavingResults &&
      !isGoingToDetailView &&
      !isGoingToAuth
    ) {
      console.log(
        "[NavigationGuard] BLOCKING - Storing destination:",
        location.pathname,
      );

      setIntendedDestination(location.pathname);
      setShowDialog(true);
      return;
    }

    previousPathRef.current = location.pathname;
  }, [location.pathname, user, hasQuizResults]);

  // Handle closing the dialog - allow navigation to intended destination
  const handleDialogClose = () => {
    console.log(
      "[NavigationGuard] Close clicked - navigating to:",
      intendedDestination,
    );
    if (!intendedDestination) return;

    const destination = intendedDestination;

    // Set flag to allow next navigation BEFORE any state updates or navigation
    allowNavigationRef.current = true;
    setShowDialog(false);
    setIntendedDestination(null);
    navigate(destination);
  };

  // Handle login button - go to login page
  const handleLoginClick = () => {
    console.log("[NavigationGuard] Login clicked");
    const destination = intendedDestination || "/results";

    // Set flag to allow next navigation BEFORE any state updates or navigation
    allowNavigationRef.current = true;

    setShowDialog(false);
    setIntendedDestination(null);
    navigate("/login", {
      state: { redirectTo: destination },
    });
  };

  return (
    <>
      {/* Only render the new route if dialog is not blocking */}
      {!showDialog && children}

      {/* If dialog is shown, keep rendering the results page content */}
      {showDialog && <div style={{ position: "relative" }}>{children}</div>}

      {/* Reminder dialog */}
      <LoginReminderResultList
        open={showDialog}
        onClose={handleDialogClose}
        onLoginClick={handleLoginClick}
      />
    </>
  );
}
