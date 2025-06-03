import React from 'react';
import ProgressTracker from '../components/Progress/ProgressTracker';
import BadgeList from '../components/Progress/BadgeList';

function Progress() {
  return (
    <div>
      <h1>Your Progress</h1>
      <ProgressTracker />
      <BadgeList />
    </div>
  );
}

export default Progress;