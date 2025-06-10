import { useState, useEffect } from 'react';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (response) => {
        // Handle login with Google response
        const { profileObj } = response;
        setUser(profileObj);
    };

    const logout = () => {
        setUser(null);
    };

    useEffect(() => {
        // Check for existing user session or token
        const existingUser = localStorage.getItem('user');
        if (existingUser) {
            setUser(JSON.parse(existingUser));
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return { user, loading, login, logout };
};

export default useAuth;