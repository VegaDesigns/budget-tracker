// src/components/Sidebar.jsx
import React from "react";
import {
  FaHome,
  FaChartPie,
  FaWallet,
  FaCog,
  FaFileExport,
  FaSun,
  FaMoon,
} from "react-icons/fa";

export default function Sidebar({ onExport, onToggleTheme, theme }) {
  const isDark = theme === "dark";

  return (
    <aside className="sidebar">
      {/* Avatar & Nav */}
      <div className="sidebar__avatar">
        <img src="/path/to/avatar.jpg" alt="User Avatar" />
      </div>
      <nav className="sidebar__nav">
        <a href="#" className="sidebar__link active">
          <FaHome />
          <span>Dashboard</span>
        </a>
        <a href="#" className="sidebar__link">
          <FaChartPie />
          <span>Reports</span>
        </a>
        <a href="#" className="sidebar__link">
          <FaWallet />
          <span>Transactions</span>
        </a>
        <a href="#" className="sidebar__link">
          <FaCog />
          <span>Settings</span>
        </a>
      </nav>

      {/* 🌗 Theme Toggle (new) */}
      <div className="sidebar__theme">
        <label className="toggle-switch">
          <input type="checkbox" checked={isDark} onChange={onToggleTheme} />
          <span className="slider">
            <FaSun className="sun" />
            <FaMoon className="moon" />
          </span>
        </label>
      </div>

      {/* Export CSV button */}
      <div className="sidebar__footer">
        <button className="sidebar__export-btn" onClick={onExport}>
          <FaFileExport /> Export CSV
        </button>
      </div>
    </aside>
  );
}
