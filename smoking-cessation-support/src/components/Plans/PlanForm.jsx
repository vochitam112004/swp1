import React, { useState } from 'react';

function PlanForm() {
  const [planName, setPlanName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reasons, setReasons] = useState('');
  const [stages, setStages] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      planName,
      startDate,
      endDate,
      reasons,
      stages,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Your Smoking Cessation Plan</h2>
      <div>
        <label>Plan Name:</label>
        <input
          type="text"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Reasons for Quitting:</label>
        <textarea
          value={reasons}
          onChange={(e) => setReasons(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Stages of Your Plan:</label>
        <textarea
          value={stages}
          onChange={(e) => setStages(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Plan</button>
    </form>
  );
}

export default PlanForm;