import { Link } from 'react-router-dom'

export default function SignupChoice() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(192,132,252,0.08) 0%, transparent 60%)',
    }}>
      <div style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="logo-text" style={{ fontSize: '16px' }}>NEXT GOAL</span>
        </Link>

        <h1 style={{ fontSize: '1.8rem', fontWeight: '600', margin: '1.5rem 0 0.5rem', color: 'var(--text)' }}>
          Rejoindre Next Goal
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '3rem' }}>
          Choisis ton profil pour commencer
        </p>

        <div className="grid-2" style={{ gap: '1.5rem' }}>
          {/* Joueur */}
          <Link to="/inscription/joueur" style={{ textDecoration: 'none' }}>
            <div className="card" style={{
              textAlign: 'center', padding: '2.5rem 1.5rem',
              transition: 'all 0.2s', cursor: 'pointer',
              border: '1px solid var(--border)',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚽</div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text)' }}>
                Je suis joueur
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Crée ton profil sportif et fais-toi repérer par les recruteurs et agents partout en France.
              </p>
              <span className="btn btn-primary" style={{ width: '100%', display: 'block' }}>
                Créer mon profil
              </span>
            </div>
          </Link>

          {/* Pro */}
          <Link to="/inscription/pro" style={{ textDecoration: 'none' }}>
            <div className="card" style={{
              textAlign: 'center', padding: '2.5rem 1.5rem',
              transition: 'all 0.2s', cursor: 'pointer',
              border: '1px solid var(--border)',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text)' }}>
                Je suis professionnel
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Recruteur, agent ou club ? Accédez aux profils de joueurs motivés partout en France.
              </p>
              <span className="btn btn-secondary" style={{ width: '100%', display: 'block' }}>
                Accéder aux talents
              </span>
            </div>
          </Link>
        </div>

        <p style={{ marginTop: '2rem', fontSize: '14px', color: 'var(--text2)' }}>
          Déjà inscrit ?{' '}
          <Link to="/connexion" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
