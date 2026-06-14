import { Link } from 'react-router-dom'
import './Signup.css'

export default function SignupChoice() {
  return (
    <div className="ngs fade-in">
      <div className="ngs-topbar">
        <Link to="/" className="ngs-logo">NEXT GOAL</Link>
        <div className="ngs-topbar-right">Déjà inscrit ? <Link to="/connexion">Connexion</Link></div>
      </div>

      <div className="ngs-wrapper">
        <div className="ngs-left">
          <div className="ngs-eyebrow">Inscription</div>
          <h2>Qui es-tu<br />sur le terrain ?</h2>
          <p className="ngs-left-sub">"Choisis ton profil. Le reste, on s'en occupe."</p>

          <div className="ngs-type-cards">
            <Link to="/inscription/joueur" className="ngs-type-card active">
              <div className="ngs-type-head">
                <div className="ngs-type-title">Joueur / Joueuse</div>
                <span className="ngs-type-badge ngs-badge-joueur">Gratuit</span>
              </div>
              <div className="ngs-type-desc">Tu veux être vu des recruteurs. Crée ton profil, renseigne tes stats et laisse les pros venir à toi.</div>
            </Link>

            <Link to="/inscription/pro" className="ngs-type-card">
              <div className="ngs-type-head">
                <div className="ngs-type-title">Recruteur / Agent / Club</div>
                <span className="ngs-type-badge ngs-badge-pro">Pro</span>
              </div>
              <div className="ngs-type-desc">Tu cherches des talents. Accède à l'annuaire complet, filtre par critères et contacte directement les joueurs.</div>
            </Link>
          </div>
        </div>

        <div className="ngs-right">
          <h3>Rejoindre Next Goal</h3>
          <p className="ngs-right-sub">"Le talent ne suffit pas. Il faut être vu."</p>
          <div className="ngs-info" style={{ lineHeight: 1.7 }}>
            Sélectionne ton type de profil à gauche pour commencer ton inscription.
            <br /><br />
            Les joueurs créent un profil sportif visible des recruteurs. Les professionnels accèdent à l'annuaire des talents.
          </div>
          <div className="ngs-signin">Déjà un compte ? <Link to="/connexion">Se connecter</Link></div>
        </div>
      </div>
    </div>
  )
}
