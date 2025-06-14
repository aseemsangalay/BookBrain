import React from "react";
import { useEffect, useState } from "react";
import { getInsights, deleteInsight } from "../utils/storage";

function InsightList({
  insights,
  onExpand,
  expandedInsight,
  onInsightsChange,
}) {
  const handleDelete = (e, timestamp) => {
    e.stopPropagation(); // Prevent card expansion when clicking delete
    const updatedInsights = deleteInsight(timestamp);
    onInsightsChange(updatedInsights);
  };

  if (insights.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-2">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p className="text-lg font-medium mb-1">No insights yet</p>
          <p className="text-sm">Add your first insight above to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {insights.map((insight) => (
        <div
          key={insight.timestamp}
          className="bg-[#2a2a2a] rounded-xl p-4 hover:bg-[#333333] transition-colors cursor-pointer aspect-square flex flex-col group relative shadow-lg hover:shadow-xl"
          onClick={() => onExpand(insight)}
        >
          <button
            onClick={(e) => handleDelete(e, insight.timestamp)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete insight"
          >
            🗑️
          </button>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-white mb-2 line-clamp-1">
              {insight.title}
            </h3>
            <span className="text-xs text-gray-400 shrink-0 ml-2 font-mono">
              {new Date(insight.timestamp).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="h-px bg-gray-700 my-2" />
          <p className="text-gray-300 line-clamp-4 flex-grow">{insight.text}</p>
        </div>
      ))}
    </div>
  );
}

export default InsightList;
