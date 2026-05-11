import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function DashboardPage() {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();

    return isAdmin
        ? <AdminDashboard navigate={navigate} />
        : <StudentDashboard navigate={navigate} user={user} />;
}

// ── Student Dashboard ─────────────────────────────────────────
function StudentDashboard({ navigate, user }) {
    const [profile, setProfile] = useState(null);
    const [bursaries, setBursaries] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/student/profile'),
            api.get('/bursary'),
            api.get('/recommendation').catch(() => ({ data: [] })),
        ])
            .then(([profileRes, bursaryRes, recRes]) => {
                setProfile(profileRes.data);
                setBursaries(bursaryRes.data.slice(0, 3));
                setRecommendations(recRes.data.slice(0, 4));
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading">Loading...</div>;

    const results = profile?.latestResults;
    const deadlineSoon = bursaries.filter(b => b.isDeadlineSoon).length;

    return (
        <div className="page-content">
            <div style={s.welcomeRow}>
                <div>
                    <h1 style={s.welcomeTitle}>
                        Welcome back, {user.firstName}
                    </h1>
                    <p style={s.welcomeSub}>
                        Here is your overview for today
                    </p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => navigate('/recommendations')}
                >
                    View Recommendations
                </button>
            </div>

            {/* Stats row */}
            <div style={s.statsRow}>
                <div style={s.statCard}>
                    <div style={s.statVal}>
                        {results ? results.calculatedAps : '--'}
                    </div>
                    <div style={s.statLbl}>APS Score</div>
                    <div style={s.statSub}>
                        {results ? results.uploadType.replace(/([A-Z])/g, ' $1').trim() : 'No results yet'}
                    </div>
                </div>
                <div style={s.statCard}>
                    <div style={{ ...s.statVal, color: '#b8f53c' }}>
                        {results ? results.calculatedAverage + '%' : '--'}
                    </div>
                    <div style={s.statLbl}>Average</div>
                    <div style={s.statSub}>
                        {results ? results.subjects.length + ' subjects' : 'Upload results'}
                    </div>
                </div>
                <div style={s.statCard}>
                    <div style={{ ...s.statVal, color: '#4aa8ff' }}>
                        {recommendations.length}
                    </div>
                    <div style={s.statLbl}>Matches</div>
                    <div style={s.statSub}>Qualifications found</div>
                </div>
                <div style={s.statCard}>
                    <div style={{ ...s.statVal, color: deadlineSoon > 0 ? '#f25757' : '#e8edf8' }}>
                        {deadlineSoon}
                    </div>
                    <div style={s.statLbl}>Deadlines Soon</div>
                    <div style={s.statSub}>Within 30 days</div>
                </div>
            </div>

            {/* No results prompt */}
            {!results && (
                <div style={s.promptCard}>
                    <div style={s.promptIcon}>📋</div>
                    <div>
                        <div style={s.promptTitle}>Upload your subject results</div>
                        <div style={s.promptText}>
                            Add your marks to get personalised university and bursary recommendations
                        </div>
                    </div>
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/profile')}
                    >
                        Go to Profile
                    </button>
                </div>
            )}

            <div style={s.twoCol}>

                {/* Recommendations */}
                <div>
                    <div style={s.sectionHead}>
                        <h2 style={s.sectionTitle}>Top Recommendations</h2>
                        <button style={s.seeAll} onClick={() => navigate('/recommendations')}>
                            See all
                        </button>
                    </div>
                    {recommendations.length === 0 ? (
                        <div style={s.emptyBox}>
                            <p style={{ color: '#8899bb', fontSize: 13 }}>
                                Upload results to see recommendations
                            </p>
                        </div>
                    ) : (
                        recommendations.map((rec, i) => (
                            <div
                                key={i}
                                style={s.recCard}
                                onClick={() => navigate('/universities/' + rec.universityId)}
                            >
                                <div style={s.recLogo}>
                                    {rec.universityAbbreviation ||
                                        rec.universityName.slice(0, 2).toUpperCase()}
                                </div>
                                <div style={s.recInfo}>
                                    <div style={s.recUni}>{rec.universityName}</div>
                                    <div style={s.recQual}>{rec.qualificationName}</div>
                                </div>
                                <div style={{
                                    ...s.recScore,
                                    color: rec.matchScore >= 70
                                        ? '#b8f53c'
                                        : rec.matchScore >= 40
                                            ? '#f5a623'
                                            : '#f25757'
                                }}>
                                    {rec.matchScore}%
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Bursaries */}
                <div>
                    <div style={s.sectionHead}>
                        <h2 style={s.sectionTitle}>Latest Bursaries</h2>
                        <button style={s.seeAll} onClick={() => navigate('/bursaries')}>
                            See all
                        </button>
                    </div>
                    {bursaries.map(b => (
                        <div
                            key={b.id}
                            style={s.bursaryCard}
                            onClick={() => navigate('/bursaries/' + b.id)}
                        >
                            <div style={s.bursaryInfo}>
                                <div style={s.bursaryName}>{b.name}</div>
                                <div style={s.bursaryProvider}>{b.provider}</div>
                            </div>
                            <div style={s.bursaryRight}>
                                <div style={s.bursaryAmount}>
                                    {b.amount ? 'R' + Number(b.amount).toLocaleString() : 'Varies'}
                                </div>
                                {b.isDeadlineSoon && (
                                    <div style={s.soonBadge}>Closing soon</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Admin Dashboard ───────────────────────────────────────────
function AdminDashboard({ navigate }) {
    const [overview, setOverview] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/admin/overview'),
            api.get('/admin/students'),
        ])
            .then(([overviewRes, studentsRes]) => {
                setOverview(overviewRes.data);
                setStudents(studentsRes.data.slice(0, 5));
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="page-content">
            <div style={s.welcomeRow}>
                <div>
                    <h1 style={s.welcomeTitle}>Admin Dashboard</h1>
                    <p style={s.welcomeSub}>System overview</p>
                </div>
            </div>

            {/* Admin stats */}
            <div style={s.statsRow}>
                <div style={s.statCard}>
                    <div style={{ ...s.statVal, color: '#b8f53c' }}>
                        {overview?.totalUniversities}
                    </div>
                    <div style={s.statLbl}>Universities</div>
                </div>
                <div style={s.statCard}>
                    <div style={{ ...s.statVal, color: '#4aa8ff' }}>
                        {overview?.activeBursaries}
                    </div>
                    <div style={s.statLbl}>Active Bursaries</div>
                </div>
                <div style={s.statCard}>
                    <div style={{ ...s.statVal, color: '#f5a623' }}>
                        {overview?.totalStudents}
                    </div>
                    <div style={s.statLbl}>Students</div>
                </div>
                <div style={s.statCard}>
                    <div style={{
                        ...s.statVal,
                        color: overview?.bursariesClosingSoon > 0 ? '#f25757' : '#e8edf8'
                    }}>
                        {overview?.bursariesClosingSoon}
                    </div>
                    <div style={s.statLbl}>Closing Soon</div>
                </div>
            </div>

            {/* Quick actions */}
            <div style={s.sectionHead}>
                <h2 style={s.sectionTitle}>Quick Actions</h2>
            </div>
            <div style={s.actionsRow}>
                <div style={s.actionCard} onClick={() => navigate('/admin/universities')}>
                    <div style={s.actionIcon}>🏫</div>
                    <div style={s.actionLabel}>Manage Universities</div>
                </div>
                <div style={s.actionCard} onClick={() => navigate('/admin/bursaries')}>
                    <div style={s.actionIcon}>💰</div>
                    <div style={s.actionLabel}>Manage Bursaries</div>
                </div>
                <div style={s.actionCard}
                    onClick={() => navigate('/admin/students')}>
                    <div style={s.actionIcon}>👥</div>
                    <div style={s.actionLabel}>
                        {overview?.newStudentsThisWeek} new students this week
                    </div>
                </div>
            </div>

            {/* Recent students */}
            <div style={{ ...s.sectionHead, marginTop: 24 }}>
                <h2 style={s.sectionTitle}>Recent Students</h2>
            </div>
            <div style={s.tableCard}>
                <div style={s.tableHeader}>
                    <span style={s.tableCol}>Name</span>
                    <span style={s.tableCol}>Email</span>
                    <span style={s.tableCol}>Province</span>
                    <span style={s.tableCol}>Average</span>
                    <span style={s.tableCol}>APS</span>
                </div>
                {students.map(student => (
                    <div key={student.id} style={s.tableRow}>
                        <span style={s.tableCol}>
                            {student.firstName} {student.lastName}
                        </span>
                        <span style={{ ...s.tableCol, color: '#8899bb', fontSize: 12 }}>
                            {student.email}
                        </span>
                        <span style={s.tableCol}>
                            {student.province || '--'}
                        </span>
                        <span style={{ ...s.tableCol, color: '#b8f53c', fontWeight: 700 }}>
                            {student.latestAverage ? student.latestAverage + '%' : '--'}
                        </span>
                        <span style={{ ...s.tableCol, fontWeight: 700 }}>
                            {student.latestAps || '--'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const s = {
    welcomeRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    welcomeTitle: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
    welcomeSub: { fontSize: 14, color: '#8899bb' },
    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 14,
        marginBottom: 24,
    },
    statCard: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 20,
    },
    statVal: {
        fontSize: 28,
        fontWeight: 700,
        marginBottom: 4,
    },
    statLbl: {
        fontSize: 13,
        color: '#8899bb',
        marginBottom: 4,
    },
    statSub: { fontSize: 11, color: '#8899bb' },
    promptCard: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: 'rgba(184,245,60,0.06)',
        border: '1px solid rgba(184,245,60,0.2)',
        borderRadius: 14,
        padding: 20,
        marginBottom: 24,
    },
    promptIcon: { fontSize: 32, flexShrink: 0 },
    promptTitle: { fontSize: 15, fontWeight: 700, marginBottom: 4 },
    promptText: { fontSize: 13, color: '#8899bb' },
    twoCol: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
    },
    sectionHead: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    sectionTitle: { fontSize: 16, fontWeight: 700 },
    seeAll: {
        background: 'transparent',
        border: 'none',
        color: '#b8f53c',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
    },
    emptyBox: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 24,
        textAlign: 'center',
    },
    recCard: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        cursor: 'pointer',
    },
    recLogo: {
        width: 40,
        height: 40,
        borderRadius: 9,
        background: 'rgba(184,245,60,0.12)',
        color: '#b8f53c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 12,
        flexShrink: 0,
    },
    recInfo: { flex: 1 },
    recUni: { fontSize: 13, fontWeight: 700, marginBottom: 2 },
    recQual: { fontSize: 12, color: '#4aa8ff' },
    recScore: { fontSize: 18, fontWeight: 700, flexShrink: 0 },
    bursaryCard: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        cursor: 'pointer',
    },
    bursaryInfo: { flex: 1 },
    bursaryName: { fontSize: 13, fontWeight: 700, marginBottom: 2 },
    bursaryProvider: { fontSize: 12, color: '#8899bb' },
    bursaryRight: { textAlign: 'right' },
    bursaryAmount: { fontSize: 15, fontWeight: 700, color: '#b8f53c' },
    soonBadge: {
        background: 'rgba(242,87,87,0.15)',
        color: '#f25757',
        fontSize: 10,
        fontWeight: 600,
        padding: '2px 7px',
        borderRadius: 4,
        display: 'inline-block',
        marginTop: 4,
    },
    actionsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 14,
        marginBottom: 8,
    },
    actionCard: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 20,
        cursor: 'pointer',
        textAlign: 'center',
    },
    actionIcon: { fontSize: 28, marginBottom: 8 },
    actionLabel: { fontSize: 13, fontWeight: 600 },
    tableCard: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        overflow: 'hidden',
    },
    tableHeader: {
        display: 'flex',
        padding: '10px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.03)',
    },
    tableRow: {
        display: 'flex',
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
    },
    tableCol: {
        flex: 1,
        fontSize: 13,
    },
};