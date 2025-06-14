/**
 * Storage Utility for BookBrain
 *
 * This module provides functions for managing book insights in localStorage.
 * It handles loading, saving, and deleting insights with error handling.
 */

// Storage key for localStorage
const STORAGE_KEY = "bookbrain_insights";

/**
 * Loads insights from localStorage
 * @returns {Array} Array of insights, or empty array if none found or error occurs
 */
export const loadInsights = () => {
  try {
    const storedInsights = localStorage.getItem(STORAGE_KEY);
    return storedInsights ? JSON.parse(storedInsights) : [];
  } catch (error) {
    console.error("Error loading insights:", error);
    return [];
  }
};

/**
 * Saves insights to localStorage
 * @param {Array} insights - Array of insight objects to save
 * @returns {boolean} True if save was successful, false otherwise
 */
export const saveInsights = (insights) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(insights));
    return true;
  } catch (error) {
    console.error("Error saving insights:", error);
    return false;
  }
};

/**
 * Deletes a specific insight by timestamp
 * @param {number} timestamp - The timestamp of the insight to delete
 * @returns {Array} Updated array of insights
 */
export const deleteInsight = (timestamp) => {
  try {
    const insights = loadInsights();
    const updatedInsights = insights.filter(
      (insight) => insight.timestamp !== timestamp
    );
    saveInsights(updatedInsights);
    return updatedInsights;
  } catch (error) {
    console.error("Error deleting insight:", error);
    return loadInsights(); // Return current insights if deletion fails
  }
};

/**
 * Clears all insights from storage
 * @returns {boolean} True if clear was successful, false otherwise
 */
export const clearAllInsights = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing insights:", error);
    return false;
  }
};
