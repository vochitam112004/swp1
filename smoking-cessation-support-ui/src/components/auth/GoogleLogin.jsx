import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios.js";
import "../../css/About.css";

const GoogleLoginComponent = () => {
    const navigate = useNavigate();

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
            console.log("Đăng nhập thành công", response.data);
            toast.success("Đăng nhập thành công!");
            localStorage.setItem("authToken", response.data.token);
            navigate("/membership");
        } catch (error) {
            console.error("Lỗi khi gửi ID Token đến backend:", error?.response?.data || error.message);
        }
    };

    return (
        <GoogleOAuthProvider clientId="416297449029-062617cbgu0dmevpbmr91m76gjjhdevu.apps.googleusercontent.com">
            <div className="google-login-container">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                        console.error("Đăng nhập Google thất bại");
                    }}
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginComponent;