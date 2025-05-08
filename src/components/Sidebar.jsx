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

// Accept an avatarUrl prop to render the user's photo
export default function Sidebar({
  isOpen,
  onExport,
  onToggleTheme,
  theme,
  avatarUrl,
}) {
  const isDark = theme === "dark";

  return (
    <aside className={`sidebar${isOpen ? " sidebar--open" : ""}`}>
      {/* Avatar Section: use avatarUrl prop or fallback */}
      <div className="sidebar__avatar">
        <img src={avatarUrl || "/default-avatar.png"} alt="User Avatar" />
      </div>

      {/* Navigation Links */}
      <nav className="sidebar__nav">
        <ul>
          <li>
            <a href="#" className="sidebar__link active">
              <FaHome /> Dashboard
            </a>
          </li>
          <li>
            <a href="#" className="sidebar__link">
              <FaChartPie /> Reports
            </a>
          </li>
          <li>
            <a href="#" className="sidebar__link">
              <FaWallet /> Transactions
            </a>
          </li>
          <li>
            <a href="#" className="sidebar__link">
              <FaCog /> Settings
            </a>
          </li>
        </ul>
      </nav>

      {/* Footer: Theme Toggle & Export */}
      <div className="sidebar__footer">
        {/* Theme toggle placed above Export button */}
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
        <button className="sidebar__export-btn" onClick={onExport}>
          <FaFileExport /> Export CSV
        </button>
      </div>
    </aside>
  );
}
