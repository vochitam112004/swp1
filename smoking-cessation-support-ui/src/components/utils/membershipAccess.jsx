export const getCurrentPlan = () => {
  return JSON.parse(localStorage.getItem("membershipPlan") || "{}");
};

export const hasActiveMembership = () => {
  const plan = getCurrentPlan();
  return plan && plan.planId;
};

export const isVIP = () => {
  const plan = getCurrentPlan();
  return plan?.name?.toLowerCase().includes("vip");
};

export const isFreePlan = () => {
  const plan = getCurrentPlan();
  return !plan || plan?.price === 0;
};
