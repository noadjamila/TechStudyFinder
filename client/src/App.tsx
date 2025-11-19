import React from "react";
import QuizPage from "./pages/QuizPage";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/theme";
import Homescreen from "./pages/Homescreen";

const App: React.FC = () => <QuizPage />;

export default App;
      <div>
        <Homescreen /> {/* Display the Home Screen component here */}
      </div>
    </ThemeProvider>
  );
}
