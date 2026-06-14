import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AvatarUpload from '../components/AvatarUpload'
import './Dashboard.css'

const REGIONS = ['Toute la France','Île-de-France','PACA','Occitanie','Auvergne-Rhône-Alpes',
  'Nouvelle-Aquitaine','Hauts-de-France','Grand Est','Normandie','Bretagne','Pays de la Loire']
const ROLE_LABELS = { recruiter: 'Recruteur', agent: 'Agent sportif', club: 'Club' }
const STATUT_BADGE = { en_attente: 'ngd-badge-amber', valide: 'ngd-badge-green', refuse: 'ngd-badge-pink' }
const STATUT_LABEL = { en_attente: 'En attente de validation', valide: 'Profil validé', refuse: 'Refusé' }

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
    const { data } = await supabase.from('pro_profiles').select('*').eq('user_id', user.id).single()
    setProfile(data); setForm(data || {}); setLoading(false)
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleAvatarUpload = async (photoUrl) => {
    await supabase.from('pro_profiles').update({ photo_url: photoUrl }).eq('id', profile.id)
    setProfile(p => ({ ...p, photo_url: photoUrl }))
    setSuccess('Photo mise à jour'); setTimeout(() => setSuccess(''), 3000)
  }

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccess('')
    try {
      const { error: err } = await supabase.from('pro_profiles').update({ ...form, updated_at: new Date().toISOString() }).eq('id', profile.id)
      if (err) throw err
      setProfile({ ...profile, ...form }); setEditing(false)
      setSuccess('Profil mis à jour'); setTimeout(() => setSuccess(''), 3000)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  if (loading) return <div className="ngd"><div className="spinner" style={{ margin: '80px auto' }} /></div>
  if (!profile) return (
    <div className="ngd fade-in"><div className="ngd-wrap"><div className="ngd-empty">
      <div className="ngd-empty-title">Profil en cours de validation</div>
      <div className="ngd-empty-text">Ton profil sera validé sous 48h.</div>
    </div></div></div>
  )

  return (
    <div className="ngd fade-in">
      <div className="ngd-wrap">
        <div className="ngd-head">
          <div>
            <div className="ngd-title">Mon profil pro</div>
            <div className="ngd-badges" style={{ marginTop: 10 }}>
              <span className="ngd-badge ngd-badge-violet">{ROLE_LABELS[profile.role_pro] || profile.role_pro}</span>
              <span className={`ngd-badge ${STATUT_BADGE[profile.statut] || 'ngd-badge-amber'}`}>{STATUT_LABEL[profile.statut] || profile.statut}</span>
            </div>
          </div>
          <div className="ngd-head-actions">
            {!editing
              ? <button className="ngd-btn ngd-btn-primary" onClick={() => setEditing(true)}>Modifier</button>
              : <>
                  <button className="ngd-btn ngd-btn-ghost" onClick={() => { setEditing(false); setForm(profile) }}>Annuler</button>
                  <button className="ngd-btn ngd-btn-violet" onClick={handleSave} disabled={saving}>{saving ? '...' : 'Sauvegarder'}</button>
                </>
            }
          </div>
        </div>

        {success && <div className="ngd-alert ngd-alert-success">{success}</div>}
        {error && <div className="ngd-alert ngd-alert-error">{error}</div>}

        <div className="ngd-card">
          <div className="ngd-avatar-row">
            <AvatarUpload user={user} currentUrl={profile.photo_url} onUpload={handleAvatarUpload} />
            <div>
              <div className="ngd-avatar-name">{profile.prenom} {profile.nom}</div>
              <div className="ngd-avatar-meta">{profile.organisation || 'Organisation non renseignée'}</div>
              <div className="ngd-avatar-meta2">{profile.region_couverte}</div>
            </div>
          </div>
        </div>

        <div className="ngd-card">
          <div className="ngd-card-title">Informations personnelles</div>
          {editing ? (
            <div className="ngd-grid">
              <div className="ngd-field"><label>Prénom</label><input value={form.prenom||''} onChange={set('prenom')} /></div>
              <div className="ngd-field"><label>Nom</label><input value={form.nom||''} onChange={set('nom')} /></div>
              <div className="ngd-field"><label>Email professionnel</label><input type="email" value={form.email_pro||''} onChange={set('email_pro')} /></div>
              <div className="ngd-field"><label>WhatsApp</label><input value={form.whatsapp||''} onChange={set('whatsapp')} /></div>
            </div>
          ) : (
            <div className="ngd-grid">
              {[['Prénom',profile.prenom],['Nom',profile.nom],['Email pro',profile.email_pro||'—'],['WhatsApp',profile.whatsapp||'—']].map(([k,v])=>(
                <div key={k} className="ngd-readfield"><div className="ngd-readfield-label">{k}</div><div className="ngd-readfield-val">{v}</div></div>
              ))}
            </div>
          )}
        </div>

        <div className="ngd-card">
          <div className="ngd-card-title">Informations professionnelles</div>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="ngd-grid">
                <div className="ngd-field"><label>Rôle</label><select value={form.role_pro||''} onChange={set('role_pro')}><option value="recruiter">Recruteur</option><option value="agent">Agent sportif</option><option value="club">Club</option></select></div>
                <div className="ngd-field"><label>Organisation</label><input value={form.organisation||''} onChange={set('organisation')} /></div>
                <div className="ngd-field"><label>Région couverte</label><select value={form.region_couverte||''} onChange={set('region_couverte')}>{REGIONS.map(r=><option key={r}>{r}</option>)}</select></div>
                <div className="ngd-field"><label>Postes recherchés</label><input value={form.postes_recherches||''} onChange={set('postes_recherches')} /></div>
                <div className="ngd-field"><label>Niveau ciblé</label><input value={form.niveau_cible||''} onChange={set('niveau_cible')} /></div>
              </div>
              <div className="ngd-field"><label>Critères particuliers</label><textarea rows={3} value={form.criteres||''} onChange={set('criteres')} /></div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="ngd-grid">
                {[['Organisation',profile.organisation||'—'],['Région couverte',profile.region_couverte||'—'],['Postes recherchés',profile.postes_recherches||'—'],['Niveau ciblé',profile.niveau_cible||'—']].map(([k,v])=>(
                  <div key={k} className="ngd-readfield"><div className="ngd-readfield-label">{k}</div><div className="ngd-readfield-val">{v}</div></div>
                ))}
              </div>
              {profile.criteres && (
                <div className="ngd-readfield"><div className="ngd-readfield-label">Critères particuliers</div><div className="ngd-readfield-val" style={{ lineHeight: 1.6 }}>{profile.criteres}</div></div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
