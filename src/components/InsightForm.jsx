/**
 * InsightForm Component
 *
 * A form component for adding new book insights. It includes:
 * - Title input field
 * - Text area for the insight content
 * - Character counter
 * - Submit button
 *
 * @param {Object} props - Component props
 * @param {Function} props.onAdd - Callback function to handle adding new insights
 * @returns {JSX.Element} The rendered form component
 */

import { useState } from "react";

// Constants
const MAX_CHARS = 500;

export default function InsightForm({ onAdd }) {
  // State management
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  /**
   * Handles form submission
   * @param {Event} e - The form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!title.trim() || !text.trim()) return;

    // Create new insight object
    const newInsight = {
      title: title.trim(),
      text: text.trim(),
      timestamp: Date.now(),
    };

    // Add insight and reset form
    onAdd(newInsight);
    setTitle("");
    setText("");
  };

  /**
   * Handles text area changes with character limit
   * @param {Event} e - The change event
   */
  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= MAX_CHARS) {
      setText(newText);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
      {/* Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500"
        aria-label="Insight title"
      />

      {/* Text Area with Character Counter */}
      <div className="flex flex-col flex-grow">
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Write your insight here..."
          className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500 h-32 resize-none"
          aria-label="Insight text"
        />
        <div
          className="text-sm text-gray-400 text-right mt-1"
          aria-live="polite"
        >
          {text.length}/{MAX_CHARS} characters
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full p-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-200"
        aria-label="Save insight"
      >
        Save Insight
      </button>
    </form>
  );
}
