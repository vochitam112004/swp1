import React from 'react';
import PlanForm from '../components/Plans/PlanForm';
import PlanList from '../components/Plans/PlanList';

function Plan() {
  return (
    <div>
      <h1>Smoking Cessation Plan</h1>
      <PlanForm />
      <PlanList />
    </div>
  );
}

export default Plan;