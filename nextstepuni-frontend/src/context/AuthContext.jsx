import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On app load, check if a token is already saved
    // This keeps the user logged in after a page refresh
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const isAdmin = user?.role === 'Admin';
    const isStudent = user?.role === 'Student';
    const isGuest = !user;

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin, isStudent, isGuest, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook so any component can access auth state
// with just: const { user, login, logout } = useAuth();
export function useAuth() {
    return useContext(AuthContext);
}