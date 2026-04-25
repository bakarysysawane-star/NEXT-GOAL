import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp, supabase } from '../lib/supabase'

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
    email: '', password: '', confirmPassword: '',
    nom: '', prenom: '', date_naissance: '', nationalite: 'Française',
    ville: '', region: '', taille: '', poids: '',
    pied_fort: 'Droit', poste_principal: '', poste_secondaire: '',
    club_actuel: '', categorie: '', niveau_championnat: '',
    matchs_joues: '', buts: '', passes_decisives: '', clean_sheets: '',
    video_highlights: '', video_match: '', objectif: '', ouvert_opportunites: true,
    whatsapp: '', instagram: '', tiktok: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await signUp(form.email, form.password, 'player', `${form.prenom} ${form.nom}`)
      if (data.user) {
        const age = form.date_naissance
          ? Math.floor((Date.now() - new Date(form.date_naissance)) / 31557600000)
          : null

        await supabase.from('player_profiles').insert({
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
        navigate('/inscription/succes')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, k, type = 'text', placeholder, required }) => (
    <div className="form-group">
      <label>{label}{required && ' *'}</label>
      <input type={type} value={form[k]} onChange={e => set(k, e.target.value)}
        placeholder={placeholder} required={required} />
    </div>
  )

  const Select = ({ label, k, options, required }) => (
    <div className="form-group">
      <label>{label}{required && ' *'}</label>
      <select value={form[k]} onChange={e => set(k, e.target.value)} required={required}>
        <option value="">Choisir...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', background: 'radial-gradient(ellipse at 50% 0%, rgba(192,132,252,0.06) 0%, transparent 60%)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span className="logo-text" style={{ fontSize: '14px' }}>NEXT GOAL</span>
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '1rem 0 0.25rem', color: 'var(--text)' }}>
            Inscription Joueur
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '14px' }}>Étape {step} sur 3</p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '2rem' }}>
          {[1,2,3].map(s => (
            <div key={s} style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: s <= step ? 'var(--accent)' : 'var(--border)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        <div className="card" style={{ marginBottom: '1rem' }}>
          {/* Step 1 — Compte */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '0.5rem' }}>
                🔐 Créer mon compte
              </h2>
              <Field label="Email" k="email" type="email" placeholder="ton@email.com" required />
              <Field label="Mot de passe" k="password" type="password" placeholder="Min. 6 caractères" required />
              <Field label="Confirmer le mot de passe" k="confirmPassword" type="password" placeholder="••••••••" required />
              <div className="grid-2">
                <Field label="Prénom" k="prenom" placeholder="Kylian" required />
                <Field label="Nom" k="nom" placeholder="Dupont" required />
              </div>
            </div>
          )}

          {/* Step 2 — Infos sportives */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '0.5rem' }}>
                ⚽ Informations sportives
              </h2>
              <div className="grid-2">
                <Field label="Date de naissance" k="date_naissance" type="date" />
                <Field label="Nationalité" k="nationalite" placeholder="Française" />
              </div>
              <div className="grid-2">
                <Select label="Région" k="region" options={REGIONS} required />
                <Field label="Ville" k="ville" placeholder="Paris" required />
              </div>
              <div className="grid-2">
                <Field label="Taille (cm)" k="taille" placeholder="180" />
                <Field label="Poids (kg)" k="poids" placeholder="75" />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Pied fort</label>
                  <select value={form.pied_fort} onChange={e => set('pied_fort', e.target.value)}>
                    <option>Droit</option><option>Gauche</option><option>Les deux</option>
                  </select>
                </div>
                <Select label="Poste principal" k="poste_principal" options={POSTES} required />
              </div>
              <Select label="Poste secondaire" k="poste_secondaire" options={POSTES} />
              <Field label="Club actuel" k="club_actuel" placeholder="AS Saint-Denis" required />
              <div className="grid-2">
                <Select label="Catégorie" k="categorie" options={CATEGORIES} required />
                <Select label="Niveau championnat" k="niveau_championnat" options={NIVEAUX} required />
              </div>
              <div className="grid-2">
                <Field label="Matchs joués" k="matchs_joues" type="number" placeholder="0" />
                <Field label="Buts" k="buts" type="number" placeholder="0" />
              </div>
              <div className="grid-2">
                <Field label="Passes décisives" k="passes_decisives" type="number" placeholder="0" />
                <Field label="Clean sheets (gardien)" k="clean_sheets" type="number" placeholder="0" />
              </div>
            </div>
          )}

          {/* Step 3 — Médias & Contact */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '0.5rem' }}>
                🎬 Médias & contact
              </h2>
              <Field label="Lien vidéo highlights (YouTube, Instagram...)" k="video_highlights" placeholder="https://..." />
              <Field label="Lien vidéo match complet" k="video_match" placeholder="https://..." />
              <Field label="Numéro WhatsApp" k="whatsapp" placeholder="+33 6 XX XX XX XX" />
              <Field label="Instagram" k="instagram" placeholder="@ton_compte" />
              <Field label="TikTok" k="tiktok" placeholder="@ton_compte" />
              <div className="form-group">
                <label>Objectif sportif</label>
                <select value={form.objectif} onChange={e => set('objectif', e.target.value)}>
                  <option value="">Choisir...</option>
                  <option>Monter de division</option>
                  <option>Rejoindre un club professionnel</option>
                  <option>Partir à l'étranger</option>
                  <option>Rejoindre un centre de formation</option>
                  <option>Rejoindre un club amateur ambitieux</option>
                </select>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: 'var(--text2)' }}>
                <input type="checkbox" checked={form.ouvert_opportunites}
                  onChange={e => set('ouvert_opportunites', e.target.checked)} />
                Je suis ouvert(e) à des opportunités dans d'autres régions / pays
              </label>
              <div className="alert alert-info" style={{ fontSize: '12px' }}>
                ✅ J'accepte que mon profil soit consulté par des recruteurs et professionnels du football.
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
          {step > 1
            ? <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>← Retour</button>
            : <Link to="/inscription" className="btn btn-secondary">← Retour</Link>
          }
          {step < 3
            ? <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}
                disabled={step === 1 && (!form.email || !form.password || !form.prenom || !form.nom)}>
                Continuer →
              </button>
            : <button className="btn btn-green" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Envoi...' : '🚀 Soumettre mon profil'}
              </button>
          }
        </div>
      </div>
    </div>
  )
}
