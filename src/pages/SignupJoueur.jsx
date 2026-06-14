import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp, supabase } from '../lib/supabase'
import './Signup.css'

const REGIONS = ['Île-de-France','PACA','Occitanie','Auvergne-Rhône-Alpes','Nouvelle-Aquitaine',
  'Hauts-de-France','Grand Est','Normandie','Bretagne','Pays de la Loire',
  'Centre-Val de Loire','Bourgogne-Franche-Comté','Corse']
const POSTES = ['Gardien de but','Défenseur central','Latéral droit','Latéral gauche',
  'Milieu défensif','Milieu central','Milieu offensif','Ailier droit','Ailier gauche','Attaquant']
const NIVEAUX = ['National 3','Régional 1','Régional 2','Régional 3','Départemental 1','Départemental 2','Loisir']
const CATEGORIES = ['U17','U18','U19','U21','Senior','Vétéran']

export default function SignupJoueur() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email:'', password:'', confirmPassword:'',
    nom:'', prenom:'', date_naissance:'', nationalite:'Française',
    ville:'', region:'', taille:'', poids:'',
    pied_fort:'Droit', poste_principal:'', poste_secondaire:'',
    club_actuel:'', categorie:'', niveau_championnat:'',
    matchs_joues:'', buts:'', passes_decisives:'', clean_sheets:'',
    video_highlights:'', video_match:'', objectif:'', ouvert_opportunites:true,
    whatsapp:'', instagram:'', tiktok:'',
  })

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    setLoading(true)
    setError('')
    try {
      // 1. Créer le compte
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { role: 'player', full_name: `${form.prenom} ${form.nom}` } }
      })
      if (signUpError) throw signUpError

      // 2. Se connecter immédiatement
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      })
      if (signInError) throw signInError

      // 3. Attendre que la session soit active
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 4. Insérer le profil joueur
      const age = form.date_naissance
        ? Math.floor((Date.now() - new Date(form.date_naissance)) / 31557600000)
        : null

      const { error: insertError } = await supabase.from('player_profiles').insert({
        user_id: data.user.id,
        nom: form.nom, prenom: form.prenom,
        date_naissance: form.date_naissance || null,
        age, nationalite: form.nationalite,
        ville: form.ville, region: form.region,
        taille: form.taille, poids: form.poids,
        pied_fort: form.pied_fort,
        poste_principal: form.poste_principal,
        poste_secondaire: form.poste_secondaire,
        club_actuel: form.club_actuel,
        categorie: form.categorie,
        niveau_championnat: form.niveau_championnat,
        matchs_joues: parseInt(form.matchs_joues) || 0,
        buts: parseInt(form.buts) || 0,
        passes_decisives: parseInt(form.passes_decisives) || 0,
        clean_sheets: parseInt(form.clean_sheets) || 0,
        video_highlights: form.video_highlights,
        video_match: form.video_match,
        objectif: form.objectif,
        ouvert_opportunites: form.ouvert_opportunites,
        whatsapp: form.whatsapp,
        instagram: form.instagram,
        tiktok: form.tiktok,
        statut: 'en_attente',
      })

      if (insertError) throw insertError
      navigate('/inscription/succes')

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
            <div className="ngs-type-card active">
              <div className="ngs-type-head">
                <div className="ngs-type-title">Joueur / Joueuse</div>
                <span className="ngs-type-badge ngs-badge-joueur">Gratuit</span>
              </div>
              <div className="ngs-type-desc">Tu veux être vu des recruteurs. Crée ton profil, renseigne tes stats et laisse les pros venir à toi.</div>
            </div>
            <Link to="/inscription/pro" className="ngs-type-card">
              <div className="ngs-type-head">
                <div className="ngs-type-title">Recruteur / Agent / Club</div>
                <span className="ngs-type-badge ngs-badge-pro">Pro</span>
              </div>
              <div className="ngs-type-desc">Tu cherches des talents. Accède à l'annuaire complet et contacte directement les joueurs.</div>
            </Link>
          </div>
        </div>

        {/* DROITE */}
        <div className="ngs-right">
          <h3>Crée ton compte joueur</h3>
          <p className="ngs-right-sub">"30 secondes pour commencer. Tu complètes ton profil après."</p>

          <div className="ngs-progress">
            {[1,2,3].map(s => <div key={s} className={`ngs-progress-step ${s<=step ? 'active' : ''}`} />)}
          </div>

          {error && <div className="ngs-error">{error}</div>}

          <div className="ngs-form">

            {step === 1 && (
              <>
                <div className="ngs-section-label">Informations de base</div>
                <div className="ngs-field"><label>Email *</label><input type="email" value={form.email} onChange={set('email')} placeholder="ton@email.com" /></div>
                <div className="ngs-field"><label>Mot de passe *</label><input type="password" value={form.password} onChange={set('password')} placeholder="Min. 6 caractères" /></div>
                <div className="ngs-field"><label>Confirmer le mot de passe *</label><input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="••••••••" /></div>
                <div className="ngs-row">
                  <div className="ngs-field"><label>Prénom *</label><input value={form.prenom} onChange={set('prenom')} placeholder="Karim" /></div>
                  <div className="ngs-field"><label>Nom *</label><input value={form.nom} onChange={set('nom')} placeholder="Diallo" /></div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="ngs-section-label">Ton profil sportif</div>
                <div className="ngs-row">
                  <div className="ngs-field"><label>Date de naissance</label><input type="date" value={form.date_naissance} onChange={set('date_naissance')} /></div>
                  <div className="ngs-field"><label>Nationalité</label><input value={form.nationalite} onChange={set('nationalite')} placeholder="Française" /></div>
                  <div className="ngs-field"><label>Région *</label><select value={form.region} onChange={set('region')}><option value="">Choisir...</option>{REGIONS.map(o=><option key={o}>{o}</option>)}</select></div>
                  <div className="ngs-field"><label>Ville *</label><input value={form.ville} onChange={set('ville')} placeholder="Paris" /></div>
                  <div className="ngs-field"><label>Taille (cm)</label><input type="number" value={form.taille} onChange={set('taille')} placeholder="180" /></div>
                  <div className="ngs-field"><label>Poids (kg)</label><input type="number" value={form.poids} onChange={set('poids')} placeholder="75" /></div>
                  <div className="ngs-field"><label>Pied fort</label><select value={form.pied_fort} onChange={set('pied_fort')}><option>Droit</option><option>Gauche</option><option>Les deux</option></select></div>
                  <div className="ngs-field"><label>Poste principal *</label><select value={form.poste_principal} onChange={set('poste_principal')}><option value="">Choisir...</option>{POSTES.map(o=><option key={o}>{o}</option>)}</select></div>
                  <div className="ngs-field"><label>Poste secondaire</label><select value={form.poste_secondaire} onChange={set('poste_secondaire')}><option value="">Choisir...</option>{POSTES.map(o=><option key={o}>{o}</option>)}</select></div>
                  <div className="ngs-field"><label>Club actuel *</label><input value={form.club_actuel} onChange={set('club_actuel')} placeholder="AS Saint-Denis" /></div>
                  <div className="ngs-field"><label>Catégorie *</label><select value={form.categorie} onChange={set('categorie')}><option value="">Choisir...</option>{CATEGORIES.map(o=><option key={o}>{o}</option>)}</select></div>
                  <div className="ngs-field"><label>Niveau championnat *</label><select value={form.niveau_championnat} onChange={set('niveau_championnat')}><option value="">Choisir...</option>{NIVEAUX.map(o=><option key={o}>{o}</option>)}</select></div>
                  <div className="ngs-field"><label>Matchs joués</label><input type="number" value={form.matchs_joues} onChange={set('matchs_joues')} placeholder="0" /></div>
                  <div className="ngs-field"><label>Buts</label><input type="number" value={form.buts} onChange={set('buts')} placeholder="0" /></div>
                  <div className="ngs-field"><label>Passes décisives</label><input type="number" value={form.passes_decisives} onChange={set('passes_decisives')} placeholder="0" /></div>
                  <div className="ngs-field"><label>Clean sheets (gardien)</label><input type="number" value={form.clean_sheets} onChange={set('clean_sheets')} placeholder="0" /></div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="ngs-section-label">Médias & contact</div>
                <div className="ngs-field"><label>Lien vidéo highlights</label><input value={form.video_highlights} onChange={set('video_highlights')} placeholder="https://..." /></div>
                <div className="ngs-field"><label>Lien vidéo match complet</label><input value={form.video_match} onChange={set('video_match')} placeholder="https://..." /></div>
                <div className="ngs-row">
                  <div className="ngs-field"><label>WhatsApp</label><input value={form.whatsapp} onChange={set('whatsapp')} placeholder="+33 6 XX XX XX XX" /></div>
                  <div className="ngs-field"><label>Instagram</label><input value={form.instagram} onChange={set('instagram')} placeholder="@ton_compte" /></div>
                </div>
                <div className="ngs-field"><label>TikTok</label><input value={form.tiktok} onChange={set('tiktok')} placeholder="@ton_compte" /></div>
                <div className="ngs-field"><label>Objectif sportif</label>
                  <select value={form.objectif} onChange={set('objectif')}>
                    <option value="">Choisir...</option>
                    <option>Monter de division</option>
                    <option>Rejoindre un club professionnel</option>
                    <option>Partir à l'étranger</option>
                    <option>Rejoindre un centre de formation</option>
                    <option>Rejoindre un club amateur ambitieux</option>
                  </select>
                </div>
                <label className="ngs-check">
                  <input type="checkbox" checked={form.ouvert_opportunites} onChange={e => setForm(f => ({ ...f, ouvert_opportunites: e.target.checked }))} />
                  Ouvert(e) à des opportunités dans d'autres régions / pays
                </label>
                <div className="ngs-info">En soumettant, j'accepte que mon profil soit consulté par des recruteurs et professionnels du football inscrits sur Next Goal.</div>
              </>
            )}
          </div>

          <div className="ngs-actions">
            {step > 1
              ? <button className="ngs-btn-ghost" onClick={() => setStep(s => s-1)}>← Retour</button>
              : <Link to="/inscription" className="ngs-btn-ghost">← Retour</Link>
            }
            {step < 3
              ? <button className="ngs-btn-primary" onClick={() => setStep(s => s+1)} disabled={step===1 && (!form.email||!form.password||!form.prenom||!form.nom)}>Continuer →</button>
              : <button className="ngs-btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? 'Envoi...' : 'Soumettre mon profil'}</button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
