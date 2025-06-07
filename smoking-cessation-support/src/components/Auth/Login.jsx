import React, { useState } from 'react';
import "./Login.css"
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    console.log('Logging in with:', { email, password });
  };

  return (
    <div className="login-split-bg">
      <div className="login-left">
        <img
          src="/images/your-login-image.jpg"
          alt="Support Service"
          className="login-service-img"
        />
        <div className="login-service-caption">
          <h2>Chào mừng bạn quay trở lại!</h2>
          <p>Tiếp tục hành trình cai nghiện thuốc của bạn.</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-container">
          <h2 className="login-title">Đăng nhập</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="login-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
            <button type="submit" className="login-btn">Đăng nhập</button>
          </form>

          <div className="google-login-wrapper">
            {/* Component Google Login nếu có */}
            <div>
              <button style={{ width: '100%', padding: '0.6rem', border: 'none', background: '#fff', color: '#333' }}>
                Đăng nhập với Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
