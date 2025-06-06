import React from 'react';

function BadgeList({ badges }) {
  return (
    <div className="badge-list">
      <h2>Your Achievements</h2>
      <ul>
        {badges.map((badge) => (
          <li key={badge.id} className="badge-item">
            <img src={badge.image} alt={badge.name} />
            <span>{badge.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BadgeList;