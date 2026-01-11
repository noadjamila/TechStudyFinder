import { QuizSession } from "../types/QuizSession";
import { openDB as indexedDbOpen } from "idb";

const DB_NAME = "studyfinder-quiz-session";
const DB_VERSION = 1;
const STORE_NAME = "sessions";
const KEY = "latest-session";

/**
 * Opens the IndexedDB database, creating it if it doesn't exist.
 * @return {Promise<IDBPDatabase>} A promise that resolves to the opened database.
 */
function openDb() {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(
      new Error("IndexedDB is not supported in this environment."),
    );
  }

  return indexedDbOpen(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

/**
 * Saves the current quiz session to IndexedDB.
 * @param session
 * @return {Promise<void>} A promise that resolves when the session is saved.
 */
export async function saveSession(session: QuizSession): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).put(session, KEY);
  await tx.done;
}

/**
 * Loads the latest quiz session from IndexedDB.
 * @return {Promise<QuizSession | null>} A promise that resolves to the loaded session or null if not found.
 */
export async function loadLatestSession(): Promise<QuizSession | null> {
  const db = await openDb();
  return db.transaction(STORE_NAME).objectStore(STORE_NAME).get(KEY);
}
