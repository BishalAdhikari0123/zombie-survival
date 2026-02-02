'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get('registered')) {
            setSuccess('Registration successful! Please log in.');
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const data = await authApi.login(formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: '#0f172a',
            color: 'white',
            padding: '2rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '2.5rem',
                background: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Welcome Back
                </h1>
                <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '2rem' }}>Log in to continue your survival</p>

                {success && (
                    <div style={{ padding: '0.75rem', background: 'rgba(34, 197, 94, 0.2)', border: '1px solid #22c55e', borderRadius: '8px', color: '#86efac', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                        {success}
                    </div>
                )}

                {error && (
                    <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '8px', color: '#fca5a5', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.5rem' }}>Email</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem 1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white', outline: 'none' }}
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem 1rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white', outline: 'none' }}
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '0.75rem',
                            background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginTop: '0.5rem',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                    Don't have an account? <Link href="/register" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>Register</Link>
                </p>
            </div>

            <Link href="/" style={{ marginTop: '2rem', color: '#64748b', textDecoration: 'none', fontSize: '0.875rem' }}>
                ← Back to Main Menu
            </Link>
        </main>
    );
}
