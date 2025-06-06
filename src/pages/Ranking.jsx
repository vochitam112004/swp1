import React from 'react';

function Ranking() {
  // Sample data for ranking users based on their achievements
  const rankings = [
    { username: 'User1', daysSmokeFree: 30, moneySaved: 100 },
    { username: 'User2', daysSmokeFree: 20, moneySaved: 50 },
    { username: 'User3', daysSmokeFree: 15, moneySaved: 30 },
  ];

  return (
    <div className="ranking-page">
      <h1>User Rankings</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Days Smoke Free</th>
            <th>Money Saved ($)</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((user, index) => (
            <tr key={index}>
              <td>{user.username}</td>
              <td>{user.daysSmokeFree}</td>
              <td>{user.moneySaved}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Ranking;