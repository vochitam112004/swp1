import React from 'react';
import MembershipPlans from '../components/Membership/MembershipPlans';
import Payment from '../components/Membership/Payment';

function Membership() {
  return (
    <div>
      <h1>Membership Options</h1>
      <MembershipPlans />
      <Payment />
    </div>
  );
}

export default Membership;