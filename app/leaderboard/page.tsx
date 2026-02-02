'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { gameApi } from '@/lib/api';

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const data = await gameApi.getLeaderboard(20);
                setLeaderboard(data.leaderboard);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchLeaderboard();
    }, []);

    return (
        <main style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#0f172a',
            color: 'white',
            padding: '4rem 2rem'
        }}>
            <div style={{ width: '100%', maxWidth: '800px' }}>
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fbbf24', marginBottom: '1rem' }}>HALL OF FAME</h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.25rem' }}>The world's greatest survivors</p>
                </header>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading survivors...</div>
                ) : error ? (
                    <div style={{ padding: '2rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '12px', color: '#fca5a5', textAlign: 'center' }}>
                        Failed to load leaderboard: {error}
                    </div>
                ) : (
                    <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(51, 65, 85, 0.5)', color: '#94a3b8', fontSize: '0.875rem', textAlign: 'left' }}>
                                    <th style={{ padding: '1.5rem', fontWeight: '600' }}>RANK</th>
                                    <th style={{ padding: '1.5rem', fontWeight: '600' }}>SURVIVOR</th>
                                    <th style={{ padding: '1.5rem', fontWeight: '600' }}>WAVES</th>
                                    <th style={{ padding: '1.5rem', fontWeight: '600', textAlign: 'right' }}>SCORE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.length > 0 ? leaderboard.map((entry, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.05)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold', color: index < 3 ? '#fbbf24' : '#64748b' }}>
                                            #{index + 1}
                                        </td>
                                        <td style={{ padding: '1.5rem', fontWeight: '600' }}>{entry.username}</td>
                                        <td style={{ padding: '1.5rem', color: '#22c55e', fontWeight: 'bold' }}>{entry.waveReached}</td>
                                        <td style={{ padding: '1.5rem', textAlign: 'right', color: '#fff', fontSize: '1.125rem', fontFamily: 'monospace' }}>
                                            {entry.score.toLocaleString()}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>No sessions recorded yet. Be the first!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                    <Link href="/" style={{ padding: '1rem 2rem', background: '#334155', color: 'white', textDecoration: 'none', borderRadius: '12px', fontWeight: 'bold' }}>
                        BACK TO MENU
                    </Link>
                </div>
            </div>
        </main>
    );
}
