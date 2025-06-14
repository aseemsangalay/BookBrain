/**
 * BookBrain - A React application for managing book insights
 *
 * This component serves as the main container for the application.
 * It manages the state of insights and handles all CRUD operations.
 */

import React, { useState, useEffect } from "react";
import InsightForm from "./components/InsightForm";
import { loadInsights, saveInsights } from "./utils/storage";
import "./App.css";

// Sample insights to initialize the application
const SAMPLE_INSIGHTS = [
  {
    title: "The Power of Habit",
    text: "Habits are formed through a cue-routine-reward loop. Understanding this cycle is key to building new habits and breaking bad ones.",
    timestamp: Date.now() - 86400000 * 2, // 2 days ago
  },
  {
    title: "Atomic Habits",
    text: "Small changes compound over time. 1% better every day leads to 37x improvement in a year. Focus on systems, not goals.",
    timestamp: Date.now() - 86400000, // 1 day ago
  },
  {
    title: "Deep Work",
    text: "The ability to focus without distraction is becoming increasingly valuable in our economy. Deep work is a skill that must be cultivated.",
    timestamp: Date.now() - 43200000, // 12 hours ago
  },
  {
    title: "Mindset",
    text: "Growth mindset vs fixed mindset: believing that abilities can be developed through dedication and hard work leads to greater achievement.",
    timestamp: Date.now() - 21600000, // 6 hours ago
  },
  {
    title: "Thinking Fast and Slow",
    text: "Our brain has two systems: System 1 (fast, intuitive) and System 2 (slow, analytical). Understanding when to use each is crucial for better decision making.",
    timestamp: Date.now() - 7200000, // 2 hours ago
  },
];

/**
 * Main App component
 * @returns {JSX.Element} The rendered application
 */
function App() {
  // State management
  const [insights, setInsights] = useState([]);
  const [expandedInsight, setExpandedInsight] = useState(null);

  // Load insights from localStorage on component mount
  useEffect(() => {
    const savedInsights = loadInsights();
    if (savedInsights && savedInsights.length > 0) {
      setInsights(savedInsights);
    } else {
      // Initialize with sample insights if no saved insights exist
      setInsights(SAMPLE_INSIGHTS);
      saveInsights(SAMPLE_INSIGHTS);
    }
  }, []);

  /**
   * Handles adding a new insight
   * @param {Object} newInsight - The new insight to add
   */
  const handleAddInsight = (newInsight) => {
    if (!newInsight.title?.trim() || !newInsight.text?.trim()) return;
    const updatedInsights = [...insights, newInsight];
    setInsights(updatedInsights);
    saveInsights(updatedInsights);
  };

  /**
   * Handles deleting an insight
   * @param {number} timestamp - The timestamp of the insight to delete
   */
  const handleDeleteInsight = (timestamp) => {
    const updatedInsights = insights.filter(
      (insight) => insight.timestamp !== timestamp
    );
    setInsights(updatedInsights);
    saveInsights(updatedInsights);
    if (expandedInsight?.timestamp === timestamp) {
      setExpandedInsight(null);
    }
  };

  /**
   * Handles clicking on an insight to expand it
   * @param {Object} insight - The insight to expand
   */
  const handleInsightClick = (insight) => {
    setExpandedInsight(insight);
  };

  /**
   * Handles clearing all insights
   */
  const handleClearAllInsights = () => {
    setInsights([]);
    saveInsights([]);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header and Form Section */}
        <div className="relative z-10 flex flex-col items-center p-8 bg-gray-800 rounded-lg shadow-lg max-w-sm w-full mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-4 text-center">BookBrain</h1>
          <p className="text-lg mb-8 text-gray-400 text-center">
            Your personal book insight network.
          </p>
          <InsightForm onAdd={handleAddInsight} />
          <button
            onClick={handleClearAllInsights}
            className="w-full p-3 mt-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition duration-200"
          >
            Delete All Insights
          </button>
        </div>

        {/* Insights Grid */}
        <div className="relative z-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {insights.map((insight) => (
              <div
                key={insight.timestamp}
                className="p-4 bg-gray-700 rounded-lg shadow-md text-white flex flex-col justify-center items-center text-center cursor-pointer hover:bg-gray-600 transition-colors"
                style={{
                  width: "100%",
                  height: "100px",
                }}
                onClick={() => handleInsightClick(insight)}
              >
                <h3 className="font-bold text-lg mb-1">{insight.title}</h3>
                <p className="text-sm text-gray-300 line-clamp-2">
                  {insight.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Expanded Insight */}
      {expandedInsight && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
          onClick={() => setExpandedInsight(null)}
        >
          <div
            className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{expandedInsight.title}</h2>
              <button
                onClick={() => setExpandedInsight(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-300 mb-4">{expandedInsight.text}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">
                {new Date(expandedInsight.timestamp).toLocaleString()}
              </span>
              <button
                onClick={() => handleDeleteInsight(expandedInsight.timestamp)}
                className="text-red-500 hover:text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
