import React from 'react';

function ProgressTracker({ progressData }) {
  return (
    <div className="progress-tracker">
      <h2>Your Progress</h2>
      <p>Days Smoke-Free: {progressData.daysSmokeFree}</p>
      <p>Money Saved: ${progressData.moneySaved}</p>
      <p>Health Improvements: {progressData.healthImprovements}</p>
      <h3>Progress Over Time</h3>
      <ul>
        {progressData.history.map((entry, index) => (
          <li key={index}>
            Day {entry.day}: {entry.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProgressTracker;