import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const coverageOptions = ['Full', 'Tuition', 'Accommodation', 'Partial'];

export default function BursariesPage() {
    const navigate = useNavigate();
    const [bursaries, setBursaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [coverage, setCoverage] = useState('');
    const [deadlineSoon, setDeadlineSoon] = useState(false);

    function fetchBursaries() {
        setLoading(true);
        const params = {};
        if (search) params.searchTerm = search;
        if (coverage) params.coverage = coverage;
        if (deadlineSoon) params.onlyDeadlineSoon = true;
        api.get('/bursary', { params })
            .then(res => setBursaries(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchBursaries();
    }, [coverage, deadlineSoon]);

    function handleSearch(e) {
        e.preventDefault();
        fetchBursaries();
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <h1>Bursaries</h1>
                <p>Browse available bursaries and scholarships</p>
            </div>

            <form onSubmit={handleSearch} style={s.searchRow}>
                <input
                    style={s.searchInput}
                    placeholder="Search by name or provider..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button type="submit" className="btn-primary">Search</button>
            </form>

            <div className="filter-bar">
                <button
                    className={coverage === '' && !deadlineSoon ? 'filter-pill active' : 'filter-pill'}
                    onClick={() => { setCoverage(''); setDeadlineSoon(false); }}
                >
                    All
                </button>
                {coverageOptions.map(c => (
                    <button
                        key={c}
                        className={coverage === c ? 'filter-pill active' : 'filter-pill'}
                        onClick={() => setCoverage(c)}
                    >
                        {c}
                    </button>
                ))}
                <button
                    className={deadlineSoon ? 'filter-pill active' : 'filter-pill'}
                    onClick={() => setDeadlineSoon(!deadlineSoon)}
                >
                    Closing Soon
                </button>
            </div>

            {loading ? (
                <p style={{ color: '#8899bb' }}>Loading bursaries...</p>
            ) : bursaries.length === 0 ? (
                <div className="empty-state">
                    <p>No bursaries found.</p>
                </div>
            ) : (
                <div style={s.list}>
                    {bursaries.map(b => (
                        <BursaryCard
                            key={b.id}
                            bursary={b}
                            onClick={() => navigate('/bursaries/' + b.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function BursaryCard({ bursary, onClick }) {
    const amount = bursary.amount
        ? 'R' + Number(bursary.amount).toLocaleString()
        : 'Varies';

    const deadline = bursary.applicationDeadline
        ? new Date(bursary.applicationDeadline).toLocaleDateString('en-ZA', {
            day: 'numeric', month: 'short', year: 'numeric'
        })
        : null;

    return (
        <div style={s.card} onClick={onClick}>
            <div style={s.cardLeft}>
                <div style={s.logo}>
                    {bursary.provider.slice(0, 3).toUpperCase()}
                </div>
                <div style={s.info}>
                    <div style={s.name}>{bursary.name}</div>
                    <div style={s.provider}>{bursary.provider}</div>
                    <div style={s.metaRow}>
                        {deadline && (
                            <span style={bursary.isDeadlineSoon ? s.deadlineSoon : s.meta}>
                                Closes {deadline}
                            </span>
                        )}
                        {bursary.fieldOfStudy && (
                            <span style={s.meta}>{bursary.fieldOfStudy}</span>
                        )}
                        {bursary.location && (
                            <span style={s.meta}>{bursary.location}</span>
                        )}
                    </div>
                </div>
            </div>
            <div style={s.cardRight}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 16 }}>
                        {bursary.isFavourited ? '❤️' : '🤍'}
                    </span>
                    <div style={s.amount}>{amount}</div>
                </div>
                <div style={s.coverage}>{bursary.coverage || 'Varies'}</div>
                {bursary.isDeadlineSoon && (
                    <div style={s.soonBadge}>Closing soon</div>
                )}
            </div>
        </div>
    );
}

const s = {
    searchRow: {
        display: 'flex',
        gap: 10,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        padding: '10px 14px',
        color: '#e8edf8',
        fontSize: 14,
        outline: 'none',
    },
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
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
    },
    cardLeft: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        flex: 1,
    },
    logo: {
        width: 46,
        height: 46,
        borderRadius: 10,
        background: 'rgba(74,168,255,0.12)',
        color: '#4aa8ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 11,
        flexShrink: 0,
    },
    info: { flex: 1 },
    name: {
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 2,
        color: '#e8edf8',
    },
    provider: {
        fontSize: 12,
        color: '#8899bb',
        marginBottom: 8,
    },
    metaRow: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
    },
    meta: {
        fontSize: 11,
        color: '#8899bb',
    },
    deadlineSoon: {
        fontSize: 11,
        color: '#f25757',
        fontWeight: 600,
    },
    cardRight: {
        textAlign: 'right',
        flexShrink: 0,
    },
    amount: {
        fontSize: 18,
        fontWeight: 700,
        color: '#b8f53c',
        marginBottom: 2,
    },
    coverage: {
        fontSize: 11,
        color: '#8899bb',
        marginBottom: 6,
    },
    soonBadge: {
        background: 'rgba(242,87,87,0.15)',
        color: '#f25757',
        fontSize: 10,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 5,
        display: 'inline-block',
    },
};