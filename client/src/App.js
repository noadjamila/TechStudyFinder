import "./App.css";
import { useState, useEffect } from "react";
import './App.css';

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend Response:", data);
        setMsg(data.message);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
          <img src="/logo.png" className="App-logo" alt="logo" />
          <h1>Tech Study Finder</h1>
          <p>Finde den Studiengang, der zu dir passt!</p>
          <p>{msg}</p>
          <button className="btn-primary">Quiz starten</button>
          <a href="https://reactjs.org/" className="btn-link" target="_blank" rel="noopener noreferrer">Erkunde React</a>
        <div>
          <h1>Backend test message:</h1>
          <p>{msg}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
