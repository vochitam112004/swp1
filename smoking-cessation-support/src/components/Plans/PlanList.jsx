import React from 'react';

function PlanList({ plans }) {
  return (
    <div className="plan-list">
      <h2>Your Smoking Cessation Plans</h2>
      {plans.length === 0 ? (
        <p>No plans available. Please create a new plan.</p>
      ) : (
        <ul>
          {plans.map((plan) => (
            <li key={plan.id}>
              <h3>{plan.name}</h3>
              <p><strong>Start Date:</strong> {plan.startDate}</p>
              <p><strong>End Date:</strong> {plan.endDate}</p>
              <p><strong>Goals:</strong> {plan.goals.join(', ')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlanList;