import { useState, useEffect } from 'react';
import api from '../api/axios';

const emptyForm = {
    name: '',
    abbreviation: '',
    city: '',
    province: '',
    description: '',
    website: '',
    applicationLink: '',
    annualFeesFrom: '',
    apsIncludesLifeOrientation: true,
    apsSubjectsCounted: 6,
    apsNotes: '',
    isActive: true,
};

const provinces = [
    'Limpopo', 'Gauteng', 'Western Cape', 'Eastern Cape',
    'KwaZulu-Natal', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape',
];

export default function AdminUniversitiesPage() {
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => { fetchUniversities(); }, []);

    function fetchUniversities() {
        setLoading(true);
        api.get('/university')
            .then(res => setUniversities(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }

    function openAdd() {
        setForm(emptyForm);
        setEditingId(null);
        setMsg('');
        setShowForm(true);
    }

    function openEdit(uni) {
        setForm({
            name: uni.name || '',
            abbreviation: uni.abbreviation || '',
            city: uni.city || '',
            province: uni.province || '',
            description: uni.description || '',
            website: uni.website || '',
            applicationLink: uni.applicationLink || '',
            annualFeesFrom: uni.annualFeesFrom || '',
            apsIncludesLifeOrientation: true,
            apsSubjectsCounted: 6,
            apsNotes: '',
            isActive: true,
        });
        setEditingId(uni.id);
        setMsg('');
        setShowForm(true);
    }

    function handleChange(e) {
        const val = e.target.type === 'checkbox'
            ? e.target.checked
            : e.target.value;
        setForm({ ...form, [e.target.name]: val });
    }

    function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setMsg('');

        const payload = {
            ...form,
            annualFeesFrom: form.annualFeesFrom ? Number(form.annualFeesFrom) : null,
            apsSubjectsCounted: Number(form.apsSubjectsCounted),
        };

        const request = editingId
            ? api.put('/admin/universities/' + editingId, payload)
            : api.post('/admin/universities', payload);

        request
            .then(() => {
                setMsg(editingId ? 'University updated.' : 'University added.');
                setShowForm(false);
                fetchUniversities();
            })
            .catch(err => {
                setMsg(err.response?.data?.message || 'Something went wrong.');
            })
            .finally(() => setSaving(false));
    }

    function handleDeactivate(id) {
        if (!window.confirm('Deactivate this university?')) return;
        api.delete('/admin/universities/' + id)
            .then(() => fetchUniversities())
            .catch(err => console.error(err));
    }

    return (
        <div className="page-content">
            <div style={s.pageHead}>
                <div>
                    <h1 style={s.title}>Manage Universities</h1>
                    <p style={s.sub}>Add, edit or deactivate universities</p>
                </div>
                <button className="btn-primary" onClick={openAdd}>
                    + Add University
                </button>
            </div>

            {msg && <p style={s.msgGreen}>{msg}</p>}

            {/* Form */}
            {showForm && (
                <div style={s.formCard}>
                    <h2 style={s.formTitle}>
                        {editingId ? 'Edit University' : 'Add New University'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div style={s.twoCol}>
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. University of Limpopo"
                                />
                            </div>
                            <div className="form-group">
                                <label>Abbreviation</label>
                                <input
                                    name="abbreviation"
                                    value={form.abbreviation}
                                    onChange={handleChange}
                                    placeholder="e.g. UL"
                                />
                            </div>
                        </div>

                        <div style={s.twoCol}>
                            <div className="form-group">
                                <label>City *</label>
                                <input
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Polokwane"
                                />
                            </div>
                            <div className="form-group">
                                <label>Province *</label>
                                <select
                                    name="province"
                                    value={form.province}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select province</option>
                                    {provinces.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <input
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Brief description of the university"
                            />
                        </div>

                        <div style={s.twoCol}>
                            <div className="form-group">
                                <label>Website</label>
                                <input
                                    name="website"
                                    value={form.website}
                                    onChange={handleChange}
                                    placeholder="https://www.example.ac.za"
                                />
                            </div>
                            <div className="form-group">
                                <label>Application Link</label>
                                <input
                                    name="applicationLink"
                                    value={form.applicationLink}
                                    onChange={handleChange}
                                    placeholder="https://www.example.ac.za/apply"
                                />
                            </div>
                        </div>

                        <div style={s.twoCol}>
                            <div className="form-group">
                                <label>Annual Fees From (R)</label>
                                <input
                                    name="annualFeesFrom"
                                    type="number"
                                    value={form.annualFeesFrom}
                                    onChange={handleChange}
                                    placeholder="e.g. 42000"
                                />
                            </div>
                            <div className="form-group">
                                <label>APS Subjects Counted</label>
                                <input
                                    name="apsSubjectsCounted"
                                    type="number"
                                    min="4"
                                    max="7"
                                    value={form.apsSubjectsCounted}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <input
                                    type="checkbox"
                                    name="apsIncludesLifeOrientation"
                                    checked={form.apsIncludesLifeOrientation}
                                    onChange={handleChange}
                                    style={{ accentColor: '#b8f53c' }}
                                />
                                Include Life Orientation in APS calculation
                            </label>
                        </div>

                        <div className="form-group">
                            <label>APS Notes</label>
                            <input
                                name="apsNotes"
                                value={form.apsNotes}
                                onChange={handleChange}
                                placeholder="e.g. Best 6 subjects, LO excluded"
                            />
                        </div>

                        {msg && <p style={s.msgRed}>{msg}</p>}

                        <div style={s.formActions}>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : editingId ? 'Update' : 'Add University'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            {loading ? (
                <p style={{ color: '#8899bb' }}>Loading...</p>
            ) : (
                <div style={s.tableCard}>
                    <div style={s.tableHeader}>
                        <span style={{ ...s.col, flex: 2 }}>Name</span>
                        <span style={s.col}>City</span>
                        <span style={s.col}>Province</span>
                        <span style={s.col}>Fees From</span>
                        <span style={s.col}>Actions</span>
                    </div>
                    {universities.map(uni => (
                        <div key={uni.id} style={s.tableRow}>
                            <span style={{ ...s.col, flex: 2, fontWeight: 600 }}>
                                {uni.name}
                                {uni.abbreviation && (
                                    <span style={s.abbr}> ({uni.abbreviation})</span>
                                )}
                            </span>
                            <span style={s.col}>{uni.city}</span>
                            <span style={s.col}>{uni.province}</span>
                            <span style={s.col}>
                                {uni.annualFeesFrom
                                    ? 'R' + Number(uni.annualFeesFrom).toLocaleString()
                                    : '--'}
                            </span>
                            <span style={{ ...s.col, display: 'flex', gap: 8 }}>
                                <button
                                    style={s.editBtn}
                                    onClick={() => openEdit(uni)}
                                >
                                    Edit
                                </button>
                                <button
                                    style={s.deleteBtn}
                                    onClick={() => handleDeactivate(uni.id)}
                                >
                                    Deactivate
                                </button>
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const s = {
    pageHead: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    title: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
    sub: { fontSize: 14, color: '#8899bb' },
    msgGreen: { color: '#b8f53c', fontSize: 13, marginBottom: 16 },
    msgRed: { color: '#f25757', fontSize: 13, marginBottom: 8 },
    formCard: {
        background: '#19305a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 24,
        marginBottom: 24,
    },
    formTitle: { fontSize: 16, fontWeight: 700, marginBottom: 20 },
    twoCol: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
    },
    formActions: {
        display: 'flex',
        gap: 12,
        justifyContent: 'flex-end',
        marginTop: 8,
    },
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
        alignItems: 'center',
    },
    col: {
        flex: 1,
        fontSize: 13,
        color: '#e8edf8',
    },
    abbr: { color: '#8899bb', fontWeight: 400 },
    editBtn: {
        background: 'rgba(74,168,255,0.12)',
        border: '1px solid rgba(74,168,255,0.3)',
        borderRadius: 7,
        padding: '4px 12px',
        color: '#4aa8ff',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
    },
    deleteBtn: {
        background: 'rgba(242,87,87,0.1)',
        border: '1px solid rgba(242,87,87,0.3)',
        borderRadius: 7,
        padding: '4px 12px',
        color: '#f25757',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
    },
};