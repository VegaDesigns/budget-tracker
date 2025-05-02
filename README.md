# Budget Tracker

A simple budget tracker app built with HTML, CSS, and JavaScript using `localStorage`. It helps users track income and expenses with a clean, responsive UI and real-time visual feedback.

---

## ✅ Features

- Add income and expenses  
- Real-time balance, income, and expense display  
- Responsive Chart.js graph  
- Delete transactions with a trash icon  
- Dark mode toggle (saved in localStorage)  
- Mobile-first responsive layout  
- Persistent storage via localStorage  

---

## 🧠 Development Journey

### Phase 1: MVP Build  
**Goal:** Get the core add/store/display flow working.

**What Went Wrong:**  
- Expenses were saved as positives  
- Balance calculation was incorrect  
- Users had to type negative values manually  

**Fixes:**  
- Updated storage logic to save expenses as negatives  
- Corrected the math for balance/income/expenses  
- Added a dropdown to select Income vs. Expense

---

### Phase 2: UI/UX + Visual Feedback  
**Goal:** Make it feel like a modern, professional product.

**What Went Wrong:**  
- Charts duplicated on each update  
- Dark mode didn’t persist  
- Layout and spacing were inconsistent  

**Fixes:**  
- Destroyed existing Chart before re-render  
- Saved theme in localStorage  
- Redesigned layout with Flexbox and uniform spacing 

---

### Phase 3: Functional Features
**Goal:** Add all interactive features and clean up the code.

**What Went Wrong:**  
- Inline edits weren’t styled  
- Budget bar didn’t always refresh  
- CSV export was missing  
- Date formatting was inconsistent  

**Fixes:**  
- Styled inline edits with shared input/select classes  
- Moved `updateBudgetStatus()` into the main UI update flow  
- Built and wired a CSV export function  
- Centralized date formatting in `formatDate()`  

---

## 🏁 Phase 1: MVP Build (Completed)

- [x] Static HTML layout  
- [x] Styled with modern CSS  
- [x] Add transaction form  
- [x] Dynamic balance, income, and expense display  
- [x] `localStorage` integration  
- [x] Initial mobile responsiveness

---

### Phase 2: UI/UX Enhancements (Completed)
- [x] Color-coded tags for income/expenses  
- [x] Mobile responsive polish  
- [x] Visual charts using Chart.js  
- [x] Dark mode with toggle & persistence  
- [x] Polished form and layout styling  

### Phase 3: Functional Features (Completed)
- [x] Delete transactions  
- [x] Edit existing transactions (inline)  
- [x] Filter by category  
- [x] Automatically assign transaction date using local time  
- [x] Monthly budget goals  
- [x] Export to CSV

### Phase 4: Framework Upgrade
- [ ] Rebuild in React or Vue  
- [ ] State management with Context API or Redux  
- [ ] Deploy via Netlify or Vercel  

### Phase 5: Backend Features
- [ ] Add user authentication  
- [ ] Store data in MongoDB or Supabase  
- [ ] Build REST API with Express.js  

---

## 🌐 Live Projects

- 🔗 [Budget Tracker Live](https://vegadesigns.github.io/budget-tracker)  
- 🔗 [My Developer Portfolio](https://vegadesigns.github.io/portfolio)