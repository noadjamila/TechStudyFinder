import { QuizSession } from "../types/QuizSession";

const DB_NAME = "studyfinder-quiz-session";
const DB_VERSION = 1;
const STORE_NAME = "sessions";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "sessionId" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveSession(session: QuizSession): Promise<void> {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(session);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadLatestSession(): Promise<QuizSession | null> {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const sessions = request.result as QuizSession[];
      if (sessions.length === 0) {
        resolve(null);
      } else {
        resolve(sessions.sort((a, b) => b.updatedAt - a.updatedAt)[0]);
      }
    };

    request.onerror = () => reject(request.error);
  });
}
