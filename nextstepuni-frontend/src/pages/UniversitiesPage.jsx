import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const provinces = [
    'Limpopo', 'Gauteng', 'Western Cape', 'Eastern Cape',
    'KwaZulu-Natal', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape'
];

export default function UniversitiesPage() {
    const navigate = useNavigate();
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [province, setProvince] = useState('');

    const fetchUniversities = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.searchTerm = search;
            if (province) params.province = province;
            const { data } = await api.get('/university', { params });
            setUniversities(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUniversities();
    }, [province]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUniversities();
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <h1>Universities</h1>
                <p>Browse and filter South African universities</p>
            </div>

            <form onSubmit={handleSearch} style={styles.searchRow}>
                <input
                    style={styles.searchInput}
                    placeholder="Search by name or city..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="btn-primary">
                    Search
                </button>
            </form>

            <div className="filter-bar">
                <button
                    className={province === '' ? 'filter-pill active' : 'filter-pill'}
                    onClick={() => setProvince('')}
                >
                    All
                </button>
                {provinces.map((p) => (
                    <button
                        key={p}
                        className={province === p ? 'filter-pill active' : 'filter-pill'}
                        onClick={() => setProvince(p)}
                    >
                        {p}
                    </button>
                ))}
            </div>

            {loading ? (
                <p style={{ color: '#8899bb' }}>Loading universities...</p>
            ) : universities.length === 0 ? (
                <div className="empty-state">
                    <p>No universities found.</p>
                </div>
            ) : (
                <div className="card-grid">
                    {universities.map((uni) => (
                        <UniCard
                            key={uni.id}
                            uni={uni}
                            onClick={() => navigate('/universities/' + uni.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function UniCard({ uni, onClick }) {
    const abbr = uni.abbreviation
        ? uni.abbreviation
        : uni.name.slice(0, 2).toUpperCase();

    const fees = uni.annualFeesFrom
        ? 'R' + Number(uni.annualFeesFrom).toLocaleString()
        : 'N/A';

    return (
        <div style={styles.card} onClick={onClick}>
            <div style={styles.cardTop}>
                <div style={styles.logo}>{abbr}</div>
                <div style={styles.uniInfo}>
                    <div style={styles.uniName}>{uni.name}</div>
                    <div style={styles.uniLocation}>
                        {uni.city}, {uni.province}
                    </div>
                </div>
                <span style={{ fontSize: 18 }}>
                    {uni.isFavourited ? '❤️' : '🤍'}
                </span>
            </div>

            <div style={styles.statsRow}>
                <div style={styles.stat}>
                    <div style={styles.statVal}>{fees}</div>
                    <div style={styles.statLbl}>Fees/year</div>
                </div>
                <div style={styles.stat}>
                    <div style={styles.statVal}>{uni.province}</div>
                    <div style={styles.statLbl}>Province</div>
                </div>
            </div>
        </div>
    );
}

const styles = {
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
    card: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 18,
        cursor: 'pointer',
    },
    cardTop: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 14,
    },
    logo: {
        width: 44,
        height: 44,
        borderRadius: 10,
        background: 'rgba(184,245,60,0.12)',
        color: '#b8f53c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 13,
        flexShrink: 0,
    },
    uniInfo: {
        flex: 1,
    },
    uniName: {
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 3,
        color: '#e8edf8',
    },
    uniLocation: {
        fontSize: 12,
        color: '#8899bb',
    },
    statsRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        paddingTop: 12,
        borderTop: '1px solid rgba(255,255,255,0.06)',
    },
    stat: {
        textAlign: 'center',
    },
    statVal: {
        fontSize: 13,
        fontWeight: 700,
        color: '#e8edf8',
    },
    statLbl: {
        fontSize: 10,
        color: '#8899bb',
        marginTop: 2,
    },
};