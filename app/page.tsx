import Link from "next/link";

export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '2rem',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>
        🧟 Zombie Survival
      </h1>
      <p style={{ fontSize: '1.25rem', textAlign: 'center', maxWidth: '600px' }}>
        Survive waves of zombies in this fast-paced top-down shooter.
        Use WASD or Arrow keys to move, click to shoot!
      </p>
      <Link 
        href="/game"
        style={{
          padding: '1rem 2rem',
          fontSize: '1.5rem',
          background: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background 0.2s'
        }}
      >
        Start Game
      </Link>
    </main>
  );
}
