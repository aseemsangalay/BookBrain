/**
 * Main entry point for the BookBrain application.
 * This file sets up the React application and renders it to the DOM.
 */

// Import React and ReactDOM
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Import global styles
import "./index.css";

// Import the main App component
import App from "./App.jsx";

// Get the root DOM element
const rootElement = document.getElementById("root");

// Create a root instance
const root = createRoot(rootElement);

// Render the app in StrictMode for better development experience
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
