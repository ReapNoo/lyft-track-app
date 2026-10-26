# AI Agent Instructions for Lyft Track 🏋️‍♂️

## 1. Project Overview & Tech Stack
Lyft Track is a local-first, offline workout tracker mobile app designed for speed and simplicity[cite: 3]. It uses a strict embedded SQLite database and avoids user accounts or cloud synchronization[cite: 3, 11]. 
*   **Framework:** React Native / Expo[cite: 3]
*   **Language:** TypeScript[cite: 3]
*   **Navigation:** Expo Router (File-based routing)[cite: 3]
*   **Database:** Expo SQLite with Drizzle ORM[cite: 3]
*   **UI Libraries:** `react-native-calendars`[cite: 3]

**Expo Strict Rules:**
1. Always read the major version of the `expo` package in `package.json`.
2. ALWAYS use `bunx expo install <package>` (or `npx`) to ensure SDK-compatible versions. 
3. Never edit `ios/` or `android/` folders directly; use `app.json` and config plugins.
4. Prefer Expo-recommended modules over third-party libraries.

## 2. Directory Architecture & Separation of Concerns
The project strictly separates the UI layer from the database logic[cite: 4].
*   **`app/` (Navigation Layer):** Contains Expo Router screens. Non-route code (components, hooks) MUST NOT live here. 
    *   `index.tsx` (Calendar Home)[cite: 4].
    *   `routines.tsx` & `exercises.tsx` (Dictionary Tabs)[cite: 9, 11].
    *   `workout/` (Nested stack: `[date].tsx`, `new.tsx`, `edit.tsx`)[cite: 3, 7].
*   **`src/db/` (Data Layer):** Isolates SQLite config (`database.ts`) and Drizzle ORM models (`schema.ts`)[cite: 3].
*   **`src/hooks/` (The Bridge):** Custom hooks (e.g., `useWorkoutDates`, `useRoutines`, `useSaveWorkout`) that fetch/format data so screens remain lightweight[cite: 3].
*   **`src/utils/`:** Utility functions like date formatting and debounce wrappers[cite: 1, 7].

## 3. Database Schema & Data Flow
The database uses `PRAGMA journal_mode = WAL` for performance and `PRAGMA foreign_keys = ON` to enforce strict relational rules[cite: 8].
*   **`routines`:** Reusable dictionary of workouts (e.g., `id`, `name`)[cite: 9].
*   **`exercises`:** User-generated dictionary of movements (e.g., `id`, `name`)[cite: 11].
*   **`workouts`:** The daily session linking a date to a routine (e.g., `id`, `date`, `routineId`). `date` is strictly a `YYYY-MM-DD` string to prevent timezone bugs[cite: 9, 11].
*   **`sets`:** The bridge linking exercise reps/weights to a specific workout (e.g., `workoutId`, `exerciseId`, `reps`, `weight`)[cite: 9].

**Update Strategy (Delete & Re-insert):**
When updating a workout in `useUpdateWorkout`, DO NOT write complex diffing logic[cite: 12]. Always update the parent `workouts` table, wipe all existing `sets` for that `workoutId`, and batch-insert the fresh `loggedSets` array from the UI payload[cite: 12].

## 4. Performance & UX Standards
*   **Calendar Optimization:** `react-native-calendars` is heavy. Always use `JSON.stringify()` deep equality checks in `useWorkoutDates` to prevent state updates if the database data hasn't genuinely changed[cite: 1].
*   **Animation Deferral:** SQLite fetches must wait for native screen transitions to finish. Wrap database queries inside `useFocusEffect` with a `setTimeout` of 600ms (for the calendar) or 300ms (for lists) to prevent dropped frames[cite: 1, 9].
*   **Debouncing:** All buttons capable of pushing screens MUST be wrapped in the `debouncePress` utility from `src/utils/debounce.ts` with a 500ms wait to prevent accidental double-stacking[cite: 1].
*   **UI Theming:** Use the established dark mode palette: `#1C1C1E` (Backgrounds), `#2C2C2E` (Cards/Rows), `#6366f1` (Primary Accents), `#FFFFFF` / `#D1D5DB` (Typography)[cite: 1, 9].

## 5. Routing & Navigation
*   **Nested Stack Animations:** Ensure the `app/workout/_layout.tsx` stack utilizes `animation: 'slide_from_right'` to seamlessly match the Root layout's native back swipe[cite: 1].
*   **Traffic Cop Pattern:** `app/workout/[date].tsx` is the viewer. It reads the URL date, queries SQLite, and dictates whether the user sees the "Empty Day" view (routing to `new.tsx`) or the "Completed Workout" view (routing to `edit.tsx`)[cite: 7, 8].
*   **Return Routing:** When saving/updating a workout successfully, use `router.dismissTo('/')` to aggressively clear the nested stack and drop the user cleanly back to the refreshed root calendar[cite: 1, 7]. For simple screen popping, rely on `router.back()`[cite: 7].