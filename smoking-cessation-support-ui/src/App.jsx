import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Unauthorized from "./components/auth/Unauthorized";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navigation from "./components/layout/navigation";
import HeroSection from "./components/layout/heroSection";
import StatsSection from "./components/dashboard/statsSection";
import FeaturesSection from "./components/dashboard/featuresSection";
import Dashboard from "./components/dashboard/dashboard";
import Testimonials from "./components/dashboard/testimonials";
import CTASection from "./components/layout/CTASection";
import Login from "./components/auth/Login";
import Footer from "./components/layout/footer";
import Register from "./components/auth/Register";
import Blog from "./components/common/Blog";
import BlogPostForm from "./components/common/BlogPostForm";
import BXH from "./components/dashboard/BXH";
import About from "./components/common/About";
import Profile from "./components/profile/Profile";
import Payment from "./components/common/Payment";
import RequireAuth from "./components/auth/RequireAuth";
import ForgotPassword from "./components/auth/ForgotPassword";
import CoachPage from "./components/coach/CoachPage";
import AdminPage from "./components/admin/AdminPage";
import Contact from "./components/common/Contact";
import Methodology from "./components/common/Methodology";
import Research from "./components/common/Research";
import FAQ from "./components/common/FAQ";
import MembershipList from "./components/dashboard/membership";
import ResearchDetail from "./components/common/ResearchDetail";
import ScrollToTop from "./components/common/ScrollToTop";
import Developers from "./components/common/Developers";
import Chuyengia from "./components/common/chuyengia";
import Researchers from "./components/common/Researchers";
import ChatSupport from "./components/chat/ChatSupport";
import MomoCallback from "./components/common/MomoCallback";
import { useState } from "react";

function AppContent() {
  const location = useLocation();
  const isSpecialRoute = location.pathname.startsWith("/admin") || location.pathname.startsWith("/coach");
  const [showChat, setShowChat] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!isSpecialRoute && <Navigation />}

      <div style={{ flex: 1 }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <StatsSection />
                <FeaturesSection />
                <Dashboard />
                <Testimonials />
                <CTASection />
                <button
                  style={{
                    position: "fixed",
                    bottom: 32,
                    right: 32,
                    zIndex: 9999,
                    borderRadius: "50%",
                    width: 56,
                    height: 56,
                    background: "#1976d2",
                    color: "#fff",
                    border: "none",
                    boxShadow: "0 2px 8px #0002",
                    fontSize: 28,
                    cursor: "pointer",
                  }}
                  onClick={() => setShowChat(true)}
                  aria-label="Hỗ trợ chat"
                >
                  <i className="fas fa-comments"></i>
                </button>
                {showChat && (
                  <div style={{
                    position: "fixed",
                    bottom: 100,
                    right: 32,
                    zIndex: 10000,
                    width: 350,
                    maxWidth: "90vw",
                  }}>
                    <ChatSupport onClose={() => setShowChat(false)} />
                  </div>
                )}
              </>
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/research" element={<Research />} />
          <Route path="/research/:id" element={<ResearchDetail />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/create" element={<BlogPostForm />} />
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
          <Route path="/membership" element={<MembershipList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/momo-callback" element={<MomoCallback />} />
          <Route path="/about" element={<About />} />
          <Route path="/chuyengia" element={<Chuyengia />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/researchers" element={<Researchers />} />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
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
        </Routes>
      </div>

      {!isSpecialRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}
export default App;
