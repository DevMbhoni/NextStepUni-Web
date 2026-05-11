import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const provinces = [
    'Limpopo', 'Gauteng', 'Western Cape', 'Eastern Cape',
    'KwaZulu-Natal', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape'
];

const uploadTypes = [
    { value: 'Grade11Final', label: 'Grade 11 Final' },
    { value: 'Grade12Mid', label: 'Grade 12 Mid-Year' },
    { value: 'Grade12Final', label: 'Grade 12 Final (Matric)' },
];

export default function ProfilePage() {
    const { user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [uploadType, setUploadType] = useState('Grade12Final');
    const [selectedSubs, setSelectedSubs] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState('');

    const [form, setForm] = useState({
        province: '',
        fieldOfStudyInterest: '',
        schoolName: '',
        graduationYear: '',
    });

    useEffect(() => {
        Promise.all([
            api.get('/student/profile'),
            api.get('/subject/flat'),
        ])
            .then(([profileRes, subjectsRes]) => {
                const p = profileRes.data;
                setProfile(p);
                setForm({
                    province: p.province || '',
                    fieldOfStudyInterest: p.fieldOfStudyInterest || '',
                    schoolName: p.schoolName || '',
                    graduationYear: p.graduationYear || '',
                });
                setSubjects(subjectsRes.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    function handleFormChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSaveProfile(e) {
        e.preventDefault();
        setSaving(true);
        setSaveMsg('');
        api.put('/student/profile', form)
            .then(res => {
                setProfile(res.data);
                setSaveMsg('Profile updated successfully.');
            })
            .catch(err => console.error(err))
            .finally(() => setSaving(false));
    }

    function handleSubjectChange(subjectId, field, value) {
        setSelectedSubs(prev => {
            const existing = prev.find(s => s.subjectId === subjectId);
            if (existing) {
                return prev.map(s =>
                    s.subjectId === subjectId ? { ...s, [field]: value } : s
                );
            }
            return [...prev, { subjectId, percentage: '', [field]: value }];
        });
    }

    function isSubjectSelected(subjectId) {
        return selectedSubs.some(s => s.subjectId === subjectId);
    }

    function toggleSubject(subjectId) {
        if (isSubjectSelected(subjectId)) {
            setSelectedSubs(prev => prev.filter(s => s.subjectId !== subjectId));
        } else {
            setSelectedSubs(prev => [...prev, { subjectId, percentage: '' }]);
        }
    }

    function handleUploadResults(e) {
        e.preventDefault();
        const valid = selectedSubs.filter(s =>
            s.percentage !== '' && Number(s.percentage) >= 0 && Number(s.percentage) <= 100
        );
        if (valid.length === 0) {
            setUploadMsg('Please add at least one subject with a valid percentage.');
            return;
        }
        setUploading(true);
        setUploadMsg('');
        const payload = {
            uploadType,
            subjects: valid.map(s => ({
                subjectId: s.subjectId,
                percentage: Number(s.percentage),
            })),
        };
        api.post('/student/results', payload)
            .then(res => {
                setProfile(prev => ({ ...prev, latestResults: res.data }));
                setUploadMsg('Results uploaded successfully.');
                setSelectedSubs([]);
            })
            .catch(err => {
                setUploadMsg('Upload failed. Please try again.');
                console.error(err);
            })
            .finally(() => setUploading(false));
    }

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="page-content">
            <div className="page-header">
                <h1>My Profile</h1>
                <p>Manage your personal details and subject results</p>
            </div>

            <div style={s.grid}>

                {/* Left column */}
                <div>

                    {/* Profile info card */}
                    <div style={s.card}>
                        <div style={s.avatar}>
                            {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <div style={s.userName}>
                            {user.firstName} {user.lastName}
                        </div>
                        <div style={s.userEmail}>{user.email}</div>

                        <form onSubmit={handleSaveProfile} style={{ marginTop: 20 }}>
                            <div className="form-group">
                                <label>Province</label>
                                <select name="province" value={form.province} onChange={handleFormChange}>
                                    <option value="">Select province</option>
                                    {provinces.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Field of study interest</label>
                                <input
                                    name="fieldOfStudyInterest"
                                    placeholder="e.g. Computer Science"
                                    value={form.fieldOfStudyInterest}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>School name</label>
                                <input
                                    name="schoolName"
                                    placeholder="Your high school"
                                    value={form.schoolName}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Graduation year</label>
                                <input
                                    name="graduationYear"
                                    type="number"
                                    placeholder="e.g. 2025"
                                    value={form.graduationYear}
                                    onChange={handleFormChange}
                                />
                            </div>
                            {saveMsg && <p style={{ color: '#b8f53c', fontSize: 13 }}>{saveMsg}</p>}
                            <button type="submit" className="btn-primary" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </form>
                    </div>

                    {/* Latest results card */}
                    {profile.latestResults && (
                        <div style={{ ...s.card, marginTop: 16 }}>
                            <h3 style={s.cardTitle}>Latest Results</h3>
                            <p style={s.resultMeta}>
                                {profile.latestResults.uploadType.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <div style={s.statsRow}>
                                <div style={s.stat}>
                                    <div style={s.statVal}>
                                        {profile.latestResults.calculatedAverage
                                            ? profile.latestResults.calculatedAverage + '%'
                                            : 'N/A'}
                                    </div>
                                    <div style={s.statLbl}>Average</div>
                                </div>
                                <div style={s.stat}>
                                    <div style={s.statVal}>
                                        {profile.latestResults.calculatedAps || 'N/A'}
                                    </div>
                                    <div style={s.statLbl}>APS Score</div>
                                </div>
                                <div style={s.stat}>
                                    <div style={s.statVal}>
                                        {profile.latestResults.subjects.length}
                                    </div>
                                    <div style={s.statLbl}>Subjects</div>
                                </div>
                            </div>
                            <div style={{ marginTop: 14 }}>
                                {profile.latestResults.subjects.map(sub => (
                                    <div key={sub.subjectId} style={s.subjectRow}>
                                        <span style={s.subjectName}>{sub.subjectName}</span>
                                        <span style={s.subjectPct}>{sub.percentage}%</span>
                                        <span style={s.subjectLvl}>Level {sub.level}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right column — upload results */}
                <div style={s.card}>
                    <h3 style={s.cardTitle}>Upload Subject Results</h3>
                    <p style={s.muted}>
                        Select your result type, tick your subjects and enter your percentage for each.
                    </p>

                    <form onSubmit={handleUploadResults}>
                        <div className="form-group" style={{ marginTop: 16 }}>
                            <label>Result type</label>
                            <select
                                value={uploadType}
                                onChange={e => setUploadType(e.target.value)}
                            >
                                {uploadTypes.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>

                        <div style={s.subjectList}>
                            {subjects.map(sub => (
                                <div key={sub.id} style={s.subjectItem}>
                                    <div style={s.subjectCheckRow}>
                                        <input
                                            type="checkbox"
                                            id={sub.id}
                                            checked={isSubjectSelected(sub.id)}
                                            onChange={() => toggleSubject(sub.id)}
                                            style={{ marginRight: 8, accentColor: '#b8f53c' }}
                                        />
                                        <label htmlFor={sub.id} style={s.subjectLabel}>
                                            {sub.name}
                                            <span style={s.categoryBadge}>{sub.category}</span>
                                        </label>
                                    </div>
                                    {isSubjectSelected(sub.id) && (
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="Enter %"
                                            style={s.pctInput}
                                            value={
                                                selectedSubs.find(s => s.subjectId === sub.id)?.percentage || ''
                                            }
                                            onChange={e =>
                                                handleSubjectChange(sub.id, 'percentage', e.target.value)
                                            }
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {uploadMsg && (
                            <p style={{
                                color: uploadMsg.includes('success') ? '#b8f53c' : '#f25757',
                                fontSize: 13,
                                marginTop: 8,
                            }}>
                                {uploadMsg}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ marginTop: 16, width: '100%' }}
                            disabled={uploading}
                        >
                            {uploading ? 'Uploading...' : 'Upload Results'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const s = {
    grid: {
        display: 'grid',
        gridTemplateColumns: '340px 1fr',
        gap: 20,
        alignItems: 'flex-start',
    },
    card: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 24,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #4aa8ff, #b8f53c)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        fontWeight: 700,
        color: '#0f1b35',
        margin: '0 auto 12px',
    },
    userName: {
        textAlign: 'center',
        fontSize: 17,
        fontWeight: 700,
        marginBottom: 4,
    },
    userEmail: {
        textAlign: 'center',
        fontSize: 13,
        color: '#8899bb',
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: 700,
        marginBottom: 6,
    },
    resultMeta: {
        fontSize: 12,
        color: '#8899bb',
        marginBottom: 12,
    },
    statsRow: {
        display: 'flex',
        gap: 20,
        marginBottom: 4,
    },
    stat: { textAlign: 'center' },
    statVal: {
        fontSize: 20,
        fontWeight: 700,
        color: '#b8f53c',
    },
    statLbl: {
        fontSize: 11,
        color: '#8899bb',
    },
    subjectRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '6px 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
    },
    subjectName: { flex: 1, fontSize: 13 },
    subjectPct: { fontSize: 13, fontWeight: 700, color: '#b8f53c' },
    subjectLvl: { fontSize: 11, color: '#8899bb' },
    muted: { fontSize: 13, color: '#8899bb', marginBottom: 4 },
    subjectList: {
        maxHeight: 400,
        overflowY: 'auto',
        marginTop: 12,
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: 8,
    },
    subjectItem: {
        padding: '6px 8px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
    },
    subjectCheckRow: {
        display: 'flex',
        alignItems: 'center',
    },
    subjectLabel: {
        fontSize: 13,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    categoryBadge: {
        fontSize: 10,
        background: 'rgba(74,168,255,0.12)',
        color: '#4aa8ff',
        padding: '1px 6px',
        borderRadius: 4,
        fontWeight: 600,
    },
    pctInput: {
        marginTop: 6,
        marginLeft: 24,
        width: 100,
        background: '#0f1b35',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 7,
        padding: '5px 10px',
        color: '#e8edf8',
        fontSize: 13,
        outline: 'none',
    },
};