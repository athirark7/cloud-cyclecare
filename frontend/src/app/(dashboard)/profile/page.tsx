'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) return <div className="loading">Loading your profile...</div>;

    return (
        <div className="profile-container animate-fade-in">
            <h1>Your Profile</h1>
            <p className="subtitle">Manage your account and preferences</p>
            
            <div className="profile-layout">
                <div className="glass-card profile-card">
                    <div className="avatar-placeholder">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
                    </div>
                    <h2>{user?.name || 'Cycle Care User'}</h2>
                    <p className="user-email">{user?.email}</p>
                    <div className="status-badge">Active Account</div>
                </div>

                <div className="glass-card settings-card">
                    <h3>Account Settings</h3>
                    <div className="setting-group">
                        <label>Email Address</label>
                        <input className="input-field" type="email" value={user?.email} readOnly disabled />
                    </div>
                    <div className="setting-group">
                        <label>Display Name</label>
                        <input className="input-field" type="text" value={user?.name || ''} readOnly disabled />
                        <span className="help-text">Editing temporarily disabled.</span>
                    </div>
                    <div className="setting-group">
                        <label>Data Privacy</label>
                        <p className="help-text" style={{marginTop: 5}}>Your data is encrypted and secure. We never share your health records.</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .profile-container { padding-bottom: 4rem; }
                h1 { font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--primary-dark); }
                .subtitle { color: var(--text-muted); margin-bottom: 3rem; }
                .profile-layout { display: grid; grid-template-columns: 1fr 2fr; gap: 3rem; align-items: start; }
                .profile-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: 3rem 2rem;
                }
                .avatar-placeholder {
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, var(--primary-light), var(--primary));
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    font-weight: bold;
                    margin-bottom: 1.5rem;
                    text-transform: uppercase;
                }
                .profile-card h2 { margin-bottom: 0.5rem; }
                .user-email { color: var(--text-muted); margin-bottom: 1.5rem; }
                .status-badge {
                    background: rgba(46, 213, 115, 0.1);
                    color: #2ed573;
                    padding: 0.4rem 1rem;
                    border-radius: 50px;
                    font-size: 0.85rem;
                    font-weight: 600;
                }
                .settings-card { padding: 3rem 2.5rem; }
                .settings-card h3 { margin-bottom: 2rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; }
                .setting-group { margin-bottom: 1.5rem; display: flex; flex-direction: column; }
                .setting-group label {
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    font-size: 0.95rem;
                    color: var(--primary-dark);
                }
                .input-field {
                    background: var(--glass-bg);
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .help-text { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem; }
                .loading { text-align: center; padding: 5rem; }
                @media (max-width: 900px) { .profile-layout { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
};

export default ProfilePage;
