import React from "react";
import styles from "./ErrorScreen.module.css";
import { useNavigate } from "react-router-dom";

/**
 * Props for {@link ErrorScreen}
 * Allows parent-components the interaction and modification of this component.
 */
export interface ErrorScreenProps {
  /**
   * Title for the error screen.
   */
  title: string;

  /**
   * Message for the error screen.
   */
  message: string;
}

/**
 * This component displays an error screen with a title, message and a
 * button that leads you back to the homescreen.
 *
 * @param props - Props of the component.
 * @returns {JSX.Element} An error screen.
 */
const ErrorScreen: React.FC<ErrorScreenProps> = ({ title, message }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.errorScreen}>
      <h2>{title}</h2>
      <p>{message}</p>

      <button onClick={() => navigate("/")}>Zurück zur Startseite</button>
    </div>
  );
};

export default ErrorScreen;
