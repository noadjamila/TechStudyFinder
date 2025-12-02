import Homescreen from "./pages/Home/Homescreen";
import { Routes, Route } from "react-router-dom";
import QuizFlow from "./pages/Quiz/QuizFlow";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homescreen />} />
      <Route path="/quiz/" element={<QuizFlow />} />
    </Routes>
  );
}
