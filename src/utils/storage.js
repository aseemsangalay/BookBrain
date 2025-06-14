const STORAGE_KEY = "bookbrain_insights";

export const loadInsights = () => {
  try {
    const storedInsights = localStorage.getItem(STORAGE_KEY);
    return storedInsights ? JSON.parse(storedInsights) : [];
  } catch (error) {
    console.error("Error loading insights:", error);
    return [];
  }
};

export const saveInsights = (insights) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(insights));
  } catch (error) {
    console.error("Error saving insights:", error);
  }
};

export function deleteInsight(timestamp) {
  const insights = loadInsights();
  const updatedInsights = insights.filter(
    (insight) => insight.timestamp !== timestamp
  );
  saveInsights(updatedInsights);
  return updatedInsights;
}
