import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav style={styles.nav}>
            {/* Logo */}
            <Link to="/" style={styles.logo}>
                <div style={styles.logoIcon}>N</div>
                <span style={styles.logoText}>NextStepUni</span>
            </Link>

            {/* Nav links */}
            <div style={styles.links}>
                {/* Guest links — only show when NOT admin */}
                {!isAdmin && (
                    <>
                        <Link
                            to="/universities"
                            style={isActive('/universities') ? styles.linkActive : styles.link}
                        >
                            Universities
                        </Link>
                        <Link
                            to="/bursaries"
                            style={isActive('/bursaries') ? styles.linkActive : styles.link}
                        >
                            Bursaries
                        </Link>
                    </>
                )}

                {/* Only show when logged in as student */}
                {user && !isAdmin && (
                    <>
                        <Link
                            to="/recommendations"
                            style={isActive('/recommendations') ? styles.linkActive : styles.link}
                        >
                            Recommendations
                        </Link>
                        <Link
                            to="/saved"
                            style={isActive('/saved') ? styles.linkActive : styles.link}
                        >
                            Saved
                        </Link>
                        <Link
                            to="/dashboard"
                            style={isActive('/dashboard') ? styles.linkActive : styles.link}
                        >
                            Dashboard
                        </Link>
                    </>
                )}

                {/* Admin only links */}
                {isAdmin && (
                    <>
                        <Link
                            to="/dashboard"
                            style={isActive('/dashboard') ? styles.linkActive : styles.link}
                        >
                            Overview
                        </Link>
                        <Link
                            to="/admin/universities"
                            style={isActive('/admin/universities') ? styles.linkActive : styles.link}
                        >
                            Universities
                        </Link>
                        <Link
                            to="/admin/faculties"
                            style={isActive('/admin/faculties') ? styles.linkActive : styles.link}
                        >
                            Faculties
                        </Link>
                        <Link
                            to="/admin/bursaries"
                            style={isActive('/admin/bursaries') ? styles.linkActive : styles.link}
                        >
                            Bursaries
                        </Link>
                        <Link
                            to="/admin/students"
                            style={isActive('/admin/students') ? styles.linkActive : styles.link}
                        >
                            Students
                        </Link>
                    </>
                )}
            </div>

            {/* Right side */}
            <div style={styles.right}>
                {user ? (
                    <>
                        {isAdmin ? (
                            <div style={styles.userBadge}>
                                <div style={styles.avatar}>
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                </div>
                                <span style={styles.userName}>
                                    {user.firstName}
                                </span>
                            </div>
                        ) : (
                            <Link to="/profile" style={styles.userBadge}>
                                <div style={styles.avatar}>
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                </div>
                                <span style={styles.userName}>
                                    {user.firstName}
                                </span>
                            </Link>
                        )}
                        <button onClick={handleLogout} style={styles.logoutBtn}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', borderRadius: 10, fontSize: 13 }}>
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '0 32px',
        height: 60,
        background: '#1a2d52',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        textDecoration: 'none',
    },
    logoIcon: {
        width: 32,
        height: 32,
        background: '#b8f53c',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: 16,
        color: '#0f1b35',
    },
    logoText: {
        fontWeight: 700,
        fontSize: 16,
        color: '#e8edf8',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        flex: 1,
    },
    link: {
        padding: '6px 14px',
        borderRadius: 8,
        fontSize: 14,
        color: '#8899bb',
        textDecoration: 'none',
        transition: 'color 0.15s',
    },
    linkActive: {
        padding: '6px 14px',
        borderRadius: 8,
        fontSize: 14,
        color: '#b8f53c',
        textDecoration: 'none',
        fontWeight: 600,
        background: 'rgba(184,245,60,0.08)',
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginLeft: 'auto',
    },
    userBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        textDecoration: 'none',
        padding: '4px 10px',
        borderRadius: 20,
        background: 'rgba(255,255,255,0.05)',
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #4aa8ff, #b8f53c)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 700,
        color: '#0f1b35',
    },
    userName: {
        fontSize: 13,
        color: '#e8edf8',
        fontWeight: 600,
    },
    logoutBtn: {
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        padding: '6px 14px',
        color: '#8899bb',
        fontSize: 13,
        cursor: 'pointer',
    },
};