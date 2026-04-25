import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp, supabase } from '../lib/supabase'

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
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const roleLabel = { recruiter: 'Recruteur', agent: 'Agent', club: 'Club' }

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError('Mots de passe différents.'); return }
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
        })
        navigate('/inscription/succes')
      }
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', background: 'radial-gradient(ellipse at 50% 0%, rgba(192,132,252,0.06) 0%, transparent 60%)' }}>
      <div style={{ maxWidth: '580px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span className="logo-text" style={{ fontSize: '14px' }}>NEXT GOAL</span>
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '1rem 0 0.25rem', color: 'var(--text)' }}>
            Inscription Professionnel
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '14px' }}>Recruteur, Agent ou Club</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)' }}>🔐 Compte</h2>

            <div className="grid-2">
              <div className="form-group">
                <label>Prénom *</label>
                <input value={form.prenom} onChange={e => set('prenom', e.target.value)} placeholder="Thomas" required />
              </div>
              <div className="form-group">
                <label>Nom *</label>
                <input value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Leblanc" required />
              </div>
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="ton@email.com" required />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Mot de passe *</label>
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" required />
              </div>
              <div className="form-group">
                <label>Confirmer *</label>
                <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="••••••••" required />
              </div>
            </div>

            <div className="divider" />
            <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)' }}>🎯 Informations professionnelles</h2>

            <div className="form-group">
              <label>Je suis *</label>
              <select value={form.role_pro} onChange={e => set('role_pro', e.target.value)}>
                <option value="recruiter">Recruteur</option>
                <option value="agent">Agent sportif</option>
                <option value="club">Club</option>
              </select>
            </div>

            <div className="form-group">
              <label>Organisation / Club / Agence</label>
              <input value={form.organisation} onChange={e => set('organisation', e.target.value)} placeholder="FC Nantes, Agence XYZ..." />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Région couverte</label>
                <select value={form.region_couverte} onChange={e => set('region_couverte', e.target.value)}>
                  {REGIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Email professionnel</label>
                <input type="email" value={form.email_pro} onChange={e => set('email_pro', e.target.value)} placeholder="pro@email.com" />
              </div>
            </div>

            <div className="form-group">
              <label>WhatsApp</label>
              <input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+33 6 XX XX XX XX" />
            </div>

            <div className="form-group">
              <label>Postes recherchés</label>
              <input value={form.postes_recherches} onChange={e => set('postes_recherches', e.target.value)} placeholder="Attaquant, Milieu offensif..." />
            </div>

            <div className="form-group">
              <label>Niveau de championnat ciblé</label>
              <input value={form.niveau_cible} onChange={e => set('niveau_cible', e.target.value)} placeholder="Régional 1, National 3..." />
            </div>

            <div className="form-group">
              <label>Critères particuliers</label>
              <textarea value={form.criteres} onChange={e => set('criteres', e.target.value)}
                placeholder="Décrivez vos critères de recherche..." rows={3} />
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '12px' }}>
              {loading ? 'Création...' : '🚀 Créer mon profil professionnel'}
            </button>
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: 'var(--text2)' }}>
          Déjà inscrit ?{' '}
          <Link to="/connexion" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
