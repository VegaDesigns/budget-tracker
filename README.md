# Budget Tracker — Phase 2 (React 19)

> Phase 2 is an in‑progress rewrite that modernises the UI, adopts React best practices,
> and sets the stage for powerful new features.

The React app under `src/` is the actively maintained codebase. The original
vanilla JS implementation has been moved to `docs/archive/` for reference.

---

## 🎯 Phase 2 Goals

1. **Fresh UX / UI**

   - Clean, card‑based layout
   - Smooth animations, accessible colour palette
   - Sun / moon theme switch redesigned with icons

2. **Code Tightening**

   - Move state to **Context API** + custom hooks
   - Add **Prettier + Stylelint** auto‑format on commit
   - 80 % unit‑test coverage (React Testing Library + Jest)

3. **Feature Planning** (see list below)

---

## 💡 Feature Ideas Under Consideration

| Category          | Idea                   | Tech / Why It’s Cool                           |
| ----------------- | ---------------------- | ---------------------------------------------- |
| **Data**          | Recurring transactions | CRON‑style recurrence, stored in state reducer |
|                   | Cloud sync             | Supabase / Firebase; shows full‑stack chops    |
| **UI**            | Calendar view          | React Big Calendar for “transaction timeline”  |
|                   | Category budgets       | Per‑category caps + progress rings             |
|                   | Drag‑and‑drop reorder  | `react-beautiful-dnd`; UX polish               |
| **Reporting**     | Monthly PDF export     | `react‑pdf` or serverless function             |
|                   | Multi‑currency         | Live FX rates API; currency switcher           |
| **Product**       | PWA offline support    | Workbox; “Install” prompt on mobile            |
|                   | Push notifications     | Warn when approaching budget limit             |
| **Accessibility** | Keyboard shortcuts     | `useHotkeys` hook; WCAG focus management       |

_We’ll lock feature scope after the refactor is stable._

---

## ✅ Current Status

| Item                          | Progress |
| ----------------------------- | -------- |
| React scaffold (CRA)          | ✔        |
| Dark‑mode toggle (sun / moon) | ✔        |
| Transactions componentised    | ✔        |
| Context API state             | ⏳       |
| Unit‑test harness             | ⏳       |

---

## 🚀 Running Phase 2 Locally

```bash
git checkout phase-2      # React branch
npm install
npm start                 # http://localhost:3000
```
