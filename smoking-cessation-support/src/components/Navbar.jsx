import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{
      background: '#007bff',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link to="/" style={{ color: '#fff', fontWeight: 'bold', marginRight: 20 }}>Home</Link>
        <Link to="/ranking" style={{ color: '#fff', marginRight: 20 }}>Ranking</Link>
        <Link to="/blog" style={{ color: '#fff', marginRight: 20 }}>Blog</Link>
        <Link to="/plan" style={{ color: '#fff', marginRight: 20 }}>Plan</Link>
        <Link to="/progress" style={{ color: '#fff', marginRight: 20 }}>Progress</Link>
        <Link to="/dashboard" style={{ color: '#fff', marginRight: 20 }}>Dashboard</Link>
        <Link to="/profile" style={{ color: '#fff', marginRight: 20 }}>Profile</Link>
        <Link to="/membership" style={{ color: '#fff', marginRight: 20 }}>Membership</Link>
      </div>
      <div>
        <Link to="/login" style={{ color: '#fff', marginRight: 10 }}>Đăng nhập</Link>
        <Link to="/register" style={{ color: '#fff', border: '1px solid #fff', borderRadius: 4, padding: '4px 10px' }}>Đăng ký</Link>
      </div>
    </nav>
  );
}

export default Navbar;