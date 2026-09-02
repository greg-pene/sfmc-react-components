import React from 'react';
import { Link } from 'react-router-dom';

const DevNav = () => {
  const search = window.location.search;
  return (
    <nav
      style={{
        display: 'flex',
        gap: '12px',
        padding: '8px 16px',
        background: '#1e293b',
        borderBottom: '2px solid #3b82f6',
        fontFamily: 'sans-serif',
        fontSize: '13px'
      }}
    >
      <span style={{ color: '#94a3b8', fontWeight: 600, marginRight: '8px' }}>DEV NAV:</span>
      {[
        { to: '/web-image', label: 'Web Image' },
        { to: '/advanced', label: 'Advanced' },
        { to: '/adv-edit', label: 'Adv Editor' },
        { to: '/video-2-gif', label: 'Video2Gif' },
        { to: '/gif-advanced', label: 'Gif Advanced' }
      ].map(({ to, label }) => (
        <Link
          key={to}
          to={to + search}
          style={{
            color: '#60a5fa',
            textDecoration: 'none',
            padding: '2px 8px',
            borderRadius: '4px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => (e.target.style.background = '#334155')}
          onMouseLeave={(e) => (e.target.style.background = 'transparent')}
        >
          {label}
        </Link>
      ))}
      <button
        onClick={() => {
          sessionStorage.removeItem('cld-image-sdk-data');
          window.location.reload();
        }}
        style={{
          marginLeft: 'auto',
          color: '#f87171',
          background: 'transparent',
          border: '1px solid #f87171',
          padding: '2px 8px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '13px',
          fontFamily: 'sans-serif',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => (e.target.style.background = '#7f1d1d')}
        onMouseLeave={(e) => (e.target.style.background = 'transparent')}
      >
        Clear Dev Cache
      </button>
    </nav>
  );
};

export default DevNav;
