import { useState } from "react";

export default function InsightForm({ onAdd }) {
  // Track input fields
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const MAX_CHARS = 500;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;

    onAdd({
      title,
      text,
      timestamp: Date.now(),
    });

    setTitle("");
    setText("");
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= MAX_CHARS) {
      setText(newText);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500"
      />
      <div className="flex flex-col flex-grow">
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Write your insight here..."
          className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500 h-32 resize-none"
        />
        <div className="text-sm text-gray-400 text-right mt-1">
          {text.length}/{MAX_CHARS} characters
        </div>
      </div>
      <button
        type="submit"
        className="w-full p-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-200"
      >
        Save Insight
      </button>
    </form>
  );
}
