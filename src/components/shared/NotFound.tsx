import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      {/* Simple navigation bar */}
      <nav style={{ padding: '1rem 2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Link
          to="/"
          style={{
            color: '#ffffff',
            textDecoration: 'none',
            fontSize: '1.25rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Your Wealth
        </Link>
      </nav>

      {/* 404 content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '6rem',
          fontWeight: 700,
          margin: 0,
          background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.75rem', margin: '1rem 0', fontWeight: 600 }}>
          Page Not Found
        </h2>
        <p style={{ fontSize: '1rem', margin: '0 0 2rem 0', opacity: 0.8, maxWidth: '500px' }}>
          Sorry, we couldn't find the page you're looking for. The page may have been moved or doesn't exist.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            background: '#14b8a6',
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: '0.5rem',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#0d9488';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#14b8a6';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Return Home
        </Link>
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          opacity: 0.7
        }}>
          If you believe this is an error, please return to the home page and navigate from there.
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: '1rem 2rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center', opacity: 0.7 }}>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          © 2026 Your Wealth. All data stored locally in your browser.
        </p>
      </footer>
    </div>
  );
}
