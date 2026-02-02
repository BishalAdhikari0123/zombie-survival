'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '2rem',
      padding: '2rem',
      background: '#0f172a',
      color: 'white',
      backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)'
    }}>
      <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#94a3b8' }}>Welcome, <strong style={{ color: '#fff' }}>{user.username}</strong></span>
            <button
              onClick={handleLogout}
              style={{ padding: '0.5rem 1rem', background: '#334155', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Login</Link>
            <Link href="/register" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 'bold' }}>Register</Link>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '5rem',
          fontWeight: '900',
          marginBottom: '1rem',
          textShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
          background: 'linear-gradient(to bottom, #fff 0%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ZOMBIE<br /><span style={{ background: 'linear-gradient(to right, #dc2626, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SURVIVAL</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Face the horde. Collect weapons. Survive as long as you can in this high-intensity top-down shooter.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '300px' }}>
        <Link
          href="/game"
          style={{
            padding: '1.25rem',
            fontSize: '1.5rem',
            background: 'linear-gradient(to right, #dc2626, #b91c1c)',
            color: 'white',
            textAlign: 'center',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.3)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          START SURVIVING
        </Link>

        <Link
          href="/leaderboard"
          style={{
            padding: '1rem',
            fontSize: '1.1rem',
            background: 'rgba(30, 41, 59, 0.5)',
            color: 'white',
            textAlign: 'center',
            textDecoration: 'none',
            borderRadius: '12px',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            fontWeight: '500'
          }}
        >
          LEADERBOARD
        </Link>
      </div>

      <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem', color: '#475569' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#94a3b8' }}>10+</div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Weapons</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#94a3b8' }}>∞</div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Waves</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#94a3b8' }}>2D</div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Chaos</div>
        </div>
      </div>
    </main>
  );
}
