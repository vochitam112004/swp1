import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";

const LoginPage: React.FC = () => {
    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            const idToken = credentialResponse.credential;

            // Gửi idToken đến backend
            const response = await axios.post("https://your-backend-url/api/auth/google-login", {
                idToken: idToken,
            });

            console.log("Login successful", response.data);
            // Lưu thông tin người dùng hoặc token vào state/localStorage
        } catch (error) {
            console.error("Error during Google login:", error);
        }
    };

    return (
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <div>
                <h2>Đăng nhập</h2>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                        console.log("Đăng nhập Google thất bại");
                    }}
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default LoginPage;