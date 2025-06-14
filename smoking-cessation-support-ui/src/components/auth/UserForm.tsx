import React, { useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";

const UserForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
    });

    const [submittedData, setSubmittedData] = useState<any>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittedData(formData); // Save entered data to state
        setFormData({ name: "", email: "", age: "" }); // Reset form
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            const idToken = credentialResponse.credential;

            // Send idToken to backend
            const response = await axios.post("https://your-backend-url/api/auth/google-login", {
                idToken: idToken,
            });

            console.log("Login successful", response.data);

            // Update form data with user info from backend response
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
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <form onSubmit={handleSubmit}>
                <h2>Nhập Dữ Liệu Người Dùng</h2>
                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="name">Tên:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="age">Tuổi:</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#007BFF",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Gửi
                </button>
            </form>

            <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                    />
                </div>
            </GoogleOAuthProvider>

            {submittedData && (
                <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
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