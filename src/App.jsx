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
import BlogDetail from "./components/common/BlogDetail";
import BXH from "./components/dashboard/BXH";
import About from "./components/common/About";
import ProfileTabs from "./components/profile/ProfileTabs";
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
import CoachList from "./components/common/CoachList";
import ScrollToTop from "./components/common/ScrollToTop";
import Developers from "./components/common/Developers";
import Chuyengia from "./components/common/Chuyengia";
import Researchers from "./components/common/researchers";
import ChatSupport from "./components/chat/ChatSupport";
import PaymentCallback from "./components/common/PaymentCallback";
import { UserProvider } from "./contexts/UserContext";
import { useState } from "react";

function AppContent() {
  const location = useLocation();
  const isSpecialRoute = location.pathname.startsWith("/admin") || location.pathname === "/coach";
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
          <Route path="/coaches" element={<CoachList />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/create" element={<BlogPostForm />} />
          <Route path="/blog/:postId" element={<BlogDetail />} />
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
          <Route path="/payment-callback" element={<PaymentCallback />} />
          <Route path="/about" element={<About />} />
          <Route path="/chuyengia" element={<Chuyengia />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/researchers" element={<Researchers />} />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfileTabs />
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
          {/* Catch-all route for 404 - must be last */}
          <Route path="*" element={
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '60vh',
              textAlign: 'center'
            }}>
              <h1 style={{ fontSize: '3rem', color: '#666', marginBottom: '1rem' }}>404</h1>
              <h2 style={{ color: '#888', marginBottom: '2rem' }}>Trang không tìm thấy</h2>
              <p style={{ color: '#999', marginBottom: '2rem' }}>
                Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
              </p>
              <button 
                onClick={() => window.location.href = '/'}
                style={{
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Về trang chủ
              </button>
            </div>
          } />
        </Routes>
      </div>

      {!isSpecialRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </UserProvider>
  );
}
export default App;
