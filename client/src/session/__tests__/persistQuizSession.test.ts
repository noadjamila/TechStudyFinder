import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { QuizSession } from "../../types/QuizSession";

const dbState = vi.hoisted(() => ({
  value: null as QuizSession | null,
}));

const openDbMock = vi.hoisted(() =>
  vi.fn(async () => ({
    transaction: () => ({
      objectStore: () => ({
        put: (value: QuizSession) => {
          dbState.value = value;
        },
        get: () => Promise.resolve(dbState.value),
      }),
      done: Promise.resolve(),
    }),
  })),
);

vi.mock("idb", () => ({
  openDB: openDbMock,
}));

let loadLatestSession: () => Promise<QuizSession | null>;
let saveSession: (session: QuizSession) => Promise<void>;

describe("persistQuizSession", () => {
  const originalIndexedDb = globalThis.indexedDB;

  beforeEach(async () => {
    dbState.value = null;
    globalThis.indexedDB = {} as IDBFactory;
    vi.resetModules();
    const module = await import("../persistQuizSession");
    loadLatestSession = module.loadLatestSession;
    saveSession = module.saveSession;
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
