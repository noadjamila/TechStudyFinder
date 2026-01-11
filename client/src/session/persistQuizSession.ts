import { QuizSession } from "../types/QuizSession";
import { openDB as indexedDbOpen } from "idb";

const DB_NAME = "studyfinder-quiz-session";
const DB_VERSION = 1;
const STORE_NAME = "sessions";
const KEY = "latest-session";

function openDb() {
  return indexedDbOpen(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveSession(session: QuizSession): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).put(session, KEY);
  await tx.done;
}

export async function loadLatestSession(): Promise<QuizSession | null> {
  const db = await openDb();
  return db.transaction(STORE_NAME).objectStore(STORE_NAME).get(KEY);
}
