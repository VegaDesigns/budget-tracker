import React, { createContext, useReducer, useContext, useEffect } from "react";

// ---------- initial state ----------
function safeParse(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(key);
    return defaultValue;
  }
}

const initialState = {
  transactions: safeParse("transactions", []),
  monthlyBudget: safeParse("monthlyBudget", null),
  theme: localStorage.getItem("theme") || "light",
};

// ---------- reducer ----------
function budgetReducer(state, action) {
  switch (action.type) {
    case "ADD_TX":
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };

    case "DELETE_TX":
      return {
        ...state,
        transactions: state.transactions.filter(
          (tx) => tx.id !== action.payload
        ),
      };

    case "SET_BUDGET":
      return { ...state, monthlyBudget: action.payload };

    case "TOGGLE_THEME":
      return { ...state, theme: state.theme === "light" ? "dark" : "light" };

    default:
      return state;
  }
}

// ---------- context ----------
const BudgetContext = createContext();

// ---------- provider ----------
export function BudgetProvider({ children }) {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  // sync to localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(state.transactions));
    if (state.monthlyBudget !== null)
      localStorage.setItem(
        "monthlyBudget",
        JSON.stringify(state.monthlyBudget)
      );
    localStorage.setItem("theme", state.theme);
    document.body.classList.toggle("dark", state.theme === "dark");
  }, [state]);

  return (
    <BudgetContext.Provider value={{ state, dispatch }}>
      {children}
    </BudgetContext.Provider>
  );
}

// ---------- hook ----------
export const useBudget = () => useContext(BudgetContext);
