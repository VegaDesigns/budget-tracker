import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Global application styles
import App from "./App"; // Root component

// Create React root and render the App inside <div id="root">
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
