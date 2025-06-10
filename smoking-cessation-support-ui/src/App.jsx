import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Navigation from "./components/navigation";
import HeroSection from "./components/heroSection";
import StatsSection from "./components/statsSection";
import FeaturesSection from "./components/featuresSection";
import Dashboard from "./components/dashboard";
import Membership from "./components/membership";
import Testimonials from "./components/testimonials";
import CTASection from "./components/CTASection";
import Login from "./components/Login";
import Footer from "./components/footer";
import Register from "./components/Register";
import Blog from "./components/Blog";
import BXH from "./components/BXH";
import ChatSupport from "./components/ChatSupport";

function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <StatsSection />
              <FeaturesSection />
              <Dashboard />
              <Membership />
              <Testimonials />
              <CTASection />
              <Register />
            </>
          }
        />
        <Route path="/blog" element={<Blog />} />
        <Route path="/bxh" element={<BXH />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/register" element={<Register />} />
        {/* Thêm các route khác nếu cần */}
      </Routes>
      <Footer />
      {/* Nút ẩn/hiện chat */}
      <button
        onClick={() => setShowChat((prev) => !prev)}
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 10000,
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 56,
          height: 56,
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          fontSize: 28,
          cursor: "pointer",
        }}
        aria-label={showChat ? "Ẩn chat hỗ trợ" : "Hiện chat hỗ trợ"}
      >
        {showChat ? "\u00D7" : "\u{1F4AC}"}
      </button>
      {showChat && <ChatSupport />}
    </Router>
  );
}

export default App;