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
**Goal:** Get the core app working with input, storage, and display.

**What Went Wrong:**  
- `localStorage` kept saving bad data and everything kept showed up as income because expenses weren’t negative.  
- Calculations were off. The balance just equaled income.  
- The UI was confusing. Users would have to type `-200` for expenses.

**Fixes:**  
- Cleared `localStorage` and updated the logic to store expenses as negative numbers.  
- Added a dropdown to let users choose “Income” or “Expense”.  
- Adjusted math logic to calculate actual balance correctly.

---

### Phase 2: UI/UX + Visual Feedback  
**Goal:** Make it feel like a modern, professional product.

**What Went Wrong:**  
- Chart.js duplicated charts every time a transaction was added.  
- Dark mode wouldn’t persist on refresh.  
- The layout felt clunky. The spacing was inconsistent, and mobile experience wasn’t great.

**Fixes:**  
- Used `.destroy()` on the Chart instance before re-rendering to stop duplicates.  
- Saved dark mode preference in `localStorage` and applied it on page load.  
- Redesigned the layout using Flexbox, added spacing, cleaned up form flow, and polished styles to match modern UX expectations.

---

## 🏁 Phase 1: MVP Build (Completed)

- [x] Static HTML layout  
- [x] Styled with modern CSS  
- [x] Add transaction form  
- [x] Dynamic balance, income, and expense display  
- [x] `localStorage` integration  
- [x] Initial mobile responsiveness

---

## 🔧 Planned Upgrades

### Phase 2: UI/UX Enhancements
- [x] Color-coded tags for income/expenses  
- [x] Mobile responsive polish  
- [x] Visual charts using Chart.js  
- [x] Dark mode with toggle & persistence  
- [x] Polished form and layout styling  

### Phase 3: Functional Features
- [x] Delete transactions  
- [x] Edit existing transactions (inline)  
- [x] Filter by category  
- [x] Automatically assign transaction date using local time  
- [ ] Monthly budget goals  
- [ ] Export to CSV

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