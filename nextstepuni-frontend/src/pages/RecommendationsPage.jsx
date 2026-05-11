import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function RecommendationsPage() {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/recommendation')
            .then(res => setRecommendations(res.data))
            .catch(err => {
                if (err.response?.status === 404 || err.response?.status === 400) {
                    setError('Upload your subject results on the Profile page to get recommendations.');
                } else {
                    setError('Failed to load recommendations.');
                }
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading">Loading recommendations...</div>;

    return (
        <div className="page-content">
            <div className="page-header">
                <h1>Recommendations</h1>
                <p>Universities and qualifications matched to your subject results</p>
            </div>

            {error && (
                <div style={s.emptyCard}>
                    <div style={s.emptyIcon}>📋</div>
                    <p style={s.emptyTitle}>No recommendations yet</p>
                    <p style={s.emptyText}>{error}</p>
                    <button
                        className="btn-primary"
                        style={{ marginTop: 16 }}
                        onClick={() => navigate('/profile')}
                    >
                        Upload Results
                    </button>
                </div>
            )}

            {!error && recommendations.length === 0 && (
                <div style={s.emptyCard}>
                    <div style={s.emptyIcon}>🎓</div>
                    <p style={s.emptyTitle}>No matches found</p>
                    <p style={s.emptyText}>
                        We could not find qualifications matching your results.
                        Try uploading more complete results on your profile.
                    </p>
                </div>
            )}

            {recommendations.map((rec, i) => (
                <div key={i} style={s.card}>
                    <div style={s.cardHeader}>
                        <div style={s.logo}>
                            {rec.universityAbbreviation || rec.universityName.slice(0, 2).toUpperCase()}
                        </div>
                        <div style={s.headerInfo}>
                            <div style={s.uniName}>{rec.universityName}</div>
                            <div style={s.location}>{rec.city}, {rec.province}</div>
                            <div style={s.qualName}>{rec.qualificationName}</div>
                            <div style={s.faculty}>{rec.facultyName}</div>
                        </div>
                        <div style={s.scoreBox}>
                            <div style={{
                                ...s.score,
                                color: rec.matchScore >= 70
                                    ? '#b8f53c'
                                    : rec.matchScore >= 40
                                        ? '#f5a623'
                                        : '#f25757'
                            }}>
                                {rec.matchScore}%
                            </div>
                            <div style={s.scoreLbl}>Match</div>
                        </div>
                    </div>

                    <div style={s.tagsRow}>
                        {rec.minimumAps && (
                            <span style={rec.meetsApsRequirement ? s.tagGreen : s.tagRed}>
                                APS {rec.studentApsForThisUniversity} / {rec.minimumAps} required
                            </span>
                        )}
                        {rec.durationYears && (
                            <span style={s.tagBlue}>{rec.durationYears} years</span>
                        )}
                        {rec.annualFeesFrom && (
                            <span style={s.tagBlue}>
                                R{Number(rec.annualFeesFrom).toLocaleString()}/yr
                            </span>
                        )}
                    </div>

                    {rec.subjectMatches && rec.subjectMatches.length > 0 && (
                        <div style={s.subjectSection}>
                            <div style={s.subjectTitle}>Subject Match</div>
                            {rec.subjectMatches.map((sub, j) => (
                                <div key={j} style={s.subjectRow}>
                                    <span style={s.subjectName}>{sub.subjectName}</span>
                                    <span style={s.subjectRequired}>
                                        Required: {sub.requiredPercentage}%
                                    </span>
                                    <span style={s.subjectYours}>
                                        Yours: {sub.studentPercentage}%
                                    </span>
                                    <span style={sub.isMet ? s.met : s.notMet}>
                                        {sub.isMet ? 'Met' : 'Not met'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={s.cardFooter}>
                        <button
                            style={s.viewBtn}
                            onClick={() => navigate('/universities/' + rec.universityId)}
                        >
                            View University
                        </button>
                        {rec.applicationLink && (
                            <a
                            href = { rec.applicationLink }
                            target="_blank"
                            rel="noreferrer"
                            className="btn-primary"
                            style={{ padding: '8px 18px', fontSize: 13 }}
                            >
                            Apply Now
                            </a>
                        )}
                </div>
        </div>
    ))
}
    </div >
  );
}

const s = {
    emptyCard: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 40,
        textAlign: 'center',
    },
    emptyIcon: { fontSize: 40, marginBottom: 12 },
    emptyTitle: { fontSize: 17, fontWeight: 700, marginBottom: 8 },
    emptyText: { fontSize: 14, color: '#8899bb' },
    card: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 20,
        marginBottom: 16,
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        marginBottom: 14,
    },
    logo: {
        width: 52,
        height: 52,
        borderRadius: 12,
        background: 'rgba(184,245,60,0.12)',
        color: '#b8f53c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 14,
        flexShrink: 0,
    },
    headerInfo: { flex: 1 },
    uniName: { fontSize: 15, fontWeight: 700, marginBottom: 2 },
    location: { fontSize: 12, color: '#8899bb', marginBottom: 6 },
    qualName: { fontSize: 14, fontWeight: 600, color: '#4aa8ff' },
    faculty: { fontSize: 12, color: '#8899bb' },
    scoreBox: { textAlign: 'center', flexShrink: 0 },
    score: { fontSize: 26, fontWeight: 700 },
    scoreLbl: { fontSize: 11, color: '#8899bb' },
    tagsRow: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 14,
    },
    tagGreen: {
        padding: '3px 10px',
        borderRadius: 5,
        fontSize: 11,
        fontWeight: 600,
        background: 'rgba(184,245,60,0.15)',
        color: '#b8f53c',
    },
    tagRed: {
        padding: '3px 10px',
        borderRadius: 5,
        fontSize: 11,
        fontWeight: 600,
        background: 'rgba(242,87,87,0.15)',
        color: '#f25757',
    },
    tagBlue: {
        padding: '3px 10px',
        borderRadius: 5,
        fontSize: 11,
        fontWeight: 600,
        background: 'rgba(74,168,255,0.15)',
        color: '#4aa8ff',
    },
    subjectSection: {
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 10,
        padding: 14,
        marginBottom: 14,
    },
    subjectTitle: {
        fontSize: 11,
        fontWeight: 600,
        color: '#8899bb',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: 10,
    },
    subjectRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '5px 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        fontSize: 13,
    },
    subjectName: { flex: 1, fontWeight: 600 },
    subjectRequired: { color: '#8899bb', fontSize: 12 },
    subjectYours: { color: '#e8edf8', fontSize: 12, fontWeight: 600 },
    met: {
        color: '#b8f53c',
        fontSize: 11,
        fontWeight: 700,
        background: 'rgba(184,245,60,0.12)',
        padding: '1px 7px',
        borderRadius: 4,
    },
    notMet: {
        color: '#f25757',
        fontSize: 11,
        fontWeight: 700,
        background: 'rgba(242,87,87,0.12)',
        padding: '1px 7px',
        borderRadius: 4,
    },
    cardFooter: {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        paddingTop: 14,
        borderTop: '1px solid rgba(255,255,255,0.06)',
    },
    viewBtn: {
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 9,
        padding: '8px 18px',
        color: '#e8edf8',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
    },
};