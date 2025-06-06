import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Ranking from './pages/Ranking';
import Blog from './pages/Blog';
import Plan from './pages/Plan';
import Progress from './pages/Progress';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Membership from './pages/Membership';
import Navbar from './components/Navbar';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// 👉 Import trang ghi nhận tình trạng hút thuốc
import SmokingStatus from './pages/SmokingCessation/SmokingStatus';
import QuitPlan from './pages/SmokingCessation/QuitPlan';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/membership" element={<Membership />} />

        {/* 👉 Thêm basename cho Router */}
        <Router basename="/smoking-cessation-support"></Router>
        <Route path="/login" element={<><h1>Login Page</h1><Login /></>} />
        <Route path="/register" element={<><h1>Register Page</h1><Register /></>} />

        {/* 👉 Route mới cho phần ghi nhận tình trạng hút thuốc */}
        <Route path="/smoking-status" element={<SmokingStatus />} />
        <Route path="/quit-plan" element={<QuitPlan />} />
      </Routes>
    </Router>
  );
}


export default App;
