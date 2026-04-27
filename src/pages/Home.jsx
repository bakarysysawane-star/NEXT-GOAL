import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="fade-in">
      {/* Hero */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(192,132,252,0.12) 0%, transparent 70%)',
        position: 'relative',
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="logo-text" style={{ fontSize: 'clamp(18px, 4vw, 28px)', lineHeight: 2 }}>
            NEXT GOAL
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: '600',
          color: 'var(--text)',
          lineHeight: 1.2,
          marginBottom: '1.5rem',
          maxWidth: '700px',
        }}>
          Mettre en lumière les futures cracks
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'var(--text2)',
          maxWidth: '560px',
          lineHeight: 1.7,
          marginBottom: '3rem',
        }}>
          La plateforme qui connecte les joueurs amateurs de toute la <strong style={{ color: 'var(--text)' }}>France</strong> avec les recruteurs et agents à la recherche des pépites de demain.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4rem' }}>
          <Link to="/inscription/joueur" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '15px' }}>
            ⚽ Je suis joueur
          </Link>
          <Link to="/inscription/pro" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '15px' }}>
            🎯 Je suis recruteur / agent / club
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { num: '100%', label: 'Gratuit' },
            { num: '🇫🇷', label: 'Toute la France' },
            { num: 'IA', label: 'Matching intelligent' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--accent)' }}>{s.num}</div>
              <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px' }}>Découvrir</div>
          <div style={{ width: '1px', height: '40px', background: 'var(--border)', margin: '0 auto' }} />
        </div>
      </div>

      {/* How it works */}
      <div className="container" style={{ padding: '5rem 1.5rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '600', marginBottom: '3rem', color: 'var(--text)' }}>
          Comment ça marche ?
        </h2>
        <div className="grid-3">
          {[
            { icon: '📝', step: '01', title: 'Inscris-toi', desc: 'Crée ton profil gratuitement avec tes infos, stats et vidéos depuis toute la France.' },
            { icon: '👁', step: '02', title: 'Sois visible', desc: 'Ton profil est consulté par les recruteurs et agents partout en France.' },
            { icon: '🎯', step: '03', title: 'Sois recruté', desc: 'Un recruteur te contacte et tu passes au niveau supérieur.' },
          ].map(s => (
            <div key={s.step} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{s.icon}</div>
              <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '600', letterSpacing: '2px', marginBottom: '8px' }}>
                ÉTAPE {s.step}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text)' }}>{s.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Regions */}
      <div style={{ background: 'var(--bg2)', padding: '4rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '600', marginBottom: '2rem', color: 'var(--text)' }}>
            Couvre toute la France
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {['Île-de-France', 'PACA', 'Occitanie', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine',
              'Hauts-de-France', 'Grand Est', 'Normandie', 'Bretagne', 'Pays de la Loire',
              'Centre-Val de Loire', 'Bourgogne-Franche-Comté', 'Corse'].map(r => (
              <span key={r} style={{
                padding: '5px 14px',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                fontSize: '12px',
                color: 'var(--text2)',
              }}>{r}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text)' }}>
          Prêt à franchir le cap ?
        </h2>
        <p style={{ color: 'var(--text2)', marginBottom: '2rem' }}>
          Rejoins la communauté Next Goal et donne-toi les moyens d'être repéré.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/inscription/joueur" className="btn btn-primary" style={{ padding: '14px 32px' }}>
            Créer mon profil joueur
          </Link>
          <Link to="/connexion" className="btn btn-secondary" style={{ padding: '14px 32px' }}>
            Se connecter
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '2rem',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
        color: 'var(--text3)',
        fontSize: '13px',
      }}>
        <span className="logo-text" style={{ fontSize: '10px' }}>NEXT GOAL</span>
        <p style={{ marginTop: '8px' }}>
          Contact : <a href="mailto:bakary.sy.sawane@gmail.com" style={{ color: 'var(--accent)' }}>bakary.sy.sawane@gmail.com</a>
          {' · '}
          <a href="https://instagram.com/next_goal_idf" style={{ color: 'var(--accent)' }}>@next_goal_idf</a>
        </p>
      </footer>
    </div>
  )
}
