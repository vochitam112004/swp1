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
import Payment from "./components/Payment";

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
        <Route path="/payment" element={<Payment />} />
        {/* Thêm các route khác nếu cần */}
      </Routes>
      <Footer />
      {/* Nút ẩn/hiện chat */}
    </Router>
  );
}

export default App;