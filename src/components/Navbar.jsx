import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signOut } from '../lib/supabase'

export default function Navbar({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const role = user?.profile?.role

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    window.location.reload()
  }

  const navLinks = {
    player: [
      { to: '/joueurs', label: 'Joueurs' },
      { to: '/messages', label: 'Messages' },
      { to: '/mon-profil', label: 'Mon profil' },
    ],
    recruiter: [
      { to: '/joueurs', label: 'Joueurs' },
      { to: '/favoris', label: 'Favoris' },
      { to: '/messages', label: 'Messages' },
      { to: '/mon-profil-pro', label: 'Mon profil' },
    ],
    agent: [
      { to: '/joueurs', label: 'Joueurs' },
      { to: '/favoris', label: 'Favoris' },
      { to: '/messages', label: 'Messages' },
      { to: '/mon-profil-pro', label: 'Mon profil' },
    ],
    club: [
      { to: '/joueurs', label: 'Joueurs' },
      { to: '/favoris', label: 'Favoris' },
      { to: '/messages', label: 'Messages' },
      { to: '/mon-profil-pro', label: 'Mon profil' },
    ],
    admin: [
      { to: '/joueurs', label: 'Joueurs' },
      { to: '/admin', label: 'Admin' },
      { to: '/messages', label: 'Messages' },
    ],
  }

  const links = role ? (navLinks[role] || []) : []

  return (
    <nav style={{
      background: 'rgba(8,8,8,0.95)',
      borderBottom: '1px solid #1a1a1a',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '64px',
      fontFamily: "'Barlow', sans-serif",
    }}>
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <Link to={user ? '/joueurs' : '/'} style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '22px',
            letterSpacing: '4px',
            color: '#B87FFF',
            textShadow: '0 0 24px rgba(184,127,255,0.45)',
            textTransform: 'uppercase',
          }}>NEXT GOAL</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          {links.map(link => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: '7px 14px',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  color: active ? '#B87FFF' : 'rgba(255,255,255,0.45)',
                  background: active ? 'rgba(184,127,255,0.1)' : 'transparent',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {link.label}
              </Link>
            )
          })}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '10px' }}>
              <div style={{
                width: '32px', height: '32px',
                borderRadius: '50%',
                background: 'rgba(184,127,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: '700', color: '#B87FFF',
                border: '1px solid rgba(184,127,255,0.3)',
                fontFamily: "'Bebas Neue', sans-serif",
              }}>
                {user.email?.[0]?.toUpperCase()}
              </div>
              <button onClick={handleSignOut} style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.7)',
                padding: '8px 16px',
                borderRadius: '5px',
                fontFamily: "'Barlow', sans-serif",
                fontWeight: '700',
                fontSize: '12px',
                letterSpacing: '0.5px',
                cursor: 'pointer',
              }}>
                Déconnexion
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
              <Link to="/connexion" style={{
                background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.7)', padding: '8px 16px', borderRadius: '5px',
                fontWeight: '700', fontSize: '12px', letterSpacing: '0.5px', textDecoration: 'none',
              }}>Connexion</Link>
              <Link to="/inscription" style={{
                background: '#B87FFF', border: '1px solid #B87FFF',
                color: '#fff', padding: '8px 16px', borderRadius: '5px',
                fontWeight: '700', fontSize: '12px', letterSpacing: '0.5px', textDecoration: 'none',
              }}>S'inscrire</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
