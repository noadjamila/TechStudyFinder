//import { openDB } from "idb";
import { StudyProgramme } from "../types/StudyProgramme.types";
import { openDB as indexedDbOpen } from "idb";

const DB_NAME = "quiz-results-db";
const DB_VERSION = 1;
const STORE_NAME = "results";

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

export async function saveQuizResults(
  results: StudyProgramme[],
): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.store.put(results, "latest");
  await tx.done;
}

export async function loadQuizResults(): Promise<StudyProgramme[] | null> {
  const db = await openDb();
  return (await db.get(STORE_NAME, "latest")) ?? null;
}

export async function clearQuizResults(): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.store.clear();
  await tx.done;
}
