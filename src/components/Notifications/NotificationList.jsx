import React from 'react';

function NotificationList({ notifications }) {
  return (
    <div className="notification-list">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>
              <p>{notification.message}</p>
              <small>{notification.date}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationList;