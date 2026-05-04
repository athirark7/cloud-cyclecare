'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Cycle {
  id: string;
  startDate: string;
  endDate: string | null;
  cycleLength: number | null;
}

const CyclePage = () => {
    const { user, token, loading: authLoading, logout } = useAuth();
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const fetchCycles = async () => {
        if (!token) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/cycles`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            
            if (response.ok) {
                setCycles(Array.isArray(data) ? data : []);
            } else {
                if (response.status === 401 || response.status === 403) {
                    logout();
                    return;
                }
                console.warn('Error fetching cycles:', data.message || response.statusText);
                setCycles([]);
            }
        } catch (error) {
            console.warn('Failed to fetch cycles:', error);
            setCycles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchCycles();
    }, [token]);

    const handleLogCycle = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId 
                ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/cycles/${editingId}`
                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/cycles`;

            const response = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ startDate, endDate: endDate || null }),
            });

            if (!response.ok) throw new Error(editingId ? 'Failed to update cycle' : 'Failed to log period');

            setStartDate('');
            setEndDate('');
            setEditingId(null);
            fetchCycles();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleEditClick = (cycle: Cycle) => {
        setStartDate(cycle.startDate.split('T')[0]); // ensure proper date format for input
        setEndDate(cycle.endDate ? cycle.endDate.split('T')[0] : '');
        setEditingId(cycle.id);
        setError('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setStartDate('');
        setEndDate('');
        setEditingId(null);
        setError('');
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/cycles/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCycles();
        } catch (error) {
            console.error('Failed to delete cycle:', error);
        }
    };

    if (authLoading || loading) return <div className="loading">Loading your cycles...</div>;

    return (
        <div className="cycle-container animate-fade-in">
            <h1>Log Your Cycle</h1>
            <p className="subtitle">Track your flow and identify your patterns</p>

            <div className="cycle-layout">
                {/* Form to log new cycle */}
                <div className="glass-card form-card">
                    <div className="form-header">
                         <h3>{editingId ? 'Edit Entry' : 'New Entry'}</h3>
                         {editingId && <button type="button" className="cancel-edit-btn" onClick={cancelEdit}>Cancel</button>}
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleLogCycle}>
                        <div className="input-group">
                            <label className="input-label">Start Date</label>
                            <input
                                type="date"
                                className="input-field"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">End Date (optional)</label>
                            <input
                                type="date"
                                className="input-field"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary full-width">
                            {editingId ? 'Update Period' : 'Log Period'}
                        </button>
                    </form>
                </div>

                {/* List of past cycles */}
                <div className="cycles-list">
                    <h3>Past Cycles</h3>
                    {cycles.length === 0 ? (
                        <div className="empty-state glass-card">
                            <p>No cycles logged yet. Start by logging your first entry!</p>
                        </div>
                    ) : (
                        <div className="cycles-grid">
                            {cycles.map((cycle) => (
                                <div key={cycle.id} className="cycle-card glass-card">
                                    <div className="cycle-info">
                                        <div className="date-range">
                                            {new Date(cycle.startDate).toLocaleDateString()} - 
                                            {cycle.endDate ? new Date(cycle.endDate).toLocaleDateString() : 'Ongoing'}
                                        </div>
                                        {cycle.cycleLength && (
                                            <div className="cycle-len">
                                                <strong>{cycle.cycleLength}</strong> days
                                            </div>
                                        )}
                                    </div>
                                    <div className="card-actions">
                                        <button className="edit-btn" onClick={() => handleEditClick(cycle)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDelete(cycle.id)}>Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .cycle-container {
                    padding-bottom: 4rem;
                }
                h1 {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                }
                .subtitle {
                    color: var(--text-muted);
                    margin-bottom: 3rem;
                }
                .cycle-layout {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 3rem;
                    align-items: start;
                }
                .form-card {
                    padding: 2.5rem;
                }
                .form-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                h3 {
                    margin-bottom: 0;
                    color: var(--foreground);
                }
                .cancel-edit-btn {
                    background: transparent;
                    border: 1px solid var(--text-muted);
                    color: var(--text-muted);
                    padding: 0.2rem 0.8rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.8rem;
                }
                .cancel-edit-btn:hover {
                    background: rgba(0,0,0,0.05);
                }
                .full-width {
                    width: 100%;
                }
                .cycles-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }
                .cycle-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 2rem;
                }
                .cycle-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.3rem;
                }
                .date-range {
                    font-weight: 600;
                    font-size: 1.1rem;
                }
                .cycle-len {
                    color: var(--text-muted);
                    font-size: 0.9rem;
                }
                .card-actions {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }
                .edit-btn {
                    background: transparent;
                    border: none;
                    color: var(--primary);
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                .edit-btn:hover {
                    opacity: 0.7;
                    text-decoration: underline;
                }
                .delete-btn {
                    background: transparent;
                    border: none;
                    color: var(--error);
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                .delete-btn:hover {
                    opacity: 0.7;
                    text-decoration: underline;
                }
                .loading {
                    text-align: center;
                    padding: 5rem;
                }
                .error-message {
                    background: rgba(214, 48, 49, 0.1);
                    color: var(--error);
                    padding: 0.8rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                }
                .empty-state {
                    text-align: center;
                    padding: 3rem;
                    color: var(--text-muted);
                }

                @media (max-width: 900px) {
                    .cycle-layout {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default CyclePage;
