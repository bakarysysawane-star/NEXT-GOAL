import { Link, useNavigate } from 'react-router-dom'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="ngl fade-in">

      {/* HERO */}
      <section className="ngl-hero">
        <div className="ngl-eyebrow">Plateforme de détection — Football amateur</div>
        <h1>T'as le niveau.<br /><em>Fais-toi voir.</em></h1>
        <p className="ngl-hero-sub">
          "Les meilleurs talents restent invisibles parce qu'ils jouent au mauvais endroit. Next Goal change ça."
        </p>
        <div className="ngl-hero-actions">
          <Link to="/inscription/joueur" className="ngl-btn-main">Créer mon profil joueur</Link>
          <Link to="/inscription/pro" className="ngl-btn-ghost">Je recrute des joueurs</Link>
        </div>
        <p className="ngl-hero-login">Déjà inscrit ? <Link to="/connexion">Se connecter</Link></p>
        <div className="ngl-numbers">
          <div>
            <div className="ngl-num-val">100%</div>
            <div className="ngl-num-label">Gratuit</div>
          </div>
          <div>
            <div className="ngl-num-val">FR</div>
            <div className="ngl-num-label">Toute la France</div>
          </div>
          <div>
            <div className="ngl-num-val">IA</div>
            <div className="ngl-num-label">Matching intelligent</div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="ngl-manifesto">
        <div className="ngl-label">Le constat</div>
        <div className="ngl-manifesto-text">
          Des milliers de joueurs talentueux <em>restent dans l'ombre</em> — non pas par manque de niveau, mais par manque de visibilité.
        </div>
      </section>

      {/* PROFILS */}
      <section className="ngl-profiles">
        <div className="ngl-profile-block">
          <div className="ngl-profile-type">Profil joueur</div>
          <div className="ngl-profile-title">Tu joues.<br />On te fait voir.</div>
          <div className="ngl-profile-desc">"Ton profil, c'est ton CV de terrain. Remplis-le une fois. Les recruteurs le consultent en permanence."</div>
          <div className="ngl-feature-list">
            <div className="ngl-feature"><span className="ngl-feature-dot"></span>Carte Next Goal style FIFA</div>
            <div className="ngl-feature"><span className="ngl-feature-dot"></span>Stats saison, vidéos highlights</div>
            <div className="ngl-feature"><span className="ngl-feature-dot"></span>Messagerie directe avec les pros</div>
            <div className="ngl-feature"><span className="ngl-feature-dot"></span>Mode "En recherche active"</div>
            <div className="ngl-feature"><span className="ngl-feature-dot"></span>Historique de clubs</div>
          </div>
        </div>
        <div className="ngl-profile-block">
          <div className="ngl-profile-type">Profil pro</div>
          <div className="ngl-profile-title">Tu cherches.<br />On te trouve les profils.</div>
          <div className="ngl-profile-desc">"Décris ce que tu veux en langage naturel. L'IA te sort les profils qui correspondent exactement."</div>
          <div className="ngl-feature-list">
            <div className="ngl-feature"><span className="ngl-feature-dot"></span>Recherche IA en langage naturel</div>
            <div className="ngl-feature"><span className="ngl-feature-dot"></span>Filtres avancés multi-critères</div>
            <div className="ngl-feature"><span className="ngl-feature-dot"></span>Listes de favoris personnalisées</div>
            <div className="ngl-feature"><span className="ngl-feature-dot"></span>Alertes profils automatiques</div>
            <div className="ngl-feature"><span className="ngl-feature-dot"></span>Badge profil vérifié</div>
          </div>
        </div>
      </section>

      {/* CARTE FIFA */}
      <section className="ngl-card-section">
        <div>
          <div className="ngl-label">La carte Next Goal</div>
          <div className="ngl-card-title">Ton profil.<br />En un coup d'œil.</div>
          <div className="ngl-card-quote">"Un recruteur a 10 secondes pour regarder un profil. Ta carte Next Goal lui donne tout — poste, niveau, catégorie, stats. Rien de plus. Rien de moins."</div>
        </div>
        <div className="ngl-fifa">
          <div className="ngl-fifa-top">
            <div className="ngl-fifa-pos">ATT</div>
            <div className="ngl-fifa-logo">NEXT<br />GOAL</div>
          </div>
          <div className="ngl-fifa-photo">KD</div>
          <div className="ngl-fifa-meta">AS Saint-Denis · U21 · R1</div>
          <div className="ngl-fifa-name">DUPONT</div>
          <div className="ngl-fifa-stats">
            <div className="ngl-fifa-col">
              <div className="ngl-fifa-stat"><span className="ngl-fifa-val">24</span><span className="ngl-fifa-lbl">MJ</span></div>
              <div className="ngl-fifa-stat"><span className="ngl-fifa-val">14</span><span className="ngl-fifa-lbl">BUT</span></div>
              <div className="ngl-fifa-stat"><span className="ngl-fifa-val">7</span><span className="ngl-fifa-lbl">PAS</span></div>
            </div>
            <div className="ngl-fifa-sep"></div>
            <div className="ngl-fifa-col">
              <div className="ngl-fifa-stat"><span className="ngl-fifa-val">21</span><span className="ngl-fifa-lbl">ÂGE</span></div>
              <div className="ngl-fifa-stat"><span className="ngl-fifa-val">FR</span><span className="ngl-fifa-lbl">NAT</span></div>
              <div className="ngl-fifa-stat"><span className="ngl-fifa-val">D</span><span className="ngl-fifa-lbl">PIED</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ANNUAIRE APERCU */}
      <section className="ngl-annuaire">
        <div className="ngl-label">Annuaire</div>
        <div className="ngl-annuaire-title">Les profils en recherche active</div>
        <div className="ngl-annuaire-sub">"Ces joueurs sont prêts. À toi de jouer."</div>
        <div className="ngl-search-bar">
          <input className="ngl-search-input" placeholder="Ex : attaquant U19 en R1 Île-de-France, disponible immédiatement..." readOnly onClick={() => navigate('/inscription/pro')} />
          <button className="ngl-search-btn" onClick={() => navigate('/inscription/pro')}>Recherche IA</button>
        </div>
        <div className="ngl-player-grid">
          <div className="ngl-player-card">
            <div className="ngl-player-top">
              <div className="ngl-player-avatar">KD</div>
              <div><div className="ngl-player-name">Karim Diallo</div><div className="ngl-player-pos">Ailier gauche · Paris</div></div>
            </div>
            <div className="ngl-player-stats">
              <div className="ngl-stat-mini"><div className="ngl-stat-mini-val">18</div><div className="ngl-stat-mini-lbl">MJ</div></div>
              <div className="ngl-stat-mini"><div className="ngl-stat-mini-val">11</div><div className="ngl-stat-mini-lbl">BUT</div></div>
              <div className="ngl-stat-mini"><div className="ngl-stat-mini-val">6</div><div className="ngl-stat-mini-lbl">PAS</div></div>
            </div>
            <div className="ngl-player-tags">
              <span className="ngl-tag ngl-tag-purple">U19</span>
              <span className="ngl-tag ngl-tag-white">R1 IDF</span>
              <span className="ngl-tag ngl-tag-green">Recherche active</span>
            </div>
          </div>
          <div className="ngl-player-card">
            <div className="ngl-player-top">
              <div className="ngl-player-avatar">SM</div>
              <div><div className="ngl-player-name">Sarah Mbaye</div><div className="ngl-player-pos">Milieu central · Lyon</div></div>
            </div>
            <div className="ngl-player-stats">
              <div className="ngl-stat-mini"><div className="ngl-stat-mini-val">22</div><div className="ngl-stat-mini-lbl">MJ</div></div>
              <div className="ngl-stat-mini"><div className="ngl-stat-mini-val">5</div><div className="ngl-stat-mini-lbl">BUT</div></div>
              <div className="ngl-stat-mini"><div className="ngl-stat-mini-val">12</div><div className="ngl-stat-mini-lbl">PAS</div></div>
            </div>
            <div className="ngl-player-tags">
              <span className="ngl-tag ngl-tag-purple">Senior F</span>
              <span className="ngl-tag ngl-tag-white">D2F</span>
              <span className="ngl-tag ngl-tag-green">Recherche active</span>
            </div>
          </div>
          <div className="ngl-player-card">
            <div className="ngl-player-top">
              <div className="ngl-player-avatar">LT</div>
              <div><div className="ngl-player-name">Lucas Traoré</div><div className="ngl-player-pos">Gardien · Marseille</div></div>
            </div>
            <div className="ngl-player-stats">
              <div className="ngl-stat-mini"><div className="ngl-stat-mini-val">20</div><div className="ngl-stat-mini-lbl">MJ</div></div>
              <div className="ngl-stat-mini"><div className="ngl-stat-mini-val">14</div><div className="ngl-stat-mini-lbl">CS</div></div>
              <div className="ngl-stat-mini"><div className="ngl-stat-mini-val">U21</div><div className="ngl-stat-mini-lbl">CAT</div></div>
            </div>
            <div className="ngl-player-tags">
              <span className="ngl-tag ngl-tag-purple">U21</span>
              <span className="ngl-tag ngl-tag-white">R2 PACA</span>
              <span className="ngl-tag ngl-tag-green">Recherche active</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="ngl-cta">
        <h2>Prêt à passer<br /><em>au niveau supérieur ?</em></h2>
        <p>"Le talent ne suffit pas. Il faut être vu. C'est pour ça qu'on a créé Next Goal."</p>
        <div className="ngl-cta-btns">
          <Link to="/inscription/joueur" className="ngl-btn-main">Créer mon profil joueur</Link>
          <Link to="/inscription/pro" className="ngl-btn-ghost">Je recrute des joueurs</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ngl-footer">
        <div className="ngl-footer-logo">NEXT GOAL</div>
        <div className="ngl-footer-links">
          <a href="mailto:bakary.sy.sawane@gmail.com">Contact</a>
          <a href="https://instagram.com/next_goal_idf" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://tiktok.com/@next.goal.idf" target="_blank" rel="noreferrer">TikTok</a>
        </div>
      </footer>

    </div>
  )
}
