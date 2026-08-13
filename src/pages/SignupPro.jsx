import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp, supabase } from '../lib/supabase'
import './Signup.css'

const REGIONS = ['Toute la France','Île-de-France','PACA','Occitanie','Auvergne-Rhône-Alpes',
  'Nouvelle-Aquitaine','Hauts-de-France','Grand Est','Normandie','Bretagne']

export default function SignupPro() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    nom: '', prenom: '', role_pro: 'recruiter',
    organisation: '', region_couverte: 'Toute la France',
    email_pro: '', whatsapp: '',
    postes_recherches: '', criteres: '', niveau_cible: '',
    justificatif: '', engagement_charte: false,
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return }
    if (!form.organisation.trim()) { setError('Merci d\'indiquer ton organisation, club ou agence.'); return }
    if (!form.email_pro.trim()) { setError('Merci d\'indiquer un email professionnel pour vérifier ton profil.'); return }
    if (!form.whatsapp.trim()) { setError('Merci d\'indiquer un numéro de téléphone / WhatsApp.'); return }
    if (!form.justificatif.trim()) { setError('Merci de fournir un justificatif de ton statut professionnel (lien vers ton club, ta licence, ton profil officiel...).'); return }
    if (!form.engagement_charte) { setError('Tu dois accepter la charte de bonne conduite pour créer un compte professionnel.'); return }
    setLoading(true); setError('')
    try {
      const data = await signUp(form.email, form.password, form.role_pro, `${form.prenom} ${form.nom}`)
      if (data.user) {
        await supabase.from('pro_profiles').insert({
          user_id: data.user.id,
          nom: form.nom, prenom: form.prenom,
          role_pro: form.role_pro,
          organisation: form.organisation,
          region_couverte: form.region_couverte,
          email_pro: form.email_pro,
          whatsapp: form.whatsapp,
          postes_recherches: form.postes_recherches,
          criteres: form.criteres,
          niveau_cible: form.niveau_cible,
          justificatif: form.justificatif,
          engagement_charte: form.engagement_charte,
        })
        navigate('/inscription/succes')
      }
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="ngs fade-in">
      <div className="ngs-topbar">
        <Link to="/" className="ngs-logo">NEXT GOAL</Link>
        <div className="ngs-topbar-right">Déjà inscrit ? <Link to="/connexion">Connexion</Link></div>
      </div>

      <div className="ngs-wrapper">
        {/* GAUCHE */}
        <div className="ngs-left">
          <div className="ngs-eyebrow">Inscription</div>
          <h2>Qui es-tu<br />sur le terrain ?</h2>
          <p className="ngs-left-sub">"Choisis ton profil. Le reste, on s'en occupe."</p>

          <div className="ngs-type-cards">
            <Link to="/inscription/joueur" className="ngs-type-card">
              <div className="ngs-type-head">
                <div className="ngs-type-title">Joueur / Joueuse</div>
                <span className="ngs-type-badge ngs-badge-joueur">Gratuit</span>
              </div>
              <div className="ngs-type-desc">Tu veux être vu des recruteurs. Crée ton profil, renseigne tes stats et laisse les pros venir à toi.</div>
            </Link>
            <div className="ngs-type-card active">
              <div className="ngs-type-head">
                <div className="ngs-type-title">Recruteur / Agent / Club</div>
                <span className="ngs-type-badge ngs-badge-pro">Pro</span>
              </div>
              <div className="ngs-type-desc">Tu cherches des talents. Accède à l'annuaire complet, filtre par critères et contacte directement les joueurs.</div>
            </div>
          </div>
        </div>

        {/* DROITE */}
        <div className="ngs-right">
          <h3>Crée ton compte pro</h3>
          <p className="ngs-right-sub">"Accède à tous les talents amateurs de France."</p>

          {error && <div className="ngs-error">{error}</div>}

          <form onSubmit={handleSubmit} className="ngs-form">
            <div className="ngs-section-label">Informations de base</div>
            <div className="ngs-row">
              <div className="ngs-field"><label>Prénom *</label><input value={form.prenom} onChange={e => set('prenom', e.target.value)} placeholder="Thomas" required /></div>
              <div className="ngs-field"><label>Nom *</label><input value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Leblanc" required /></div>
            </div>
            <div className="ngs-field"><label>Email *</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="ton@email.com" required /></div>
            <div className="ngs-row">
              <div className="ngs-field"><label>Mot de passe *</label><input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" required /></div>
              <div className="ngs-field"><label>Confirmer *</label><input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="••••••••" required /></div>
            </div>

            <div className="ngs-divider"></div>
            <div className="ngs-section-label">Informations professionnelles</div>

            <div className="ngs-field"><label>Je suis *</label>
              <select value={form.role_pro} onChange={e => set('role_pro', e.target.value)}>
                <option value="recruiter">Recruteur</option>
                <option value="agent">Agent sportif</option>
                <option value="club">Club</option>
              </select>
            </div>
            <div className="ngs-field"><label>Organisation / Club / Agence *</label><input value={form.organisation} onChange={e => set('organisation', e.target.value)} placeholder="FC Nantes, Agence XYZ..." required /></div>
            <div className="ngs-row">
              <div className="ngs-field"><label>Région couverte</label><select value={form.region_couverte} onChange={e => set('region_couverte', e.target.value)}>{REGIONS.map(r => <option key={r}>{r}</option>)}</select></div>
              <div className="ngs-field"><label>Email professionnel *</label><input type="email" value={form.email_pro} onChange={e => set('email_pro', e.target.value)} placeholder="pro@email.com" required /></div>
            </div>
            <div className="ngs-field"><label>Téléphone / WhatsApp *</label><input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+33 6 XX XX XX XX" required /></div>
            <div className="ngs-field"><label>Postes recherchés</label><input value={form.postes_recherches} onChange={e => set('postes_recherches', e.target.value)} placeholder="Attaquant, Milieu offensif..." /></div>
            <div className="ngs-field"><label>Niveau de championnat ciblé</label><input value={form.niveau_cible} onChange={e => set('niveau_cible', e.target.value)} placeholder="Régional 1, National 3..." /></div>
            <div className="ngs-field"><label>Critères particuliers</label><textarea value={form.criteres} onChange={e => set('criteres', e.target.value)} placeholder="Décris tes critères de recherche..." rows={3} /></div>

            <div className="ngs-divider"></div>
            <div className="ngs-section-label">Vérification (obligatoire)</div>

            <div className="ngs-field">
              <label>Justificatif de ton statut professionnel *</label>
              <input value={form.justificatif} onChange={e => set('justificatif', e.target.value)} placeholder="Lien vers ton club, ta licence, ton profil officiel, LinkedIn..." required />
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '5px', lineHeight: 1.5 }}>
                Pour la sécurité des joueurs, notamment des mineurs, chaque professionnel est vérifié avant d'accéder à la plateforme. Fournis un lien ou une référence qui prouve ton rôle (page officielle de ton club, numéro de licence d'agent, profil professionnel...).
              </div>
            </div>

            <label className="ngs-check" style={{ alignItems: 'flex-start', lineHeight: 1.5 }}>
              <input type="checkbox" checked={form.engagement_charte} onChange={e => set('engagement_charte', e.target.checked)} style={{ marginTop: '3px' }} />
              <span>Je certifie sur l'honneur que les informations fournies sont exactes et que j'exerce bien la fonction déclarée. Je m'engage à respecter la charte de bonne conduite de Next Goal, en particulier à interagir de manière strictement professionnelle et respectueuse avec les joueurs, et à ne jamais contacter un joueur mineur en dehors du cadre prévu et de la présence de son représentant légal. *</span>
            </label>

            <div className="ngs-info" style={{ marginTop: '8px' }}>
              Ton compte sera examiné manuellement avant d'être validé. Tout manquement à la charte entraîne une exclusion immédiate et définitive.
            </div>

            <div className="ngs-actions">
              <Link to="/inscription" className="ngs-btn-ghost">← Retour</Link>
              <button className="ngs-btn-primary" type="submit" disabled={loading}>{loading ? 'Création...' : 'Créer mon profil pro'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
