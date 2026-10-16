# React Hooks Practical Exam

Six exams in one Vite + React app, switched with the tab bar in `App.jsx`. Only React Hooks are used for state logic. No state management library is installed.

## Run

```
npm install
npm run dev
npm test        # Exam 6 reducer tests
```

## Completed Requirements

| Exam | Hooks | Status |
|---|---|---|
| 1. Smart Task Counter | useState | Complete |
| 2. Live Search and Timer | useEffect, useState | Complete |
| 3. Accessible Form Toolkit | useRef, useState | Complete |
| 4. Application Preferences | useContext, useState | Complete |
| 5. Product Explorer Performance Repair | useMemo, useCallback | Complete |
| 6. Issue Tracker State Engine | useReducer, custom Hook | Complete |

**Exam 1:** `count` and `target` state. Increment, Decrement, Reset, and +2 (two queued functional updates). Count never goes below 0 or above the target. Status is derived during render (Not started / In progress / Target reached), with no separate status state. Increment and +2 are disabled at the target.

**Exam 2:** Local `USERS` data. Delayed search effect with `clearTimeout` cleanup. One-second timer using `setInterval` with `clearInterval` cleanup (a button mounts and unmounts it). The document title shows the result count.

**Exam 3:** Controlled name, email, and password inputs with three refs attached through `ref`. Validation: required name, valid email, 8+ character password, with readable error messages. Focus moves to the first invalid field (name, email, password). The previous submitted email is kept in a ref and shown after the next successful submission. Extra features: a name or email that is already registered is rejected ("This name/email is not available", case-insensitive), and a green success box ("<name> has successfully registered.") appears after every successful registration.

**Exam 4:** One context and provider (`PreferencesContext.jsx`) sharing `theme`, `fontSize`, `toggleTheme`, and `setFontSize`. Light/dark toggle and 14/16/18 px font sizes. `usePreferences` throws a clear error outside the provider. Tree: `App → PreferencesProvider → Dashboard → Toolbar / PreferencesPanel / ArticlePreview`. Dark mode applies to the whole page and stays on across tabs until it is toggled again in Exam 4.

**Exam 5:** 600 generated products with text search, category filter, and price sort (plus A to Z / Z to A name sort). `useMemo` for filter and sort, `useCallback` for selection, `ProductList` wrapped in `React.memo`, and an unrelated counter to test unnecessary work. Dependency arrays are complete.

**Exam 6:** Reducer with `ADD_ISSUE`, `TOGGLE_ISSUE`, `DELETE_ISSUE`, `SET_FILTER`, and `CLEAR_DONE`. State shape: `{ issues: [], filter: 'all', nextId: 1 }`. The reducer is pure and immutable, and the default branch returns the existing state. `usePersistentReducer` loads from localStorage once and saves after state changes. All / Open / Done views with accurate counts. Three reducer tests (add, toggle, clear done) pass.

## Debugging Cases

| # | Fault | Repair and explanation |
|---|---|---|
| Ex1 | `setCount(count + 1)` twice adds only 1 | Both calls read the same captured `count` from that render. Using `setCount(c => c + 1)` makes each update run on the latest queued value. |
| Ex2-6 | Effect depends on state it updates and loops | Depend only on the true input (`query`). |
| Ex2-7 | Timer stuck at 1 | The callback captured the initial `seconds`. Fixed with `setSeconds(s => s + 1)`. |
| Ex2-8 | Cleanup | `clearTimeout` cancels the previous delayed search so stale results never show. `clearInterval` stops the timer on unmount so no duplicate timer runs. |
| Ex3 | `clicks.current` does not update the screen | Changing a ref does not schedule a render. Visible data is stored in state. |
| Ex4-9 | Consumer gets only the default value | No provider wrapped the tree. Fixed by wrapping in `PreferencesProvider`. |
| Ex4-10 | Provider and consumer use different contexts | Context is created once, exported, and imported everywhere. |
| Ex4-11 | Why intermediate props disappear | Any descendant reads the nearest provider value directly, so middle components do not relay props. |
| Ex5-12 | Stale search results | Added `query` to the `useMemo` dependencies. |
| Ex5-13 | Outdated callback | Dependencies are completed. The callback uses a functional update, so `[]` is complete and stable. |
| Ex5-14 | Analytics inside `useMemo` | Moved into `useEffect` because it is a side effect. |
| Ex6-15 | Direct state mutation | The reducer returns new state and new issue objects (`map`, `filter`, spread). |
| Ex6-16 | `action.payload` vs `action.title` mismatch | `dispatch` and the reducer both use `{ type, payload: { ... } }`. |
| Ex6-17 | Default branch returns `undefined` | Default returns `state`. |

## Demonstration Bug

**Exam 1, stale count.** Clicking +2 only added one because both `setCount(count + 1)` calls used the same render's `count`. I changed both to `setCount(c => c + 1)`, so React applies them in sequence and the count rises by exactly two.

## Test Steps

- **Exam 1:** Target 5, count 0 shows "Not started". Count 4 then +2 stops at 5 and disables the buttons. Decrement at 0 stays 0. Reset after the target returns to 0.
- **Exam 2:** Type quickly and only the final query's results show. The timer counts once per second. Unmount and mount the timer and it restarts with one timer. The tab title shows the result count.
- **Exam 3:** Submit an empty form and focus lands on name, then email, then password as each is fixed. Register `Ana` / `ana@mail.com` and a green box appears. Register the same name or email again and the field shows "not available". Register a new account and "Previous submitted email" shows the earlier email.
- **Exam 4:** Toggle the theme and the whole page changes and stays dark across tabs. Change the font size and the preview updates.
- **Exam 5:** Open the console and click the unrelated counter. There is no `ProductList rendered` and no `filter + sort ran`. Type in search, change the category, or change the sort and both appear.
- **Exam 6:** Add, toggle, delete, filter, and clear done. Refresh and state persists. Run `npm test` and 3 tests pass.

## Known Limitations

- Exam 1: +2 near the target is clamped to the target (4 → 5 with target 5) instead of adding exactly two.
- Exam 3: registered accounts are kept in memory only, so they reset on refresh or when leaving the tab. There is no real backend and passwords are not stored.
- Exam 5: the unrelated counter only proves memoization through console logs. In development, `StrictMode` may duplicate some logs.
- Exam 6: empty issue titles are ignored. State is stored under one localStorage key.
- Styling is minimal. There is no routing and no backend.

## When Memoization Is Unnecessary

When the calculation is cheap, for example `a + b`, or when a callback is passed to a plain DOM element or a non-memoized child. Comparing dependencies and keeping the cached value cost more than recomputing.