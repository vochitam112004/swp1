import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GoogleLoginComponent: React.FC = () => {
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse: any) => {
        const idToken = credentialResponse?.credential;

        if (!idToken) {
            console.error("Không nhận được ID Token từ Google");
            return;
        }

        try {
            const response = await axios.post("https://d336-118-69-182-144.ngrok-free.app/api/auth/google-login", {
                idToken: idToken,
            });

            console.log("Đăng nhập thành công", response.data);

            // Lưu token vào localStorage nếu cần
            localStorage.setItem("authToken", response.data.token);

            // Chuyển hướng sang trang user/profile
            navigate("/loginPage");
        } catch (error: any) {
            console.error("Lỗi khi gửi ID Token đến backend:", error?.response?.data || error.message);
        }
    };

    return (
        <GoogleOAuthProvider clientId="416297449029-062617cbgu0dmevpbmr91m76gjjhdevu.apps.googleusercontent.com">
            <div style={{ textAlign: "center", margin: "0 auto", width:"50%" }}>
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