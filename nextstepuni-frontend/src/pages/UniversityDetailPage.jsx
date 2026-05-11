import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function UniversityDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const [uni, setUni] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favLoading, setFavLoading] = useState(false);
    const [isFavourited, setIsFavourited] = useState(false);

    useEffect(() => {
        api.get('/university/' + id)
            .then(res => {
                setUni(res.data);
                setIsFavourited(res.data.isFavourited);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    function handleFavourite() {
        if (!user) { navigate('/login'); return; }
        setFavLoading(true);
        api.post('/university/' + id + '/favourite')
            .then(res => setIsFavourited(res.data.isFavourited))
            .catch(err => {
                if (err.response?.status === 401) navigate('/login');
                else console.error(err);
            })
            .finally(() => setFavLoading(false));
    }

    if (loading) return <div className="loading">Loading...</div>;
    if (!uni) return <div className="page-content"><p>University not found.</p></div>;

    return (
        <div className="page-content">

            <button onClick={() => navigate('/universities')} style={s.backBtn}>
                Back to Universities
            </button>

            <div style={s.header}>
                <div style={s.logo}>
                    {uni.abbreviation || uni.name.slice(0, 2).toUpperCase()}
                </div>
                <div style={s.headerInfo}>
                    <h1 style={s.title}>{uni.name}</h1>
                    <p style={s.location}>{uni.city}, {uni.province}</p>
                    {uni.description && <p style={s.desc}>{uni.description}</p>}
                </div>
                {!isAdmin && (
                    <button
                        onClick={handleFavourite}
                        style={isFavourited ? s.heartOn : s.heartOff}
                        disabled={favLoading}
                        title={isFavourited ? 'Remove from saved' : 'Save university'}
                    >
                        {isFavourited ? '❤️' : '🤍'}
                    </button>
                )}
            </div>

            <div style={s.infoRow}>
                {uni.annualFeesFrom && (
                    <div style={s.infoCard}>
                        <div style={s.infoVal}>R{Number(uni.annualFeesFrom).toLocaleString()}</div>
                        <div style={s.infoLbl}>Fees from / year</div>
                    </div>
                )}
                {uni.website && (
                    <div style={s.infoCard}>
                        <a href={uni.website} target="_blank" rel="noreferrer" style={s.linkLime}>
                            Visit Website
                        </a>
                        <div style={s.infoLbl}>Official site</div>
                    </div>
                )}
                {uni.applicationLink && (
                    <div style={s.infoCard}>
                        <a href={uni.applicationLink} target="_blank" rel="noreferrer" style={s.linkBlue}>
                            Apply Now
                        </a>
                        <div style={s.infoLbl}>Applications</div>
                    </div>
                )}
            </div>

            <h2 style={s.sectionTitle}>Faculties and Qualifications</h2>

            {uni.faculties?.length === 0 && (
                <p style={s.muted}>No faculty information available yet.</p>
            )}

            {uni.faculties?.map(faculty => (
                <div key={faculty.id} style={s.facultyCard}>
                    <h3 style={s.facultyName}>{faculty.name}</h3>
                    {faculty.description && <p style={s.muted}>{faculty.description}</p>}
                    {faculty.qualifications?.map(qual => (
                        <div key={qual.id} style={s.qualCard}>
                            <div style={s.qualHeader}>
                                <div>
                                    <div style={s.qualName}>{qual.name}</div>
                                    <div style={s.tagRow}>
                                        {qual.nqfLevel && <span style={s.tagBlue}>NQF {qual.nqfLevel}</span>}
                                        {qual.durationYears && <span style={s.tagBlue}>{qual.durationYears} years</span>}
                                        {qual.minimumAps && <span style={s.tagLime}>Min APS {qual.minimumAps}</span>}
                                    </div>
                                </div>
                                {qual.applicationLink && (
                                    <a href={qual.applicationLink} target="_blank" rel="noreferrer" style={s.applyLink}>
                                        Apply
                                    </a>
                                )}
                            </div>
                            {qual.subjectRequirements?.length > 0 && (
                                <div style={s.reqSection}>
                                    <div style={s.reqTitle}>Subject Requirements</div>
                                    {qual.subjectRequirements.map((req, i) => (
                                        <div key={i} style={s.reqItem}>
                                            <div style={s.reqTop}>
                                                <span style={s.reqSubject}>{req.subjectName}</span>
                                                {req.isCompulsory && <span style={s.required}>Required</span>}
                                                <span style={s.reqMark}>
                                                    {req.minimumPercentage
                                                        ? req.minimumPercentage + '%'
                                                        : req.minimumLevel
                                                            ? 'Level ' + req.minimumLevel
                                                            : 'Pass'}
                                                </span>
                                            </div>
                                            {req.notes && <div style={s.reqNotes}>{req.notes}</div>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
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
        width: 60,
        height: 60,
        borderRadius: 12,
        background: 'rgba(184,245,60,0.12)',
        color: '#b8f53c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 18,
        flexShrink: 0,
    },
    headerInfo: { flex: 1 },
    title: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
    location: { fontSize: 14, color: '#8899bb', marginBottom: 8 },
    desc: { fontSize: 14, color: '#8899bb', lineHeight: 1.6 },
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
    infoRow: { display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap' },
    infoCard: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '14px 20px',
    },
    infoVal: { fontSize: 16, fontWeight: 700, marginBottom: 4 },
    infoLbl: { fontSize: 11, color: '#8899bb' },
    linkLime: { color: '#b8f53c', fontSize: 14, fontWeight: 600 },
    linkBlue: { color: '#4aa8ff', fontSize: 14, fontWeight: 600 },
    sectionTitle: { fontSize: 17, fontWeight: 700, marginBottom: 16 },
    muted: { color: '#8899bb', fontSize: 13 },
    facultyCard: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 20,
        marginBottom: 16,
    },
    facultyName: { fontSize: 15, fontWeight: 700, marginBottom: 6, color: '#b8f53c' },
    qualCard: {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: 16,
        marginTop: 10,
    },
    qualHeader: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    qualName: { fontSize: 14, fontWeight: 700, marginBottom: 6 },
    tagRow: { display: 'flex', gap: 6, flexWrap: 'wrap' },
    tagBlue: {
        padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600,
        background: 'rgba(74,168,255,0.15)', color: '#4aa8ff',
    },
    tagLime: {
        padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600,
        background: 'rgba(184,245,60,0.15)', color: '#b8f53c',
    },
    applyLink: {
        padding: '6px 14px', borderRadius: 8,
        background: 'rgba(184,245,60,0.15)', color: '#b8f53c',
        fontSize: 13, fontWeight: 600, flexShrink: 0,
    },
    reqSection: {
        marginTop: 12, paddingTop: 12,
        borderTop: '1px solid rgba(255,255,255,0.06)',
    },
    reqTitle: {
        fontSize: 11, color: '#8899bb', fontWeight: 600,
        marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em',
    },
    reqItem: {
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 8, padding: '8px 12px', marginBottom: 6,
    },
    reqTop: { display: 'flex', alignItems: 'center', gap: 8 },
    reqSubject: { fontSize: 13, fontWeight: 600, flex: 1 },
    required: {
        fontSize: 10, background: 'rgba(242,87,87,0.15)',
        color: '#f25757', padding: '1px 6px', borderRadius: 4, fontWeight: 600,
    },
    reqMark: { fontSize: 13, color: '#b8f53c', fontWeight: 700 },
    reqNotes: { fontSize: 11, color: '#8899bb', marginTop: 3 },
};