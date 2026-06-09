import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      sessionStorage.setItem('sbl_auth', '1');
      router.push('/dashboard');
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Saddleback Leather — CRO Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a0f0a 0%, #2c1810 50%, #3d2415 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Inter', sans-serif", padding: '20px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            width: '72px', height: '72px',
            background: 'linear-gradient(135deg, #c9a96e, #a07840)',
            borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: '32px',
          }}>🛠</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", color: '#f5ecd7',
            fontSize: '28px', fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.5px',
          }}>Saddleback Leather</h1>
          <p style={{ color: '#c9a96e', fontSize: '14px', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>
            CRO Performance Dashboard
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(201,169,110,0.2)', borderRadius: '16px',
          padding: '40px', width: '100%', maxWidth: '380px',
        }}>
          <p style={{ color: '#c9a96e', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 24px', textAlign: 'center' }}>
            Enter Access Code
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              placeholder="Password"
              style={{
                width: '100%', padding: '14px 16px',
                background: 'rgba(255,255,255,0.08)',
                border: error ? '1px solid #e55' : '1px solid rgba(201,169,110,0.3)',
                borderRadius: '10px', color: '#f5ecd7', fontSize: '16px',
                outline: 'none', marginBottom: '16px', boxSizing: 'border-box',
                fontFamily: "'Inter', sans-serif",
              }}
              autoFocus
            />
            {error && <p style={{ color: '#e57373', fontSize: '13px', margin: '-8px 0 16px', textAlign: 'center' }}>Incorrect password. Try again.</p>}
            <button
              type="submit" disabled={loading || !password}
              style={{
                width: '100%', padding: '14px',
                background: loading || !password ? 'rgba(201,169,110,0.3)' : 'linear-gradient(135deg, #c9a96e, #a07840)',
                border: 'none', borderRadius: '10px',
                color: loading || !password ? 'rgba(245,236,215,0.5)' : '#1a0f0a',
                fontSize: '15px', fontWeight: 600,
                cursor: loading || !password ? 'not-allowed' : 'pointer',
                fontFamily: "'Inter', sans-serif", letterSpacing: '0.3px',
              }}
            >{loading ? 'Verifying...' : 'View Dashboard →'}</button>
          </form>
        </div>
        <p style={{ color: 'rgba(201,169,110,0.4)', fontSize: '12px', marginTop: '32px' }}>Powered by GenieRocket CRO</p>
      </div>
    </>
  );
}
