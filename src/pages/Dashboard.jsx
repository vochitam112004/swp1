import React from 'react';
import ProgressTracker from '../components/Progress/ProgressTracker';
import BadgeList from '../components/Progress/BadgeList';
import NotificationList from '../components/Notifications/NotificationList';
import PlanList from '../components/Plans/PlanList';

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Your Dashboard</h1>
      <ProgressTracker />
      <BadgeList />
      <NotificationList />
      <PlanList />
    </div>
  );
}

export default Dashboard;