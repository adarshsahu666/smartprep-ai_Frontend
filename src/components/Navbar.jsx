import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import profileImg from "../assets/109846586.jpg";

// ── Replace with your real details ──────────────────────────
const MY_NAME      = 'Adarsh Sahu';
const MY_ROLE      = 'Full Stack Developer';
const MY_EMAIL     = 'sahuadarsh96@gmail.com';
const MY_PORTFOLIO = 'https://adarsh-portfolio.up.railway.app/';
const MY_GITHUB    = 'https://github.com/adarshsahu666';
const MY_LINKEDIN  = 'https://www.linkedin.com/in/adarsh-sahu-7b03a2242/';
// ────────────────────────────────────────────────────────────

// Inject keyframes
if (!document.getElementById('nb-kf')) {
  const st = document.createElement('style');
  st.id = 'nb-kf';
  st.innerHTML = `
    @keyframes navDropIn {
      from { opacity:0; transform: translateY(-8px) scale(0.97); }
      to   { opacity:1; transform: translateY(0) scale(1); }
    }
    @keyframes modalBgIn  { from { opacity:0; } to { opacity:1; } }
    @keyframes modalCardIn {
      from { opacity:0; transform: translateY(24px) scale(0.96); }
      to   { opacity:1; transform: translateY(0) scale(1); }
    }
    @keyframes mobileMenuIn {
      from { opacity:0; transform: translateY(-10px); }
      to   { opacity:1; transform: translateY(0); }
    }
    @media (max-width: 768px) {
      .navbar-center { display: none !important; }
      .navbar-hamburger { display: flex !important; }
      .navbar-right-desktop { display: none !important; }
    }
    @media (min-width: 769px) {
      .navbar-hamburger { display: none !important; }
      .navbar-mobile-menu { display: none !important; }
    }
  `;
  document.head.appendChild(st);
}

const GitHubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

/* ─────────────────────────────
   CONFIRMATION MODAL
───────────────────────────── */
function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15,23,42,0.4)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        animation: 'modalBgIn 0.2s ease',
      }}
    >
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '40px',
        width: '100%', maxWidth: '440px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.16), 0 4px 20px rgba(0,0,0,0.06)',
        border: '1px solid #f0f4f8',
        fontFamily: "'DM Sans', sans-serif",
        animation: 'modalCardIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <div style={{
          width: '60px', height: '60px', borderRadius: '18px',
          background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)',
          border: '1.5px solid #bfdbfe',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', marginBottom: '22px',
        }}>🚀</div>

        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800, fontSize: '22px',
          color: '#0f172a', letterSpacing: '-0.6px', marginBottom: '10px',
        }}>Ready to start practicing?</h2>

        <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.7, marginBottom: '24px' }}>
          You'll pick a topic, set difficulty, and get AI-generated MCQs with a timer.
        </p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
          {['AI-Generated', 'Timed Questions', 'Instant Feedback'].map(tag => (
            <span key={tag} style={{
              background: '#f8fafc', border: '1px solid #e2e8f0',
              borderRadius: '100px', padding: '5px 12px',
              fontSize: '12px', color: '#64748b', fontWeight: 500,
            }}>✓ {tag}</span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, background: '#f8fafc',
              border: '1.5px solid #e2e8f0', borderRadius: '12px',
              padding: '13px 0', fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px', fontWeight: 500, color: '#64748b', cursor: 'pointer',
            }}
          >Not Yet</button>

          <button
            onClick={onConfirm}
            style={{
              flex: 2, border: 'none', borderRadius: '12px', padding: '13px 0',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              fontFamily: "'Syne', sans-serif",
              fontSize: '14px', fontWeight: 700, color: '#fff', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37,99,235,0.32)',
            }}
          >Yes, Let's Go! →</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────
   LOGO SVG — Brain icon
───────────────────────────── */
const LogoIcon = () => (
  <div style={{
    width: '34px', height: '34px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(37,99,235,0.35)', flexShrink: 0,
  }}>
    {/* Brain SVG Icon */}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3.16A2.5 2.5 0 0 1 9.5 2Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3.16A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  </div>
);

/* ─────────────────────────────
   STYLES
───────────────────────────── */
const S = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'grid', gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center', padding: '0 40px', height: '66px',
    transition: 'background 0.3s, box-shadow 0.3s, border-color 0.3s',
  },
  scrolled: {
    background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid #e8edf4', boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
  },
  logo: {
    textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '9px',
    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '19px', color: '#0f172a',
  },
  accent: { color: '#2563eb' },
  centerList: { display: 'flex', alignItems: 'center', gap: '2px', listStyle: 'none', margin: 0, padding: 0 },
  navBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 500,
    padding: '7px 15px', borderRadius: '8px',
    transition: 'all 0.18s', color: '#64748b', whiteSpace: 'nowrap',
    textDecoration: 'none', display: 'inline-block',
  },
  right: { display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end' },
  profileBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '7px',
    background: 'none', cursor: 'pointer',
    border: '1.5px solid #e2e8f0', borderRadius: '100px',
    padding: '5px 12px 5px 5px',
    fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#334155',
    transition: 'all 0.18s',
  },
  dropWrap: { position: 'relative' },
  dropdown: {
    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
    background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '6px',
    minWidth: '210px', boxShadow: '0 16px 48px rgba(0,0,0,0.11)',
    zIndex: 300, animation: 'navDropIn 0.18s ease forwards', transformOrigin: 'top right',
  },
  dropHead: { padding: '10px 12px 12px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' },
  dropName: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '14px', color: '#0f172a' },
  dropRole: { fontSize: '12px', color: '#94a3b8', marginTop: '2px' },
  dropItem: {
    display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '10px',
    textDecoration: 'none', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
    color: '#334155', transition: 'all 0.15s', border: 'none', background: 'none',
    width: '100%', textAlign: 'left', cursor: 'pointer',
  },
  dropIcon: {
    width: '30px', height: '30px', borderRadius: '8px', background: '#f8fafc',
    border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', flexShrink: 0, transition: 'all 0.15s',
  },
  dropDivider: { height: '1px', background: '#f1f5f9', margin: '4px 2px' },
  cta: {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff',
    border: 'none', fontSize: '13px', fontWeight: 700,
    padding: '9px 20px', borderRadius: '100px', fontFamily: "'Syne', sans-serif",
    cursor: 'pointer', transition: 'all 0.2s',
    boxShadow: '0 4px 14px rgba(37,99,235,0.32)', whiteSpace: 'nowrap', marginLeft: '8px',
  },
  // Hamburger button
  hamburger: {
    background: 'none', border: '1.5px solid #e2e8f0', borderRadius: '10px',
    width: '40px', height: '40px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', color: '#334155', transition: 'all 0.18s',
    marginLeft: 'auto',
  },
  // Mobile menu overlay
  mobileMenu: {
    position: 'fixed', top: '66px', left: 0, right: 0, bottom: 0,
    background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)',
    zIndex: 99, padding: '24px 24px 40px',
    display: 'flex', flexDirection: 'column', gap: '8px',
    animation: 'mobileMenuIn 0.2s ease',
    overflowY: 'auto',
  },
  mobileLink: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '14px 16px', borderRadius: '12px',
    fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 500,
    color: '#334155', textDecoration: 'none', border: 'none',
    background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
    transition: 'all 0.15s',
  },
  mobileDivider: { height: '1px', background: '#f1f5f9', margin: '8px 0' },
  mobileCta: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', padding: '15px',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff',
    border: 'none', borderRadius: '14px', fontFamily: "'Syne', sans-serif",
    fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginTop: '8px',
    boxShadow: '0 4px 14px rgba(37,99,235,0.32)',
  },
};

const DROP_ITEMS = [
  { label: 'Portfolio', icon: '🌐', href: MY_PORTFOLIO },
  { label: 'GitHub',    icon: <GitHubIcon />, href: MY_GITHUB },
  { label: 'LinkedIn',  icon: <LinkedInIcon />, href: MY_LINKEDIN },
];

const NAV_ITEMS = [
  { label: 'Home', to: '/', icon: '🏠' },
  { label: 'Practice', to: '/quiz', icon: '📝', isModal: true },
  { label: 'AI Chat', to: '/chat', icon: '🤖' },
];

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [hovNav, setHovNav]           = useState(null);
  const [dropOpen, setDropOpen]       = useState(false);
  const [hovDrop, setHovDrop]         = useState(null);
  const [ctaHov, setCtaHov]           = useState(false);
  const [btnHov, setBtnHov]           = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const dropRef   = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // Lock scroll when modal or mobile menu open
  useEffect(() => {
    document.body.style.overflow = (showConfirm || menuOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showConfirm, menuOpen]);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleConfirm = () => {
    setShowConfirm(false);
    navigate('/quiz');
  };

  const navBtnStyle = (to) => ({
    ...S.navBtn,
    ...(location.pathname === to ? { color: '#2563eb', background: '#eff6ff' } : {}),
    ...(hovNav === to && location.pathname !== to ? { color: '#0f172a', background: '#f1f5f9' } : {}),
  });

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav style={{ ...S.nav, ...(scrolled ? S.scrolled : {}) }}>

        {/* LEFT — Logo */}
        <div>
          <Link to="/" style={S.logo}>
            <LogoIcon />
            Smart<span style={S.accent}>Prep</span>
            <span style={{
              fontSize: '10px', fontWeight: 600, color: '#7c3aed',
              background: '#f5f3ff', border: '1px solid #ddd6fe',
              borderRadius: '6px', padding: '2px 6px', marginLeft: '2px',
            }}>AI</span>
          </Link>
        </div>

        {/* CENTER — Desktop Nav */}
        <ul className="navbar-center" style={S.centerList}>
          <li>
            <Link to="/" style={navBtnStyle('/')}
              onMouseEnter={() => setHovNav('/')} onMouseLeave={() => setHovNav(null)}>
              Home
            </Link>
          </li>
          <li>
            <button style={navBtnStyle('/quiz')}
              onClick={() => setShowConfirm(true)}
              onMouseEnter={() => setHovNav('/quiz')} onMouseLeave={() => setHovNav(null)}>
              Practice
            </button>
          </li>
          <li>
            <Link to="/chat" style={navBtnStyle('/chat')}
              onMouseEnter={() => setHovNav('/chat')} onMouseLeave={() => setHovNav(null)}>
              AI Chat
            </Link>
          </li>
        </ul>

        {/* RIGHT — Desktop */}
        <div className="navbar-right-desktop" style={S.right}>

          {/* Profile dropdown */}
          <div style={S.dropWrap} ref={dropRef}>
            <button
              style={{
                ...S.profileBtn,
                ...(dropOpen || btnHov ? { borderColor: '#93c5fd', background: '#f8fafc' } : {}),
              }}
              onClick={() => setDropOpen(o => !o)}
              onMouseEnter={() => setBtnHov(true)}
              onMouseLeave={() => setBtnHov(false)}
            >
              <img src={profileImg} alt="Profile" style={{
                width: '28px', height: '28px', borderRadius: '50%',
                objectFit: 'cover', border: '2px solid #e5e7eb',
              }} />
              <span>Profile</span>
              <span style={{
                fontSize: '10px', color: '#94a3b8',
                transition: 'transform 0.2s',
                transform: dropOpen ? 'rotate(180deg)' : 'none',
              }}>▾</span>
            </button>

            {dropOpen && (
              <div style={S.dropdown}>
                <div style={S.dropHead}>
                  <div style={S.dropName}>{MY_NAME}</div>
                  <div style={S.dropRole}>{MY_ROLE}</div>
                </div>

                {DROP_ITEMS.map(({ label, icon, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    style={{ ...S.dropItem, ...(hovDrop === label ? { background: '#f8fafc', color: '#2563eb' } : {}) }}
                    onMouseEnter={() => setHovDrop(label)} onMouseLeave={() => setHovDrop(null)}
                    onClick={() => setDropOpen(false)}
                  >
                    <span style={{ ...S.dropIcon, ...(hovDrop === label ? { background: '#eff6ff', border: '1px solid #bfdbfe' } : {}) }}>
                      {icon}
                    </span>
                    {label}
                    <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#cbd5e1' }}>↗</span>
                  </a>
                ))}

                <div style={S.dropDivider} />

                <a href={`mailto:${MY_EMAIL}`}
                  style={{ ...S.dropItem, color: '#2563eb', background: '#eff6ff', fontWeight: 600, ...(hovDrop === 'contact' ? { background: '#dbeafe' } : {}) }}
                  onMouseEnter={() => setHovDrop('contact')} onMouseLeave={() => setHovDrop(null)}
                  onClick={() => setDropOpen(false)}
                >
                  <span style={{ ...S.dropIcon, background: '#dbeafe', border: '1px solid #bfdbfe' }}>✉️</span>
                  Contact Me
                </a>
              </div>
            )}
          </div>

          {/* CTA */}
          <button
            style={{ ...S.cta, ...(ctaHov ? { transform: 'translateY(-1px)', boxShadow: '0 8px 24px rgba(37,99,235,0.44)' } : {}) }}
            onClick={() => setShowConfirm(true)}
            onMouseEnter={() => setCtaHov(true)}
            onMouseLeave={() => setCtaHov(false)}
          >
            Start Quiz →
          </button>
        </div>

        {/* RIGHT — Hamburger (mobile only) */}
        <div className="navbar-hamburger" style={{ display: 'none', justifyContent: 'flex-end' }}>
          <button
            style={{
              ...S.hamburger,
              ...(menuOpen ? { background: '#eff6ff', borderColor: '#93c5fd', color: '#2563eb' } : {}),
            }}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <div className="navbar-mobile-menu" style={S.mobileMenu}>

          {/* Profile card */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '16px', background: '#f8fafc', borderRadius: '14px',
            border: '1px solid #e2e8f0', marginBottom: '8px',
          }}>
            <img src={profileImg} alt="Profile" style={{
              width: '44px', height: '44px', borderRadius: '50%',
              objectFit: 'cover', border: '2px solid #e5e7eb',
            }} />
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{MY_NAME}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>{MY_ROLE}</div>
            </div>
          </div>

          {/* Nav links */}
          {NAV_ITEMS.map(({ label, to, icon, isModal }) => (
            isModal ? (
              <button key={label}
                style={{
                  ...S.mobileLink,
                  ...(location.pathname === to ? { color: '#2563eb', background: '#eff6ff' } : {}),
                }}
                onClick={() => { setMenuOpen(false); setShowConfirm(true); }}
              >
                <span style={{ fontSize: '18px' }}>{icon}</span>
                {label}
                {location.pathname === to && <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#2563eb' }}>●</span>}
              </button>
            ) : (
              <Link key={label} to={to}
                style={{
                  ...S.mobileLink,
                  ...(location.pathname === to ? { color: '#2563eb', background: '#eff6ff' } : {}),
                }}
                onClick={() => setMenuOpen(false)}
              >
                <span style={{ fontSize: '18px' }}>{icon}</span>
                {label}
                {location.pathname === to && <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#2563eb' }}>●</span>}
              </Link>
            )
          ))}

          <div style={S.mobileDivider} />

          {/* Social links */}
          {DROP_ITEMS.map(({ label, icon, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              style={S.mobileLink} onClick={() => setMenuOpen(false)}
            >
              <span style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: '#f1f5f9', border: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
              }}>{icon}</span>
              {label}
              <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#cbd5e1' }}>↗</span>
            </a>
          ))}

          <a href={`mailto:${MY_EMAIL}`} style={{ ...S.mobileLink, color: '#2563eb' }} onClick={() => setMenuOpen(false)}>
            <span style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: '#dbeafe', border: '1px solid #bfdbfe',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
            }}>✉️</span>
            Contact Me
          </a>

          <div style={S.mobileDivider} />

          {/* CTA */}
          <button style={S.mobileCta} onClick={() => { setMenuOpen(false); setShowConfirm(true); }}>
            🚀 Start Quiz Now
          </button>
        </div>
      )}

      {/* ── CONFIRM MODAL ── */}
      {showConfirm && (
        <ConfirmModal
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}