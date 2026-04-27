import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const REGIONS = ['Toute la France','Île-de-France','PACA','Occitanie','Auvergne-Rhône-Alpes',
  'Nouvelle-Aquitaine','Hauts-de-France','Grand Est','Normandie','Bretagne','Pays de la Loire']

const S = {
  input: { padding:'10px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', fontFamily:'var(--font)', fontSize:'14px', outline:'none', width:'100%' },
  label: { fontSize:'12px', fontWeight:'500', color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'4px', display:'block' },
  fg: { display:'flex', flexDirection:'column', gap:'4px' },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' },
}

const ROLE_LABELS = { recruiter: 'Recruteur', agent: 'Agent sportif', club: 'Club' }
const ROLE_COLORS = { recruiter: 'badge-blue', agent: 'badge-amber', club: 'badge-purple' }
const STATUT_COLORS = { en_attente: 'badge-amber', valide: 'badge-green', refuse: 'badge-pink' }
const STATUT_LABELS = { en_attente: 'En attente de validation', valide: '✓ Profil validé', refuse: 'Refusé' }

export default function MyProProfile({ user }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => { fetchProfile() }, [user])

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('pro_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    setProfile(data)
    setForm(data || {})
    setLoading(false)
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccess('')
    try {
      const { error: err } = await supabase
        .from('pro_profiles')
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
      if (err) throw err
      setProfile({ ...profile, ...form })
      setEditing(false)
      setSuccess('✅ Profil mis à jour avec succès !')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  if (loading) return <div className="spinner" />

  if (!profile) return (
    <div className="page fade-in">
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
        <h2 style={{ color: 'var(--text)', marginBottom: '8px' }}>Profil en cours de validation</h2>
        <p style={{ color: 'var(--text2)', fontSize: '14px' }}>Bakary validera votre profil sous 48h.</p>
      </div>
    </div>
  )

  return (
    <div className="page fade-in">
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text)' }}>Mon profil professionnel</h1>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              <span className={`badge ${ROLE_COLORS[profile.role_pro] || 'badge-blue'}`}>
                {ROLE_LABELS[profile.role_pro] || profile.role_pro}
              </span>
              <span className={`badge ${STATUT_COLORS[profile.statut] || 'badge-amber'}`}>
                {STATUT_LABELS[profile.statut] || profile.statut}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {!editing ? (
              <button className="btn btn-primary" onClick={() => setEditing(true)}>✏️ Modifier mon profil</button>
            ) : (
              <>
                <button className="btn btn-secondary" onClick={() => { setEditing(false); setForm(profile) }}>Annuler</button>
                <button className="btn btn-green" onClick={handleSave} disabled={saving}>
                  {saving ? 'Sauvegarde...' : '💾 Sauvegarder'}
                </button>
              </>
            )}
          </div>
        </div>

        {success && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>{success}</div>}
        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        {/* Infos personnelles */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '1rem' }}>👤 Informations personnelles</h2>
          {editing ? (
            <div style={S.grid}>
              <div style={S.fg}><label style={S.label}>Prénom</label><input style={S.input} value={form.prenom||''} onChange={set('prenom')} /></div>
              <div style={S.fg}><label style={S.label}>Nom</label><input style={S.input} value={form.nom||''} onChange={set('nom')} /></div>
              <div style={S.fg}><label style={S.label}>Email professionnel</label><input style={S.input} type="email" value={form.email_pro||''} onChange={set('email_pro')} /></div>
              <div style={S.fg}><label style={S.label}>WhatsApp</label><input style={S.input} value={form.whatsapp||''} onChange={set('whatsapp')} /></div>
            </div>
          ) : (
            <div style={S.grid}>
              {[['Prénom',profile.prenom],['Nom',profile.nom],
                ['Email pro',profile.email_pro||'-'],['WhatsApp',profile.whatsapp||'-']
              ].map(([k,v])=>(
                <div key={k} style={{ background:'rgba(255,255,255,0.03)', padding:'10px', borderRadius:'8px' }}>
                  <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'3px' }}>{k}</div>
                  <div style={{ fontWeight:'500', color:'var(--text)' }}>{v}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Infos professionnelles */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '1rem' }}>🎯 Informations professionnelles</h2>
          {editing ? (
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={S.grid}>
                <div style={S.fg}>
                  <label style={S.label}>Rôle</label>
                  <select style={S.input} value={form.role_pro||''} onChange={set('role_pro')}>
                    <option value="recruiter">Recruteur</option>
                    <option value="agent">Agent sportif</option>
                    <option value="club">Club</option>
                  </select>
                </div>
                <div style={S.fg}><label style={S.label}>Organisation / Club / Agence</label><input style={S.input} value={form.organisation||''} onChange={set('organisation')} /></div>
                <div style={S.fg}>
                  <label style={S.label}>Région couverte</label>
                  <select style={S.input} value={form.region_couverte||''} onChange={set('region_couverte')}>
                    {REGIONS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div style={S.fg}><label style={S.label}>Postes recherchés</label><input style={S.input} value={form.postes_recherches||''} onChange={set('postes_recherches')} placeholder="Attaquant, Milieu..." /></div>
                <div style={S.fg}><label style={S.label}>Niveau ciblé</label><input style={S.input} value={form.niveau_cible||''} onChange={set('niveau_cible')} placeholder="Régional 1, National 3..." /></div>
              </div>
              <div style={S.fg}>
                <label style={S.label}>Critères particuliers</label>
                <textarea style={{ ...S.input, minHeight:'80px', resize:'vertical' }}
                  value={form.criteres||''} onChange={set('criteres')}
                  placeholder="Décrivez vos critères de recherche..." />
              </div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div style={S.grid}>
                {[
                  ['Organisation',profile.organisation||'-'],
                  ['Région couverte',profile.region_couverte||'-'],
                  ['Postes recherchés',profile.postes_recherches||'-'],
                  ['Niveau ciblé',profile.niveau_cible||'-'],
                ].map(([k,v])=>(
                  <div key={k} style={{ background:'rgba(255,255,255,0.03)', padding:'10px', borderRadius:'8px' }}>
                    <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'3px' }}>{k}</div>
                    <div style={{ fontWeight:'500', color:'var(--text)', fontSize:'14px' }}>{v}</div>
                  </div>
                ))}
              </div>
              {profile.criteres && (
                <div style={{ background:'rgba(255,255,255,0.03)', padding:'12px', borderRadius:'8px' }}>
                  <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'6px' }}>CRITÈRES PARTICULIERS</div>
                  <p style={{ fontSize:'14px', color:'var(--text)', lineHeight:1.6 }}>{profile.criteres}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
