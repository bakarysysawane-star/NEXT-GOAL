import { Link } from 'react-router-dom'

export default function SignupSuccess() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', textAlign: 'center',
    }}>
      <div style={{ maxWidth: '480px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎉</div>
        <span className="logo-text" style={{ fontSize: '14px' }}>NEXT GOAL</span>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--text)', margin: '1rem 0 0.5rem' }}>
          Inscription réussie !
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: '14px', lineHeight: 1.7, marginBottom: '2rem' }}>
          Ton profil a été soumis avec succès. Bakary le validera sous 48h et il sera visible sur la plateforme.
          <br /><br />
          En attendant, tu peux te connecter et accéder à l'annuaire des joueurs.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/connexion" className="btn btn-primary" style={{ padding: '12px 28px' }}>
            Se connecter
          </Link>
          <Link to="/" className="btn btn-secondary" style={{ padding: '12px 28px' }}>
            Accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
