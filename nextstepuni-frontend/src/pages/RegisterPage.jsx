import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function EyeIcon({ open }) {
    return open ? (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ) : (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );
}

export default function RegisterPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', password: '', confirm: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (form.password !== form.confirm) {
            setError('Passwords do not match.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                password: form.password,
            });
            login({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                role: data.role,
            }, data.token);
            navigate('/universities');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={s.wrapper}>
            <div style={s.card}>
                <div style={s.logoRow}>
                    <div style={s.logoIcon}>N</div>
                    <span style={s.logoText}>NextStepUni</span>
                </div>

                <h2 style={s.title}>Create your account</h2>
                <p style={s.subtitle}>Start discovering universities and bursaries</p>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>First name</label>
                            <input
                                name="firstName"
                                placeholder="Tiddo"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Last name</label>
                            <input
                                name="lastName"
                                placeholder="Mbhoni"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div style={s.inputWrap}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="At least 6 characters"
                                value={form.password}
                                onChange={handleChange}
                                required
                                style={s.inputWithIcon}
                            />
                            <button
                                type="button"
                                style={s.eyeBtn}
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                <EyeIcon open={showPassword} />
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirm password</label>
                        <div style={s.inputWrap}>
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                name="confirm"
                                placeholder="Repeat your password"
                                value={form.confirm}
                                onChange={handleChange}
                                required
                                style={s.inputWithIcon}
                            />
                            <button
                                type="button"
                                style={s.eyeBtn}
                                onClick={() => setShowConfirm(!showConfirm)}
                                tabIndex={-1}
                            >
                                <EyeIcon open={showConfirm} />
                            </button>
                        </div>
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', marginTop: 8, padding: 12 }}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p style={s.footer}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#b8f53c', fontWeight: 600 }}>
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
}

const s = {
    wrapper: {
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    card: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 460,
    },
    logoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 28,
        justifyContent: 'center',
    },
    logoIcon: {
        width: 36, height: 36,
        background: '#b8f53c', borderRadius: 9,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 900, fontSize: 18, color: '#0f1b35',
    },
    logoText: { fontWeight: 700, fontSize: 18, color: '#e8edf8' },
    title: { fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 6 },
    subtitle: { fontSize: 14, color: '#8899bb', textAlign: 'center', marginBottom: 28 },
    inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
    inputWithIcon: {
        width: '100%',
        background: '#1a2d52',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        padding: '10px 44px 10px 14px',
        color: '#e8edf8',
        fontSize: 14,
        outline: 'none',
    },
    eyeBtn: {
        position: 'absolute',
        right: 12,
        background: 'transparent',
        border: 'none',
        color: '#8899bb',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        padding: 0,
    },
    footer: { textAlign: 'center', marginTop: 24, fontSize: 13, color: '#8899bb' },
};