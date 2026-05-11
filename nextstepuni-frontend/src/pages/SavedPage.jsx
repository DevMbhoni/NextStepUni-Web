import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function SavedPage() {
    const navigate = useNavigate();
    const [savedUnis, setSavedUnis] = useState([]);
    const [savedBursaries, setSavedBursaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('universities');

    useEffect(() => {
        Promise.all([
            api.get('/university'),
            api.get('/bursary'),
        ])
            .then(([uniRes, bursaryRes]) => {
                setSavedUnis(uniRes.data.filter(u => u.isFavourited));
                setSavedBursaries(bursaryRes.data.filter(b => b.isFavourited));
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    function handleUnsaveUni(id) {
        api.post('/university/' + id + '/favourite')
            .then(() => setSavedUnis(prev => prev.filter(u => u.id !== id)))
            .catch(err => console.error(err));
    }

    function handleUnsaveBursary(id) {
        api.post('/bursary/' + id + '/favourite')
            .then(() => setSavedBursaries(prev => prev.filter(b => b.id !== id)))
            .catch(err => console.error(err));
    }

    if (loading) return <div className="loading">Loading saved items...</div>;

    return (
        <div className="page-content">
            <div className="page-header">
                <h1>Saved</h1>
                <p>Your saved universities and bursaries</p>
            </div>

            {/* Tabs */}
            <div style={s.tabs}>
                <button
                    style={tab === 'universities' ? s.tabActive : s.tab}
                    onClick={() => setTab('universities')}
                >
                    Universities ({savedUnis.length})
                </button>
                <button
                    style={tab === 'bursaries' ? s.tabActive : s.tab}
                    onClick={() => setTab('bursaries')}
                >
                    Bursaries ({savedBursaries.length})
                </button>
            </div>

            {/* Universities tab */}
            {tab === 'universities' && (
                <div>
                    {savedUnis.length === 0 ? (
                        <div style={s.emptyBox}>
                            <div style={s.emptyIcon}>🏫</div>
                            <p style={s.emptyTitle}>No saved universities</p>
                            <p style={s.emptyText}>
                                Browse universities and click Save to add them here
                            </p>
                            <button
                                className="btn-primary"
                                style={{ marginTop: 16 }}
                                onClick={() => navigate('/universities')}
                            >
                                Browse Universities
                            </button>
                        </div>
                    ) : (
                        <div style={s.list}>
                            {savedUnis.map(uni => (
                                <div key={uni.id} style={s.card}>
                                    <div style={s.cardLeft}>
                                        <div style={s.logo}>
                                            {uni.abbreviation || uni.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div style={s.info}>
                                            <div style={s.name}>{uni.name}</div>
                                            <div style={s.sub}>{uni.city}, {uni.province}</div>
                                            {uni.annualFeesFrom && (
                                                <div style={s.meta}>
                                                    Fees from R{Number(uni.annualFeesFrom).toLocaleString()}/yr
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={s.cardActions}>
                                        <button
                                            style={s.viewBtn}
                                            onClick={() => navigate('/universities/' + uni.id)}
                                        >
                                            View
                                        </button>
                                        <button
                                            style={s.removeBtn}
                                            onClick={() => handleUnsaveUni(uni.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Bursaries tab */}
            {tab === 'bursaries' && (
                <div>
                    {savedBursaries.length === 0 ? (
                        <div style={s.emptyBox}>
                            <div style={s.emptyIcon}>💰</div>
                            <p style={s.emptyTitle}>No saved bursaries</p>
                            <p style={s.emptyText}>
                                Browse bursaries and click Save to add them here
                            </p>
                            <button
                                className="btn-primary"
                                style={{ marginTop: 16 }}
                                onClick={() => navigate('/bursaries')}
                            >
                                Browse Bursaries
                            </button>
                        </div>
                    ) : (
                        <div style={s.list}>
                            {savedBursaries.map(b => (
                                <div key={b.id} style={s.card}>
                                    <div style={s.cardLeft}>
                                        <div style={{ ...s.logo, background: 'rgba(74,168,255,0.12)', color: '#4aa8ff' }}>
                                            {b.provider.slice(0, 3).toUpperCase()}
                                        </div>
                                        <div style={s.info}>
                                            <div style={s.name}>{b.name}</div>
                                            <div style={s.sub}>{b.provider}</div>
                                            <div style={s.meta}>
                                                {b.amount
                                                    ? 'R' + Number(b.amount).toLocaleString()
                                                    : 'Amount varies'}
                                                {b.coverage ? ' • ' + b.coverage : ''}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={s.cardActions}>
                                        <button
                                            style={s.viewBtn}
                                            onClick={() => navigate('/bursaries/' + b.id)}
                                        >
                                            View
                                        </button>
                                        <button
                                            style={s.removeBtn}
                                            onClick={() => handleUnsaveBursary(b.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

const s = {
    tabs: {
        display: 'flex',
        gap: 8,
        marginBottom: 24,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: 0,
    },
    tab: {
        background: 'transparent',
        border: 'none',
        borderBottom: '2px solid transparent',
        padding: '10px 20px',
        color: '#8899bb',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        marginBottom: -1,
    },
    tabActive: {
        background: 'transparent',
        border: 'none',
        borderBottom: '2px solid #b8f53c',
        padding: '10px 20px',
        color: '#b8f53c',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        marginBottom: -1,
    },
    emptyBox: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 48,
        textAlign: 'center',
    },
    emptyIcon: { fontSize: 40, marginBottom: 12 },
    emptyTitle: { fontSize: 17, fontWeight: 700, marginBottom: 8 },
    emptyText: { fontSize: 14, color: '#8899bb' },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
    },
    card: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },
    cardLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flex: 1,
    },
    logo: {
        width: 46,
        height: 46,
        borderRadius: 10,
        background: 'rgba(184,245,60,0.12)',
        color: '#b8f53c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 12,
        flexShrink: 0,
    },
    info: { flex: 1 },
    name: { fontSize: 14, fontWeight: 700, marginBottom: 2 },
    sub: { fontSize: 12, color: '#8899bb', marginBottom: 4 },
    meta: { fontSize: 12, color: '#b8f53c', fontWeight: 600 },
    cardActions: {
        display: 'flex',
        gap: 8,
        flexShrink: 0,
    },
    viewBtn: {
        background: 'rgba(74,168,255,0.12)',
        border: '1px solid rgba(74,168,255,0.3)',
        borderRadius: 8,
        padding: '7px 16px',
        color: '#4aa8ff',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
    },
    removeBtn: {
        background: 'rgba(242,87,87,0.1)',
        border: '1px solid rgba(242,87,87,0.3)',
        borderRadius: 8,
        padding: '7px 16px',
        color: '#f25757',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
    },
};