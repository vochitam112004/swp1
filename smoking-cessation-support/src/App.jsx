import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Ranking from './pages/Ranking';
import Blog from './pages/Blog';
import Plan from './pages/Plan';
import Progress from './pages/Progress';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Membership from './pages/Membership';
import Navbar from './components/Navbar'; // Thêm dòng này

function App() {
  return (
    <Router>
      <Navbar /> {/* Thêm dòng này */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/membership" element={<Membership />} />
      </Routes>
    </Router>
  );
}

export default App;