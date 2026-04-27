import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signOut } from '../lib/supabase'

export default function Navbar({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const role = user?.profile?.role

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    window.location.reload()
  }

  const navLinks = {
    player: [
      { to: '/joueurs', label: 'Joueurs' },
      { to: '/mon-profil', label: 'Mon profil' },
    ],
    recruiter: [
      { to: '/joueurs', label: 'Joueurs' },
      { to: '/messages', label: 'Messages' },
      { to: '/mon-profil-pro', label: 'Mon profil' },
    ],
    agent: [
      { to: '/joueurs', label: 'Joueurs' },
      { to: '/messages', label: 'Messages' },
      { to: '/mon-profil-pro', label: 'Mon profil' },
    ],
    club: [
      { to: '/joueurs', label: 'Joueurs' },
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
      background: 'rgba(26,10,46,0.95)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '64px',
    }}>
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
       <Link to={user ? '/joueurs' : '/'} style={{ textDecoration: 'none' }}>
  <span className="logo-text">NEXT GOAL</span>
<span className="logo-text">NEXT GOAL</span>
  style={{ height: '36px', width: 'auto', objectFit: 'contain' }} 
/>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                color: location.pathname === link.to ? 'var(--accent)' : 'var(--text2)',
                background: location.pathname === link.to ? 'rgba(192,132,252,0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
              <div style={{
                width: '32px', height: '32px',
                borderRadius: '50%',
                background: 'var(--bg3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: '600', color: 'var(--accent)',
                border: '1px solid var(--border)',
              }}>
                {user.email?.[0]?.toUpperCase()}
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleSignOut}>
                Déconnexion
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
              <Link to="/connexion" className="btn btn-secondary btn-sm">Connexion</Link>
              <Link to="/inscription" className="btn btn-primary btn-sm">S'inscrire</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
