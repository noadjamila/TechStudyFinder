import { StudyProgramme } from "../types/StudyProgramme.types";
import { openDB as indexedDbOpen } from "idb";

const DB_NAME = "quiz-results-db";
const DB_VERSION = 1;
const STORE_NAME = "results";

/**
 * Opens a connection to an IndexedDB database with the specified name and version.
 * If the database does not exist or requires an upgrade, the provided upgrade function is executed.
 * @return {Promise<IDBDatabase>} A promise that resolves with the opened IDBDatabase instance or rejects if IndexedDB is not supported or if an error occurs during the connection process.
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
 * Saves quiz results into the database.
 *
 * @param {StudyProgramme[]} results - An array of results to be saved in the database.
 * @return {Promise<void>} A promise that resolves once the quiz results have been successfully saved.
 */
export async function saveQuizResults(
  results: StudyProgramme[],
): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.store.put(results, "latest-results");
  await tx.done;
}

/**
 * Loads the latest quiz results from the database.
 *
 * @return {Promise<StudyProgramme[] | null>} A promise that resolves to an array of StudyProgramme objects if data is available, or null if no data is found.
 */
export async function loadQuizResults(): Promise<StudyProgramme[] | null> {
  const db = await openDb();
  return (await db.get(STORE_NAME, "latest-results")) ?? null;
}

/**
 * Clears all quiz results from the storage by removing all entries in the specified data store.
 * This method interacts with a database in a read-write transaction to perform the clearing operation.
 *
 * @return {Promise<void>} A promise that resolves when the operation is successfully completed.
 */
export async function clearQuizResults(): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.store.clear();
  await tx.done;
}
