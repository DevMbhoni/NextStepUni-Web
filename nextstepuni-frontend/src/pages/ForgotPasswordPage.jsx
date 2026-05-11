import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        api.post('/auth/forgot-password', { email })
            .then(() => setSubmitted(true))
            .catch(err => {
                setError(err.response?.data?.message || 'Something went wrong.');
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

                {submitted ? (
                    <div style={s.successBox}>
                        <div style={s.successIcon}>✓</div>
                        <h2 style={s.title}>Check your email</h2>
                        <p style={s.subtitle}>
                            If an account exists for {email}, a password reset
                            link has been sent. Check your inbox and spam folder.
                        </p>
                        <Link to="/login" style={s.backLink}>
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <>
                        <h2 style={s.title}>Forgot your password?</h2>
                        <p style={s.subtitle}>
                            Enter your email address and we will send you
                            a link to reset your password.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Email address</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
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
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>

                        <p style={s.footer}>
                            Remember your password?{' '}
                            <Link to="/login" style={s.link}>Log in here</Link>
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
    backLink: {
        display: 'inline-block',
        marginTop: 20,
        color: '#b8f53c',
        fontWeight: 600,
        fontSize: 14,
    },
    footer: {
        textAlign: 'center',
        marginTop: 24,
        fontSize: 13,
        color: '#8899bb',
    },
    link: { color: '#b8f53c', fontWeight: 600 },
};