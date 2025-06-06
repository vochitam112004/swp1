import React, { useState } from 'react';

function UserProfile() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    // Add other user fields as necessary
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the submission of user profile data
    console.log('User Profile Updated:', userInfo);
  };

  return (
    <div className="user-profile">
      <h1>User Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={userInfo.phone}
            onChange={handleChange}
          />
        </div>
        {/* Add other fields as necessary */}
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default UserProfile;