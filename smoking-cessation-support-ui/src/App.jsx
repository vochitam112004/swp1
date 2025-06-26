import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Unauthorized from "./components/auth/Unauthorized";
import ProtectedRoute from "./components/auth/ProtectedRoute";
// import React, { useState } from "react";
import Navigation from "./components/layout/navigation";
import HeroSection from "./components/layout/heroSection";
import StatsSection from "./components/dashboard/statsSection";
import FeaturesSection from "./components/dashboard/featuresSection";
import Dashboard from "./components/dashboard/dashboard";
import Membership from "./components/dashboard/membership";
import Testimonials from "./components/dashboard/testimonials";
import CTASection from "./components/layout/CTASection";
import Login from "./components/auth/Login";
import Footer from "./components/layout/footer";
import Register from "./components/auth/Register";
import Blog from "./components/common/Blog";
import BlogPostForm from "./components/common/BlogPostForm";
import BlogDetail from "./components/common/BlogDetail";
import BXH from "./components/dashboard/BXH";
import About from "./components/common/About";
import Profile from "./components/profile/Profile";
// import ChatSupport from "./components/chat/ChatSupport";
import Payment from "./components/common/Payment";
import FeedbackList from "./components/common/FeedbackList";
import RequireAuth from "./components/auth/RequireAuth";
import ForgotPassword from "./components/auth/ForgotPassword";
import CoachPage from "./components/auth/CoachPage";
import AdminPage from "./components/auth/AdminPage";

function App() {
  // const [showChat, setShowChat] = useState(false);

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
            </>
          }
        />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/create" element={<BlogPostForm />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/bxh" element={<BXH />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route path="/feedbacks" element={<FeedbackList />} />
        <Route path="/forgot-password" element={<ForgotPassword />}/>
         <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coach"
          element={
            <ProtectedRoute allowedRoles={["Coach", "Admin"]}>
              <CoachPage />
            </ProtectedRoute>
          }
        />
        {/* Thêm các route khác nếu cần */}
      </Routes>
      <Footer />
      {/* Nút ẩn/hiện chat */}
    </Router>
  );
}
//
export default App;