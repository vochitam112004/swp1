import React from 'react';

const MembershipPlans = () => {
  const plans = [
    {
      id: 1,
      name: 'Basic Plan',
      price: '$9.99/month',
      features: [
        'Access to basic resources',
        'Monthly progress tracking',
        'Community support'
      ]
    },
    {
      id: 2,
      name: 'Standard Plan',
      price: '$19.99/month',
      features: [
        'All Basic Plan features',
        'Personalized coaching',
        'Weekly check-ins'
      ]
    },
    {
      id: 3,
      name: 'Premium Plan',
      price: '$29.99/month',
      features: [
        'All Standard Plan features',
        'Access to exclusive content',
        'One-on-one coaching sessions'
      ]
    }
  ];

  return (
    <div className="membership-plans">
      <h1>Membership Plans</h1>
      <div className="plans-container">
        {plans.map(plan => (
          <div key={plan.id} className="plan-card">
            <h2>{plan.name}</h2>
            <p>{plan.price}</p>
            <ul>
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipPlans;