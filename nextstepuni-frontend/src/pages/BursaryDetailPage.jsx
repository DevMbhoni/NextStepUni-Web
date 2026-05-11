import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function BursaryDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [bursary, setBursary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavourited, setIsFavourited] = useState(false);

    useEffect(() => {
        api.get('/bursary/' + id)
            .then(res => {
                setBursary(res.data);
                setIsFavourited(res.data.isFavourited);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    function handleFavourite() {
        if (!user) {
            navigate('/login');
            return;
        }
        api.post('/bursary/' + id + '/favourite')
            .then(res => setIsFavourited(res.data.isFavourited))
            .catch(err => {
                if (err.response?.status === 401) {
                    navigate('/login');
                } else {
                    console.error(err);
                }
            });
    }

    if (loading) return <div className="loading">Loading...</div>;
    if (!bursary) return <div className="page-content"><p>Bursary not found.</p></div>;

    const deadline = bursary.applicationDeadline
        ? new Date(bursary.applicationDeadline).toLocaleDateString('en-ZA', {
            day: 'numeric', month: 'long', year: 'numeric'
        })
        : null;

    return (
        <div className="page-content">

            <button onClick={() => navigate('/bursaries')} style={s.backBtn}>
                Back to Bursaries
            </button>

            <div style={s.header}>
                <div style={s.logo}>
                    {bursary.provider.slice(0, 3).toUpperCase()}
                </div>
                <div style={s.headerInfo}>
                    <h1 style={s.title}>{bursary.name}</h1>
                    <p style={s.provider}>{bursary.provider}</p>
                    {bursary.description && (
                        <p style={s.desc}>{bursary.description}</p>
                    )}
                </div>
                <button
                    onClick={handleFavourite}
                    style={isFavourited ? s.heartOn : s.heartOff}
                    title={isFavourited ? 'Remove from saved' : 'Save bursary'}
                >
                    {isFavourited ? '❤️' : '🤍'}
                </button>
            </div>

            <div style={s.infoRow}>
                {bursary.amount && (
                    <div style={s.infoCard}>
                        <div style={{ ...s.infoVal, color: '#b8f53c' }}>
                            R{Number(bursary.amount).toLocaleString()}
                        </div>
                        <div style={s.infoLbl}>Bursary amount</div>
                    </div>
                )}
                {bursary.coverage && (
                    <div style={s.infoCard}>
                        <div style={s.infoVal}>{bursary.coverage}</div>
                        <div style={s.infoLbl}>Coverage</div>
                    </div>
                )}
                {deadline && (
                    <div style={s.infoCard}>
                        <div style={{
                            ...s.infoVal,
                            color: bursary.isDeadlineSoon ? '#f25757' : '#e8edf8'
                        }}>
                            {deadline}
                        </div>
                        <div style={s.infoLbl}>Application deadline</div>
                    </div>
                )}
                {bursary.minimumGrade && (
                    <div style={s.infoCard}>
                        <div style={s.infoVal}>{bursary.minimumGrade}%</div>
                        <div style={s.infoLbl}>Minimum average</div>
                    </div>
                )}
                {bursary.location && (
                    <div style={s.infoCard}>
                        <div style={s.infoVal}>{bursary.location}</div>
                        <div style={s.infoLbl}>Available in</div>
                    </div>
                )}
                {bursary.fieldOfStudy && (
                    <div style={s.infoCard}>
                        <div style={s.infoVal}>{bursary.fieldOfStudy}</div>
                        <div style={s.infoLbl}>Field of study</div>
                    </div>
                )}
            </div>

            {bursary.eligibilityCriteria && (
                <div style={s.section}>
                    <h2 style={s.sectionTitle}>Eligibility Criteria</h2>
                    <p style={s.sectionText}>{bursary.eligibilityCriteria}</p>
                </div>
            )}

            {bursary.requiredDocuments && (
                <div style={s.section}>
                    <h2 style={s.sectionTitle}>Required Documents</h2>
                    <p style={s.sectionText}>{bursary.requiredDocuments}</p>
                </div>
            )}

            {bursary.applicationLink && (
                <div style={{ marginTop: 24 }}>
                <a
                    href={bursary.applicationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                    style={{ display: 'inline-block', padding: '12px 28px' }}
                    >
                    Apply for this Bursary
                </a>
                </div>
                )
            }
    </div >
  );
}

const s = {
    backBtn: {
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        padding: '7px 16px',
        color: '#8899bb',
        fontSize: 13,
        cursor: 'pointer',
        marginBottom: 24,
    },
    header: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 20,
        marginBottom: 24,
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 24,
    },
    logo: {
        width: 56,
        height: 56,
        borderRadius: 12,
        background: 'rgba(74,168,255,0.12)',
        color: '#4aa8ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 14,
        flexShrink: 0,
    },
    headerInfo: { flex: 1 },
    title: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
    provider: { fontSize: 14, color: '#8899bb', marginBottom: 8 },
    desc: { fontSize: 14, color: '#8899bb', lineHeight: 1.6 },
    favOn: {
        padding: '8px 18px',
        borderRadius: 9,
        border: '1px solid #f25757',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        color: '#f25757',
        background: 'rgba(242,87,87,0.15)',
        flexShrink: 0,
    },
    favOff: {
        padding: '8px 18px',
        borderRadius: 9,
        border: '1px solid rgba(255,255,255,0.08)',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        color: '#e8edf8',
        background: 'rgba(255,255,255,0.05)',
        flexShrink: 0,
    },
    infoRow: {
        display: 'flex',
        gap: 14,
        marginBottom: 28,
        flexWrap: 'wrap',
    },
    infoCard: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '14px 20px',
    },
    infoVal: { fontSize: 15, fontWeight: 700, marginBottom: 4 },
    infoLbl: { fontSize: 11, color: '#8899bb' },
    section: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 700,
        marginBottom: 10,
        color: '#b8f53c',
    },
    sectionText: {
        fontSize: 14,
        color: '#8899bb',
        lineHeight: 1.7,
    },
    heartOn: {
        background: 'rgba(242,87,87,0.15)',
        border: '1px solid rgba(242,87,87,0.3)',
        borderRadius: '50%',
        width: 42,
        height: 42,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        cursor: 'pointer',
        flexShrink: 0,
    },
    heartOff: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '50%',
        width: 42,
        height: 42,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        cursor: 'pointer',
        flexShrink: 0,
    },
};