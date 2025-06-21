import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios.js";
import "../../css/About.css";
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
            const response = await api.post("/Auth/google-login", {
                idToken: idToken,
            });

            const userData = {
                id: response.data.id,
                userId: response.data.userId || response.data.id,
                username: response.data.username || "Google User",
                avatar: response.data.avatar || null,
                token: response.data.token || null,
            };

            localStorage.setItem("authToken", response.data.token);
            localStorage.setItem("user", JSON.stringify(userData));
            login(userData); // <<< Thêm dòng này

            toast.success("Đăng nhập thành công!");
            navigate("/membership");
        } catch (error) {
            console.error("Lỗi khi gửi ID Token đến backend:", error?.response?.data || error.message);
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