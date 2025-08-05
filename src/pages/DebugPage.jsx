import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import DebugDashboard from '../components/debug/DebugDashboard';
import TriggerFactorTest from '../components/debug/TriggerFactorTest';
import BadgeAPITest from '../components/debug/BadgeAPITest';
import AchievementAPITest from '../components/debug/AchievementAPITest';

const DebugPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Dashboard Debug" />
          <Tab label="TriggerFactor API Test" />
          <Tab label="Badge API Test" />
          <Tab label="Achievement API Test" />
        </Tabs>
      </Paper>
      
      {tabValue === 0 && <DebugDashboard />}
      {tabValue === 1 && <TriggerFactorTest />}
      {tabValue === 2 && <BadgeAPITest />}
      {tabValue === 3 && <AchievementAPITest />}
    </Box>
  );
};

export default DebugPage;
