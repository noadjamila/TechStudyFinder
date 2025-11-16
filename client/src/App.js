import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => {
        setMsg(data.message);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>Backend test message:</h1>
          <p>{msg}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
