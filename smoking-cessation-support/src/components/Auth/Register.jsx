import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Đảm bảo file CSS được load

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = existingUsers.some(user => user.email === form.email);

    if (userExists) {
      alert('Email đã được đăng ký!');
    } else {
      const updatedUsers = [...existingUsers, form];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      alert('Đăng ký thành công!');
      navigate('/login');
    }
  };

  return (
    <div className="register-bg">
      <div className="register-container">
        <h2 className="register-title">Đăng ký tài khoản</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div>
            <label htmlFor="name">Họ tên</label>
            <input
              id="name"
              name="name"
              placeholder="Nhập họ tên"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"	
              name="email"
              placeholder="Nhập email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Số điện thoại</label>
            <input
              type="phone"
              id="phone"
              name="phone"
              placeholder="Nhập SĐT:"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="register-btn">
            Đăng ký
          </button>
          <button
            type="button"
            className="login-btn"
            onClick={() => navigate('/login')}
          >
            Đã có tài khoản? Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;