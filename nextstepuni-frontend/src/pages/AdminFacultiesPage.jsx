import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminFacultiesPage() {
    const [universities, setUniversities] = useState([]);
    const [selectedUni, setSelectedUni] = useState(null);
    const [uniDetail, setUniDetail] = useState(null);
    const [loadingUnis, setLoadingUnis] = useState(true);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Faculty form
    const [showFacultyForm, setShowFacultyForm] = useState(false);
    const [facultyForm, setFacultyForm] = useState({ name: '', description: '' });
    const [savingFaculty, setSavingFaculty] = useState(false);
    const [facultyMsg, setFacultyMsg] = useState('');

    // Qualification form
    const [showQualForm, setShowQualForm] = useState(false);
    const [qualFacultyId, setQualFacultyId] = useState(null);
    const [qualForm, setQualForm] = useState({
        name: '', nqfLevel: '', durationYears: '',
        description: '', minimumAps: '', applicationLink: '',
    });
    const [savingQual, setSavingQual] = useState(false);
    const [qualMsg, setQualMsg] = useState('');

    // Subject requirement form
    const [showReqForm, setShowReqForm] = useState(false);
    const [reqQualId, setReqQualId] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [reqForm, setReqForm] = useState({
        subjectId: '', minimumPercentage: '',
        minimumLevel: '', isCompulsory: true, notes: '',
    });
    const [savingReq, setSavingReq] = useState(false);
    const [reqMsg, setReqMsg] = useState('');

    useEffect(() => {
        api.get('/university')
            .then(res => setUniversities(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoadingUnis(false));

        api.get('/subject/flat')
            .then(res => setSubjects(res.data))
            .catch(err => console.error(err));
    }, []);

    function loadUniversityDetail(uniId) {
        setLoadingDetail(true);
        api.get('/university/' + uniId)
            .then(res => setUniDetail(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoadingDetail(false));
    }

    function handleSelectUni(e) {
        const id = e.target.value;
        setSelectedUni(id);
        setUniDetail(null);
        setShowFacultyForm(false);
        setShowQualForm(false);
        setShowReqForm(false);
        if (id) loadUniversityDetail(id);
    }

    // ── Faculty ───────────────────────────────────────────────
    function handleAddFaculty(e) {
        e.preventDefault();
        setSavingFaculty(true);
        setFacultyMsg('');
        api.post('/admin/faculties', {
            universityId: selectedUni,
            name: facultyForm.name,
            description: facultyForm.description,
        })
            .then(() => {
                setFacultyMsg('Faculty added.');
                setFacultyForm({ name: '', description: '' });
                setShowFacultyForm(false);
                loadUniversityDetail(selectedUni);
            })
            .catch(err => setFacultyMsg(err.response?.data?.message || 'Error adding faculty.'))
            .finally(() => setSavingFaculty(false));
    }

    function handleDeleteFaculty(id) {
        if (!window.confirm('Deactivate this faculty?')) return;
        api.delete('/admin/faculties/' + id)
            .then(() => loadUniversityDetail(selectedUni))
            .catch(err => console.error(err));
    }

    // ── Qualification ─────────────────────────────────────────
    function openQualForm(facultyId) {
        setQualFacultyId(facultyId);
        setQualForm({
            name: '', nqfLevel: '', durationYears: '',
            description: '', minimumAps: '', applicationLink: '',
        });
        setQualMsg('');
        setShowQualForm(true);
        setShowReqForm(false);
    }

    function handleAddQual(e) {
        e.preventDefault();
        setSavingQual(true);
        setQualMsg('');
        api.post('/admin/qualifications', {
            facultyId: qualFacultyId,
            name: qualForm.name,
            nqfLevel: qualForm.nqfLevel ? Number(qualForm.nqfLevel) : null,
            durationYears: qualForm.durationYears ? Number(qualForm.durationYears) : null,
            description: qualForm.description,
            minimumAps: qualForm.minimumAps ? Number(qualForm.minimumAps) : null,
            applicationLink: qualForm.applicationLink,
        })
            .then(() => {
                setQualMsg('Qualification added.');
                setShowQualForm(false);
                loadUniversityDetail(selectedUni);
            })
            .catch(err => setQualMsg(err.response?.data?.message || 'Error adding qualification.'))
            .finally(() => setSavingQual(false));
    }

    function handleDeleteQual(id) {
        if (!window.confirm('Deactivate this qualification?')) return;
        api.delete('/admin/qualifications/' + id)
            .then(() => loadUniversityDetail(selectedUni))
            .catch(err => console.error(err));
    }

    // ── Subject Requirements ──────────────────────────────────
    function openReqForm(qualId) {
        setReqQualId(qualId);
        setReqForm({
            subjectId: '', minimumPercentage: '',
            minimumLevel: '', isCompulsory: true, notes: '',
        });
        setReqMsg('');
        setShowReqForm(true);
        setShowQualForm(false);
    }

    function handleAddReq(e) {
        e.preventDefault();
        setSavingReq(true);
        setReqMsg('');
        api.post('/admin/subject-requirements', {
            qualificationId: reqQualId,
            subjectId: reqForm.subjectId,
            minimumPercentage: reqForm.minimumPercentage
                ? Number(reqForm.minimumPercentage) : null,
            minimumLevel: reqForm.minimumLevel
                ? Number(reqForm.minimumLevel) : null,
            isCompulsory: reqForm.isCompulsory,
            notes: reqForm.notes,
        })
            .then(() => {
                setReqMsg('Requirement added.');
                setShowReqForm(false);
                loadUniversityDetail(selectedUni);
            })
            .catch(err => setReqMsg(err.response?.data?.message || 'Error adding requirement.'))
            .finally(() => setSavingReq(false));
    }

    function handleDeleteReq(id) {
        if (!window.confirm('Remove this requirement?')) return;
        api.delete('/admin/subject-requirements/' + id)
            .then(() => loadUniversityDetail(selectedUni))
            .catch(err => console.error(err));
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <h1>Faculties and Qualifications</h1>
                <p>Manage faculties, qualifications and subject requirements per university</p>
            </div>

            {/* University selector */}
            <div style={s.selectorCard}>
                <label style={s.label}>Select a university to manage</label>
                <select
                    style={s.select}
                    value={selectedUni || ''}
                    onChange={handleSelectUni}
                >
                    <option value="">-- Choose a university --</option>
                    {universities.map(u => (
                        <option key={u.id} value={u.id}>
                            {u.name}
                        </option>
                    ))}
                </select>
            </div>

            {loadingDetail && (
                <p style={{ color: '#8899bb' }}>Loading university details...</p>
            )}

            {uniDetail && (
                <div>
                    {/* University header */}
                    <div style={s.uniHeader}>
                        <div>
                            <div style={s.uniName}>{uniDetail.name}</div>
                            <div style={s.uniSub}>{uniDetail.city}, {uniDetail.province}</div>
                        </div>
                        <button
                            className="btn-primary"
                            onClick={() => {
                                setShowFacultyForm(!showFacultyForm);
                                setShowQualForm(false);
                                setShowReqForm(false);
                            }}
                        >
                            + Add Faculty
                        </button>
                    </div>

                    {/* Add Faculty form */}
                    {showFacultyForm && (
                        <div style={s.formCard}>
                            <h3 style={s.formTitle}>Add Faculty</h3>
                            <form onSubmit={handleAddFaculty}>
                                <div className="form-group">
                                    <label>Faculty Name *</label>
                                    <input
                                        value={facultyForm.name}
                                        onChange={e => setFacultyForm({ ...facultyForm, name: e.target.value })}
                                        required
                                        placeholder="e.g. Faculty of Science and Agriculture"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <input
                                        value={facultyForm.description}
                                        onChange={e => setFacultyForm({ ...facultyForm, description: e.target.value })}
                                        placeholder="Brief description"
                                    />
                                </div>
                                {facultyMsg && <p style={s.msgGreen}>{facultyMsg}</p>}
                                <div style={s.formActions}>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setShowFacultyForm(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={savingFaculty}
                                    >
                                        {savingFaculty ? 'Saving...' : 'Add Faculty'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Add Qualification form */}
                    {showQualForm && (
                        <div style={s.formCard}>
                            <h3 style={s.formTitle}>Add Qualification</h3>
                            <form onSubmit={handleAddQual}>
                                <div className="form-group">
                                    <label>Qualification Name *</label>
                                    <input
                                        value={qualForm.name}
                                        onChange={e => setQualForm({ ...qualForm, name: e.target.value })}
                                        required
                                        placeholder="e.g. BSc Computer Science"
                                    />
                                </div>
                                <div style={s.threeCol}>
                                    <div className="form-group">
                                        <label>NQF Level</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={qualForm.nqfLevel}
                                            onChange={e => setQualForm({ ...qualForm, nqfLevel: e.target.value })}
                                            placeholder="e.g. 7"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Duration (years)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="6"
                                            value={qualForm.durationYears}
                                            onChange={e => setQualForm({ ...qualForm, durationYears: e.target.value })}
                                            placeholder="e.g. 3"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Minimum APS</label>
                                        <input
                                            type="number"
                                            value={qualForm.minimumAps}
                                            onChange={e => setQualForm({ ...qualForm, minimumAps: e.target.value })}
                                            placeholder="e.g. 30"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <input
                                        value={qualForm.description}
                                        onChange={e => setQualForm({ ...qualForm, description: e.target.value })}
                                        placeholder="Brief description"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Application Link</label>
                                    <input
                                        value={qualForm.applicationLink}
                                        onChange={e => setQualForm({ ...qualForm, applicationLink: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                {qualMsg && <p style={s.msgGreen}>{qualMsg}</p>}
                                <div style={s.formActions}>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setShowQualForm(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={savingQual}
                                    >
                                        {savingQual ? 'Saving...' : 'Add Qualification'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Add Subject Requirement form */}
                    {showReqForm && (
                        <div style={s.formCard}>
                            <h3 style={s.formTitle}>Add Subject Requirement</h3>
                            <form onSubmit={handleAddReq}>
                                <div className="form-group">
                                    <label>Subject *</label>
                                    <select
                                        value={reqForm.subjectId}
                                        onChange={e => setReqForm({ ...reqForm, subjectId: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Select subject --</option>
                                        {subjects.map(sub => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.name} ({sub.category})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div style={s.twoCol}>
                                    <div className="form-group">
                                        <label>Minimum Percentage (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={reqForm.minimumPercentage}
                                            onChange={e => setReqForm({ ...reqForm, minimumPercentage: e.target.value })}
                                            placeholder="e.g. 60"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Minimum Level (1-7)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="7"
                                            value={reqForm.minimumLevel}
                                            onChange={e => setReqForm({ ...reqForm, minimumLevel: e.target.value })}
                                            placeholder="e.g. 4"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Notes</label>
                                    <input
                                        value={reqForm.notes}
                                        onChange={e => setReqForm({ ...reqForm, notes: e.target.value })}
                                        placeholder="e.g. Pure Mathematics only"
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <input
                                            type="checkbox"
                                            checked={reqForm.isCompulsory}
                                            onChange={e => setReqForm({ ...reqForm, isCompulsory: e.target.checked })}
                                            style={{ accentColor: '#b8f53c' }}
                                        />
                                        Compulsory subject
                                    </label>
                                </div>
                                {reqMsg && <p style={s.msgGreen}>{reqMsg}</p>}
                                <div style={s.formActions}>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setShowReqForm(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={savingReq}
                                    >
                                        {savingReq ? 'Saving...' : 'Add Requirement'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Faculties list */}
                    {uniDetail.faculties.length === 0 ? (
                        <div style={s.emptyBox}>
                            <p style={{ color: '#8899bb' }}>
                                No faculties yet. Click + Add Faculty to get started.
                            </p>
                        </div>
                    ) : (
                        uniDetail.faculties.map(faculty => (
                            <div key={faculty.id} style={s.facultyCard}>
                                <div style={s.facultyHeader}>
                                    <div>
                                        <div style={s.facultyName}>{faculty.name}</div>
                                        {faculty.description && (
                                            <div style={s.facultyDesc}>{faculty.description}</div>
                                        )}
                                    </div>
                                    <div style={s.facultyActions}>
                                        <button
                                            style={s.addQualBtn}
                                            onClick={() => openQualForm(faculty.id)}
                                        >
                                            + Add Qualification
                                        </button>
                                        <button
                                            style={s.deleteBtn}
                                            onClick={() => handleDeleteFaculty(faculty.id)}
                                        >
                                            Deactivate
                                        </button>
                                    </div>
                                </div>

                                {/* Qualifications */}
                                {faculty.qualifications.length === 0 ? (
                                    <p style={s.noQuals}>No qualifications yet.</p>
                                ) : (
                                    faculty.qualifications.map(qual => (
                                        <div key={qual.id} style={s.qualCard}>
                                            <div style={s.qualHeader}>
                                                <div>
                                                    <div style={s.qualName}>{qual.name}</div>
                                                    <div style={s.tagRow}>
                                                        {qual.nqfLevel && (
                                                            <span style={s.tagBlue}>NQF {qual.nqfLevel}</span>
                                                        )}
                                                        {qual.durationYears && (
                                                            <span style={s.tagBlue}>{qual.durationYears} years</span>
                                                        )}
                                                        {qual.minimumAps && (
                                                            <span style={s.tagLime}>Min APS {qual.minimumAps}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div style={s.qualActions}>
                                                    <button
                                                        style={s.addReqBtn}
                                                        onClick={() => openReqForm(qual.id)}
                                                    >
                                                        + Add Subject Req
                                                    </button>
                                                    <button
                                                        style={s.deleteBtn}
                                                        onClick={() => handleDeleteQual(qual.id)}
                                                    >
                                                        Deactivate
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Subject requirements */}
                                            {qual.subjectRequirements.length > 0 && (
                                                <div style={s.reqSection}>
                                                    <div style={s.reqTitle}>Subject Requirements</div>
                                                    {qual.subjectRequirements.map((req, i) => (
                                                        <div key={i} style={s.reqRow}>
                                                            <span style={s.reqSubject}>{req.subjectName}</span>
                                                            {req.isCompulsory && (
                                                                <span style={s.requiredBadge}>Required</span>
                                                            )}
                                                            <span style={s.reqMark}>
                                                                {req.minimumPercentage
                                                                    ? req.minimumPercentage + '%'
                                                                    : req.minimumLevel
                                                                        ? 'Level ' + req.minimumLevel
                                                                        : 'Pass'}
                                                            </span>
                                                            {req.notes && (
                                                                <span style={s.reqNotes}>{req.notes}</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

const s = {
    selectorCard: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 20,
        marginBottom: 24,
    },
    label: {
        fontSize: 13,
        color: '#8899bb',
        fontWeight: 600,
        display: 'block',
        marginBottom: 8,
    },
    select: {
        width: '100%',
        background: '#0f1b35',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: '10px 14px',
        color: '#e8edf8',
        fontSize: 14,
        outline: 'none',
    },
    uniHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    uniName: { fontSize: 18, fontWeight: 700 },
    uniSub: { fontSize: 13, color: '#8899bb' },
    formCard: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 20,
        marginBottom: 16,
    },
    formTitle: { fontSize: 15, fontWeight: 700, marginBottom: 16 },
    twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
    threeCol: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 },
    formActions: {
        display: 'flex',
        gap: 12,
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    msgGreen: { color: '#b8f53c', fontSize: 13, marginBottom: 8 },
    emptyBox: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 32,
        textAlign: 'center',
    },
    facultyCard: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 20,
        marginBottom: 16,
    },
    facultyHeader: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    facultyName: { fontSize: 15, fontWeight: 700, color: '#b8f53c', marginBottom: 4 },
    facultyDesc: { fontSize: 13, color: '#8899bb' },
    facultyActions: { display: 'flex', gap: 8, flexShrink: 0 },
    addQualBtn: {
        background: 'rgba(184,245,60,0.12)',
        border: '1px solid rgba(184,245,60,0.3)',
        borderRadius: 7,
        padding: '5px 12px',
        color: '#b8f53c',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
    },
    deleteBtn: {
        background: 'rgba(242,87,87,0.1)',
        border: '1px solid rgba(242,87,87,0.3)',
        borderRadius: 7,
        padding: '5px 12px',
        color: '#f25757',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
    },
    noQuals: { fontSize: 13, color: '#8899bb', marginLeft: 4 },
    qualCard: {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
    },
    qualHeader: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    qualName: { fontSize: 14, fontWeight: 700, marginBottom: 6 },
    tagRow: { display: 'flex', gap: 6, flexWrap: 'wrap' },
    tagBlue: {
        padding: '2px 8px',
        borderRadius: 5,
        fontSize: 11,
        fontWeight: 600,
        background: 'rgba(74,168,255,0.15)',
        color: '#4aa8ff',
    },
    tagLime: {
        padding: '2px 8px',
        borderRadius: 5,
        fontSize: 11,
        fontWeight: 600,
        background: 'rgba(184,245,60,0.15)',
        color: '#b8f53c',
    },
    qualActions: { display: 'flex', gap: 8, flexShrink: 0 },
    addReqBtn: {
        background: 'rgba(74,168,255,0.12)',
        border: '1px solid rgba(74,168,255,0.3)',
        borderRadius: 7,
        padding: '4px 10px',
        color: '#4aa8ff',
        fontSize: 11,
        fontWeight: 600,
        cursor: 'pointer',
    },
    reqSection: {
        marginTop: 10,
        paddingTop: 10,
        borderTop: '1px solid rgba(255,255,255,0.06)',
    },
    reqTitle: {
        fontSize: 11,
        color: '#8899bb',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: 8,
    },
    reqRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '5px 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        fontSize: 13,
    },
    reqSubject: { flex: 1, fontWeight: 600 },
    requiredBadge: {
        fontSize: 10,
        background: 'rgba(242,87,87,0.15)',
        color: '#f25757',
        padding: '1px 6px',
        borderRadius: 4,
        fontWeight: 600,
    },
    reqMark: { color: '#b8f53c', fontWeight: 700, fontSize: 13 },
    reqNotes: { fontSize: 11, color: '#8899bb', fontStyle: 'italic' },
};