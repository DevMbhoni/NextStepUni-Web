import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminStudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchStudents(); }, []);

    function fetchStudents(term) {
        setLoading(true);
        const params = {};
        if (term) params.searchTerm = term;
        api.get('/admin/students', { params })
            .then(res => setStudents(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }

    function handleSearch(e) {
        e.preventDefault();
        fetchStudents(search);
    }

    function handleToggle(id) {
        api.patch('/admin/students/' + id + '/toggle-active')
            .then(() => fetchStudents(search))
            .catch(err => console.error(err));
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <h1>Students</h1>
                <p>View and manage registered students</p>
            </div>

            <form onSubmit={handleSearch} style={s.searchRow}>
                <input
                    style={s.searchInput}
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button type="submit" className="btn-primary">Search</button>
            </form>

            {loading ? (
                <p style={{ color: '#8899bb' }}>Loading...</p>
            ) : students.length === 0 ? (
                <div className="empty-state"><p>No students found.</p></div>
            ) : (
                <div style={s.tableCard}>
                    <div style={s.tableHeader}>
                        <span style={{ ...s.col, flex: 2 }}>Name</span>
                        <span style={s.col}>Email</span>
                        <span style={s.col}>Province</span>
                        <span style={s.col}>Field</span>
                        <span style={s.col}>Average</span>
                        <span style={s.col}>APS</span>
                        <span style={s.col}>Status</span>
                        <span style={s.col}>Action</span>
                    </div>
                    {students.map(student => (
                        <div key={student.id} style={s.tableRow}>
                            <span style={{ ...s.col, flex: 2, fontWeight: 600 }}>
                                {student.firstName} {student.lastName}
                            </span>
                            <span style={{ ...s.col, color: '#8899bb', fontSize: 12 }}>
                                {student.email}
                            </span>
                            <span style={s.col}>{student.province || '--'}</span>
                            <span style={{ ...s.col, fontSize: 12 }}>
                                {student.fieldOfStudyInterest || '--'}
                            </span>
                            <span style={{ ...s.col, color: '#b8f53c', fontWeight: 700 }}>
                                {student.latestAverage ? student.latestAverage + '%' : '--'}
                            </span>
                            <span style={{ ...s.col, fontWeight: 700 }}>
                                {student.latestAps || '--'}
                            </span>
                            <span style={s.col}>
                                <span style={student.isActive ? s.active : s.inactive}>
                                    {student.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </span>
                            <span style={s.col}>
                                <button
                                    style={student.isActive ? s.deactivateBtn : s.activateBtn}
                                    onClick={() => handleToggle(student.id)}
                                >
                                    {student.isActive ? 'Deactivate' : 'Activate'}
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
    searchRow: {
        display: 'flex',
        gap: 10,
        marginBottom: 20,
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
    active: {
        background: 'rgba(184,245,60,0.15)',
        color: '#b8f53c',
        padding: '2px 8px',
        borderRadius: 5,
        fontSize: 11,
        fontWeight: 600,
    },
    inactive: {
        background: 'rgba(242,87,87,0.15)',
        color: '#f25757',
        padding: '2px 8px',
        borderRadius: 5,
        fontSize: 11,
        fontWeight: 600,
    },
    deactivateBtn: {
        background: 'rgba(242,87,87,0.1)',
        border: '1px solid rgba(242,87,87,0.3)',
        borderRadius: 7,
        padding: '4px 10px',
        color: '#f25757',
        fontSize: 11,
        fontWeight: 600,
        cursor: 'pointer',
    },
    activateBtn: {
        background: 'rgba(184,245,60,0.1)',
        border: '1px solid rgba(184,245,60,0.3)',
        borderRadius: 7,
        padding: '4px 10px',
        color: '#b8f53c',
        fontSize: 11,
        fontWeight: 600,
        cursor: 'pointer',
    },
};