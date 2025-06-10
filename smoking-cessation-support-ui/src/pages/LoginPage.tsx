import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const LoginPage: React.FC = () => {
    return (
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <div>
                <h2>Đăng nhập</h2>
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        console.log(credentialResponse);
                        // Xử lý đăng nhập thành công ở đây
                    }}
                    onError={() => {
                        console.log("Đăng nhập Google thất bại");
                    }}
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default LoginPage;