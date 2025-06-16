import React from "react";
import UserForm from "../components/auth/UserForm";

const HomePage: React.FC = () => {
    return (
        <div>
            <h1>Trang Chủ</h1>
            <UserForm />
        </div>
    );
};

export default HomePage;