import React, { useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import "../../css/Footer.css";

const UserForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
    });

    const [submittedData, setSubmittedData] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmittedData(formData);
        setFormData({ name: "", email: "", age: "" });
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const idToken = credentialResponse.credential;
            const response = await axios.post("https://your-backend-url/api/auth/google-login", {
                idToken: idToken,
            });
            const user = response.data.user;
            setFormData({
                name: user.name || "",
                email: user.email || "",
                age: "",
            });
        } catch (error) {
            console.error("Error during Google login:", error);
        }
    };

    const handleGoogleError = () => {
        console.error("Google login failed");
    };

    return (
        <div className="user-form-container">
            <form onSubmit={handleSubmit}>
                <h2 className="user-form-title">Nhập Dữ Liệu Người Dùng</h2>
                <div className="user-form-group">
                    <label htmlFor="name">Tên:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="user-form-input"
                    />
                </div>
                <div className="user-form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="user-form-input"
                    />
                </div>
                <div className="user-form-group">
                    <label htmlFor="age">Tuổi:</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        className="user-form-input"
                    />
                </div>
                <button type="submit" className="user-form-button">
                    Gửi
                </button>
            </form>

            <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
                <div className="user-form-google">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                    />
                </div>
            </GoogleOAuthProvider>

            {submittedData && (
                <div className="user-form-result">
                    <h3>Dữ Liệu Đã Nhập:</h3>
                    <p><strong>Tên:</strong> {submittedData.name}</p>
                    <p><strong>Email:</strong> {submittedData.email}</p>
                    <p><strong>Tuổi:</strong> {submittedData.age}</p>
                </div>
            )}
        </div>
    );
};

export default UserForm;