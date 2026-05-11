import { useState, useEffect } from 'react';
import api from '../api/axios';

const emptyForm = {
    name: '',
    provider: '',
    description: '',
    amount: '',
    coverage: '',
    eligibilityCriteria: '',
    requiredDocuments: '',
    applicationDeadline: '',
    fieldOfStudy: '',
    minimumGrade: '',
    location: '',
    applicationLink: '',
    isActive: true,
};

const coverageOptions = ['Full', 'Tuition', 'Accommodation', 'Partial'];

export default function AdminBursariesPage() {
    const [bursaries, setBursaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => { fetchBursaries(); }, []);

    function fetchBursaries() {
        setLoading(true);
        api.get('/bursary')
            .then(res => setBursaries(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }

    function openAdd() {
        setForm(emptyForm);
        setEditingId(null);
        setMsg('');
        setShowForm(true);
    }

    function openEdit(b) {
        setForm({
            name: b.name || '',
            provider: b.provider || '',
            description: b.description || '',
            amount: b.amount || '',
            coverage: b.coverage || '',
            eligibilityCriteria: b.eligibilityCriteria || '',
            requiredDocuments: b.requiredDocuments || '',
            applicationDeadline: b.applicationDeadline
                ? b.applicationDeadline.split('T')[0]
                : '',
            fieldOfStudy: b.fieldOfStudy || '',
            minimumGrade: b.minimumGrade || '',
            location: b.location || '',
            applicationLink: b.applicationLink || '',
            isActive: b.isActive ?? true,
        });
        setEditingId(b.id);
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
            amount: form.amount ? Number(form.amount) : null,
            minimumGrade: form.minimumGrade ? Number(form.minimumGrade) : null,
            applicationDeadline: form.applicationDeadline
                ? new Date(form.applicationDeadline).toISOString()
                : null,
        };

        const request = editingId
            ? api.put('/admin/bursaries/' + editingId, payload)
            : api.post('/admin/bursaries', payload);

        request
            .then(() => {
                setMsg(editingId ? 'Bursary updated.' : 'Bursary added.');
                setShowForm(false);
                fetchBursaries();
            })
            .catch(err => {
                setMsg(err.response?.data?.message || 'Something went wrong.');
            })
            .finally(() => setSaving(false));
    }

    function handleDeactivate(id) {
        if (!window.confirm('Deactivate this bursary?')) return;
        api.delete('/admin/bursaries/' + id)
            .then(() => fetchBursaries())
            .catch(err => console.error(err));
    }

    return (
        <div className="page-content">
            <div style={s.pageHead}>
                <div>
                    <h1 style={s.title}>Manage Bursaries</h1>
                    <p style={s.sub}>Add, edit or deactivate bursaries</p>
                </div>
                <button className="btn-primary" onClick={openAdd}>
                    + Add Bursary
                </button>
            </div>

            {msg && !showForm && <p style={s.msgGreen}>{msg}</p>}

            {showForm && (
                <div style={s.formCard}>
                    <h2 style={s.formTitle}>
                        {editingId ? 'Edit Bursary' : 'Add New Bursary'}
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
                                    placeholder="e.g. NSFAS Bursary 2026"
                                />
                            </div>
                            <div className="form-group">
                                <label>Provider *</label>
                                <input
                                    name="provider"
                                    value={form.provider}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. NSFAS"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <input
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Brief description"
                            />
                        </div>

                        <div style={s.twoCol}>
                            <div className="form-group">
                                <label>Amount (R)</label>
                                <input
                                    name="amount"
                                    type="number"
                                    value={form.amount}
                                    onChange={handleChange}
                                    placeholder="e.g. 60000"
                                />
                            </div>
                            <div className="form-group">
                                <label>Coverage</label>
                                <select
                                    name="coverage"
                                    value={form.coverage}
                                    onChange={handleChange}
                                >
                                    <option value="">Select coverage</option>
                                    {coverageOptions.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={s.twoCol}>
                            <div className="form-group">
                                <label>Field of Study</label>
                                <input
                                    name="fieldOfStudy"
                                    value={form.fieldOfStudy}
                                    onChange={handleChange}
                                    placeholder="e.g. Computer Science, Engineering"
                                />
                            </div>
                            <div className="form-group">
                                <label>Minimum Average (%)</label>
                                <input
                                    name="minimumGrade"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={form.minimumGrade}
                                    onChange={handleChange}
                                    placeholder="e.g. 65"
                                />
                            </div>
                        </div>

                        <div style={s.twoCol}>
                            <div className="form-group">
                                <label>Application Deadline</label>
                                <input
                                    name="applicationDeadline"
                                    type="date"
                                    value={form.applicationDeadline}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Location (leave blank for nationwide)</label>
                                <input
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Limpopo, Gauteng"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Eligibility Criteria</label>
                            <input
                                name="eligibilityCriteria"
                                value={form.eligibilityCriteria}
                                onChange={handleChange}
                                placeholder="Who can apply"
                            />
                        </div>

                        <div className="form-group">
                            <label>Required Documents</label>
                            <input
                                name="requiredDocuments"
                                value={form.requiredDocuments}
                                onChange={handleChange}
                                placeholder="e.g. ID, matric results, proof of income"
                            />
                        </div>

                        <div className="form-group">
                            <label>Application Link</label>
                            <input
                                name="applicationLink"
                                value={form.applicationLink}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </div>

                        {editingId && (
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={form.isActive}
                                        onChange={handleChange}
                                        style={{ accentColor: '#b8f53c' }}
                                    />
                                    Active
                                </label>
                            </div>
                        )}

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
                                {saving ? 'Saving...' : editingId ? 'Update' : 'Add Bursary'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <p style={{ color: '#8899bb' }}>Loading...</p>
            ) : (
                <div style={s.tableCard}>
                    <div style={s.tableHeader}>
                        <span style={{ ...s.col, flex: 2 }}>Name</span>
                        <span style={s.col}>Provider</span>
                        <span style={s.col}>Amount</span>
                        <span style={s.col}>Deadline</span>
                        <span style={s.col}>Actions</span>
                    </div>
                    {bursaries.map(b => (
                        <div key={b.id} style={s.tableRow}>
                            <span style={{ ...s.col, flex: 2, fontWeight: 600 }}>
                                {b.name}
                            </span>
                            <span style={{ ...s.col, color: '#8899bb' }}>{b.provider}</span>
                            <span style={{ ...s.col, color: '#b8f53c', fontWeight: 700 }}>
                                {b.amount ? 'R' + Number(b.amount).toLocaleString() : '--'}
                            </span>
                            <span style={{
                                ...s.col,
                                color: b.isDeadlineSoon ? '#f25757' : '#e8edf8',
                                fontSize: 12,
                            }}>
                                {b.applicationDeadline
                                    ? new Date(b.applicationDeadline).toLocaleDateString('en-ZA')
                                    : '--'}
                            </span>
                            <span style={{ ...s.col, display: 'flex', gap: 8 }}>
                                <button style={s.editBtn} onClick={() => openEdit(b)}>
                                    Edit
                                </button>
                                <button
                                    style={s.deleteBtn}
                                    onClick={() => handleDeactivate(b.id)}
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
    col: { flex: 1, fontSize: 13, color: '#e8edf8' },
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