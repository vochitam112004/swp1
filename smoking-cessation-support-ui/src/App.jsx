import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
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
    </Router>
  );
}

export default App;