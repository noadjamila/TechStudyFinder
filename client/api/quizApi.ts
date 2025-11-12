// fetch('/level1', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify([
//     new Number(3)
//   ])
// });

document.getElementById("submitBtn")?.addEventListener("click", async () => {
  try {
    // Beispiel-Antworten aus Level 1
    const answers = [{ Abschluss: "Bachelor" }];

    // POST Request ans Backend
    const response = await fetch("http://localhost:5001/level1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    });

    // Backend-Antwort als JSON auslesen
    const data = await response.json();

    // In der Konsole anzeigen
    console.log("Antwort vom Backend:", data);

    // Auch im Frontend anzeigen
    const responseEl = document.getElementById("response");
    if (responseEl) {
      responseEl.textContent = JSON.stringify(data, null, 2);
    }

  } catch (err) {
    console.error("Fehler beim Senden:", err);
  }
});