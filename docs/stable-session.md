# Stable Session (IndexedDB)
## Purpose
The Stable Quiz Session ensures that a
user’s quiz progress (answers, levels, fetched questions, and UI state)
persists across page reloads, tab closures, and browser restarts.

The full QuizSession state is stored in IndexedDB and automatically restored when the application starts

---
## Overview
- **Source of Truth:** QuizSession
- **Persistence Layer:** IndexedDB (via idb)
- **Storage Strategy:** Single-session pattern (fixed key)
- **Hydration:** Session is loaded on app startup
- **Reset:** Session can be explicitly cleared and re-initialized

---

## Data Model: `Quizsession`
```
export type QuizSession = {
sessionId: string;

currentLevel: 1 | 2 | 3;
currentQuestionIndex: number;

level1IDS?: string[];
resultIds?: string[];

showSuccessScreen?: boolean;

answers: AnswerMap;

level2Questions?: {
id: string;
text: string;
riasec_type: RiasecType;
}[];

startedAt: number;
updatedAt: number;

userId?: string;
};
```
### Key Fields

- `answers` – all user answers (persisted after every mutation)
- `level1IDS` - cached filtered IDs from the first level, used to further filter studyprogrammes in level two
- `level2Questions` – cached questions to avoid refetching after reload
- `showSuccessScreen` – persisted UI state to prevent incorrect navigation
- `resultIDS`- the IDs of the final studyprogrammes to be sent to the results page
---

## Data Model: `createQuizsession`
```
export function createQuizSession(): QuizSession {
  return {
    sessionId: crypto.randomUUID(),
    level1IDS: [],
    resultIds: [],
    currentLevel: 1,
    currentQuestionIndex: 0,
    showSuccessScreen: true,
    answers: {},
    level2Questions: [],
    startedAt: Date.now(),
    updatedAt: Date.now(),
  };
}
```
### Purpose
- Used when no persisted session exists
- Used after a manual reset / “Quiz Neustarten”

---
## IndexedDb Design (Quizsession)
**File:** `persistQuizSession.ts`

| Property      | Value                      |
| ------------- | -------------------------- |
| Database Name | `studyfinder-quiz-session` |
| Version       | `1`                        |
| Object Store  | `sessions`                 |
| Key           | `"latest-session"`         |

### Single-Session Pattern
Only one active quiz session exists at any time.
This simplifies persistence logic and debugging.

---
## Persistence API
`saveSession(session: QuizSession)`

Persists the current quiz session to IndexedDB.

### When is it called?
- After selecting an answer
- After completing a level
- After any session-relevant UI state change

```
await saveSession(currentSession);
```
---
`loadLatestSession()`

Loads the latest persisted quiz session from IndexedDB.

```
const session = await loadLatestSession();
```
### Returns:
- QuizSession → session is restored
- null → a new session is created via createQuizSession()
---
`clearQuizSession()`

Deletes all quiz session data from IndexedDB.

### Used for:

- “Quiz Neustarten” if a user saved their progress
- Explicit quiz cancellation during a level

```
await clearQuizSession();
```
---
## Session Lifecycle & Flows
### App Startup (Hydration)

1. Session provider mounts
2. loadLatestSession() is called
3. If a session exists → setSession(loaded)
4. Otherwise → setSession(createQuizSession())

### Selecting an Answer
1. User selects an option
2. handleAnswer(answer) is executed
3. sessionRef.current and React state are updated
4. setSession(next) saves the change to the session

### Level Completion
1. currentLevel is incremented
2. currentQuestionIndex is reset
3. showSuccessScreen is updated
4. Session is persisted

### Quiz Cancellation
1. User exits the quiz and chooses not to save the quiz progress
2. clearQuizSession() is called

### Quiz Restart
1. User exits the quiz and chooses to save the quiz progress
2. When clicking "Quiz starten" user chooses to restart the quiz.
3. clearQuizSession() is called

---
## Quiz Results Persistence (Separate Storage)
File: `persistQuizResults.ts`

| Property     | Value             |
| ------------ | ----------------- |
| Database     | `quiz-results-db` |
| Object Store | `results`         |
| Key          | `"latest-results"`        |

Quiz results are intentionally stored separately from the quiz session so they can survive session resets.

### API
- `saveQuizResults(results)`
- `loadQuizResults()`
- `clearQuizResults()`
