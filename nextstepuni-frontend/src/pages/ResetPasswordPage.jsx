import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [form, setForm] = useState({
        token: searchParams.get('token') || '',
        password: '',
        confirm: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!form.token.trim()) {
            setError('Reset token is missing. Please use the link from your email.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (form.password !== form.confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        api.post('/auth/reset-password', {
            token: form.token,
            newPassword: form.password,
        })
            .then(() => setSuccess(true))
            .catch(err => {
                setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
            })
            .finally(() => setLoading(false));
    }

    return (
        <div style={s.wrapper}>
            <div style={s.card}>
                <div style={s.logoRow}>
                    <div style={s.logoIcon}>N</div>
                    <span style={s.logoText}>NextStepUni</span>
                </div>

                {success ? (
                    <div style={s.successBox}>
                        <div style={s.successIcon}>✓</div>
                        <h2 style={s.title}>Password reset</h2>
                        <p style={s.subtitle}>
                            Your password has been updated successfully.
                        </p>
                        <button
                            className="btn-primary"
                            style={{ marginTop: 20, padding: '10px 28px' }}
                            onClick={() => navigate('/login')}
                        >
                            Go to Login
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 style={s.title}>Reset your password</h2>
                        <p style={s.subtitle}>
                            Enter your reset token and choose a new password.
                        </p>

                        <form onSubmit={handleSubmit}>
                            {/* Token field — pre-filled from URL, editable if needed */}
                            <div className="form-group">
                                <label>Reset Token</label>
                                <input
                                    name="token"
                                    value={form.token}
                                    onChange={handleChange}
                                    placeholder="Paste your reset token here"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="At least 6 characters"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirm"
                                    value={form.confirm}
                                    onChange={handleChange}
                                    placeholder="Repeat your new password"
                                    required
                                />
                            </div>

                            {error && <p className="error-msg">{error}</p>}

                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ width: '100%', padding: 12, marginTop: 8 }}
                                disabled={loading}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>

                        <p style={s.footer}>
                            Remembered it?{' '}
                            <Link to="/login" style={s.link}>Back to Login</Link>
                        </p>
                    </>
                )}
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
        maxWidth: 420,
    },
    logoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 28,
        justifyContent: 'center',
    },
    logoIcon: {
        width: 36,
        height: 36,
        background: '#b8f53c',
        borderRadius: 9,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: 18,
        color: '#0f1b35',
    },
    logoText: { fontWeight: 700, fontSize: 18, color: '#e8edf8' },
    title: {
        fontSize: 20,
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#8899bb',
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 1.6,
    },
    successBox: { textAlign: 'center' },
    successIcon: {
        width: 52,
        height: 52,
        background: 'rgba(184,245,60,0.15)',
        color: '#b8f53c',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        fontWeight: 700,
        margin: '0 auto 16px',
    },
    footer: {
        textAlign: 'center',
        marginTop: 24,
        fontSize: 13,
        color: '#8899bb',
    },
    link: { color: '#b8f53c', fontWeight: 600 },
};