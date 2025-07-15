import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios.js";
import "../../css/Footer.css";
import { useAuth } from "./AuthContext.jsx";

const GoogleLoginComponent = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      console.error("Không nhận được ID Token từ Google");
      return;
    }

    try {
      const loginRes = await api.post("/Auth/google-login", { idToken });
      const token = loginRes.data.token;
      const userFromLogin = loginRes.data.user;

      if (!token || !userFromLogin) {
        toast.error("Đăng nhập thất bại!");
        return;
      }

      const userData = {
        id: userFromLogin.userId,
        username: userFromLogin.username,
        displayName: userFromLogin.displayName,
        email: userFromLogin.email,
        avatar: userFromLogin.avatarUrl,
        userType: userFromLogin.userType,
        createdAt: userFromLogin.createdAt,
        token: token,
      };

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // 🔍 GỌI API kiểm tra membership
      try {
        const membershipRes = await api.get("/UserMemberShipHistory/my-history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const activeMembership = membershipRes.data.find(p => p.status === "active");
        if (activeMembership) {
          localStorage.setItem("membership", JSON.stringify(activeMembership));
        } else {
          localStorage.removeItem("membership");
        }
      } catch (membershipErr) {
        console.error("Không thể lấy lịch sử membership", membershipErr);
        localStorage.removeItem("membership");
      }

      login(userData);
      toast.success("Đăng nhập thành công!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Lỗi khi đăng nhập Google:", error?.response?.data || error.message);
      toast.error("Đăng nhập Google thất bại!");
    }
  };

  return (
    <GoogleOAuthProvider clientId="416297449029-062617cbgu0dmevpbmr91m76gjjhdevu.apps.googleusercontent.com">
      <div className="google-login-container">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            toast.error("Đăng nhập Google thất bại!");
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;
