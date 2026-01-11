import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { QuizSession } from "../../types/QuizSession";
import { loadLatestSession, saveSession } from "../persistQuizSession";

const store = vi.hoisted(() => new Map<string, QuizSession>());

const openDbMock = vi.hoisted(() =>
  vi.fn(async () => ({
    transaction: () => ({
      objectStore: () => ({
        put: (value: QuizSession, key: string) => {
          store.set(key, value);
        },
        get: (key: string) => Promise.resolve(store.get(key) ?? null),
      }),
      done: Promise.resolve(),
    }),
  })),
);

vi.mock("idb", () => ({
  openDB: openDbMock,
}));

describe("persistQuizSession", () => {
  const originalIndexedDb = globalThis.indexedDB;

  beforeEach(() => {
    store.clear();
    globalThis.indexedDB = {} as IDBFactory;
  });

  afterEach(() => {
    globalThis.indexedDB = originalIndexedDb;
  });

  it("saves and loads the latest session", async () => {
    const session: QuizSession = {
      sessionId: "session-1",
      currentLevel: 2,
      currentQuestionIndex: 1,
      answers: {
        "q-1": { questionId: "q-1", value: "yes", answeredAt: 1 },
      },
      level2Questions: [],
      startedAt: 1,
      updatedAt: 2,
    };

    await saveSession(session);
    const loaded = await loadLatestSession();

    expect(loaded).toEqual(session);
  });

  it("returns null when no session is stored", async () => {
    const loaded = await loadLatestSession();
    expect(loaded).toBeNull();
  });

  it("rejects when IndexedDB is not available", async () => {
    globalThis.indexedDB = undefined as unknown as IDBFactory;
    await expect(loadLatestSession()).rejects.toThrow(
      "IndexedDB is not supported in this environment.",
    );
  });
});
