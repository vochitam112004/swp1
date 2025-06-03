import React from 'react';
import ProgressTracker from '../Progress/ProgressTracker';
import BadgeList from '../Progress/BadgeList';
import NotificationList from '../Notifications/NotificationList';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Your Dashboard</h1>
      <NotificationList />
      <ProgressTracker />
      <BadgeList />
    </div>
  );
}

export default Dashboard;