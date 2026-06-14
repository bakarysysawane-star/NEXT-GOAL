import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AvatarUpload from '../components/AvatarUpload'
import './Dashboard.css'

const REGIONS = ['Île-de-France','PACA','Occitanie','Auvergne-Rhône-Alpes','Nouvelle-Aquitaine',
  'Hauts-de-France','Grand Est','Normandie','Bretagne','Pays de la Loire',
  'Centre-Val de Loire','Bourgogne-Franche-Comté','Corse']
const POSTES = ['Gardien de but','Défenseur central','Latéral droit','Latéral gauche',
  'Milieu défensif','Milieu central','Milieu offensif','Ailier droit','Ailier gauche','Attaquant']
const NIVEAUX = ['National 1','National 2','National 3','Régional 1','Régional 2','Régional 3','Départemental 1','Départemental 2','Loisir']
const CATEGORIES = ['U17','U18','U19','U21','Senior','Vétéran']
const STATUT_BADGE = { en_attente: 'ngd-badge-amber', publie: 'ngd-badge-green', refuse: 'ngd-badge-pink' }
const STATUT_LABEL = { en_attente: 'En attente de validation', publie: 'Profil publié', refuse: 'Refusé' }

export default function MyProfile({ user }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => { fetchProfile() }, [user])

  const fetchProfile = async () => {
    const { data } = await supabase.from('player_profiles').select('*').eq('user_id', user.id).single()
    setProfile(data); setForm(data || {}); setLoading(false)
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleAvatarUpload = async (photoUrl) => {
    await supabase.from('player_profiles').update({ photo_url: photoUrl }).eq('id', profile.id)
    setProfile(p => ({ ...p, photo_url: photoUrl })); setForm(f => ({ ...f, photo_url: photoUrl }))
    setSuccess('Photo mise à jour'); setTimeout(() => setSuccess(''), 3000)
  }

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccess('')
    try {
      const age = form.date_naissance ? Math.floor((Date.now() - new Date(form.date_naissance)) / 31557600000) : form.age
      const { error: err } = await supabase.from('player_profiles').update({ ...form, age, updated_at: new Date().toISOString() }).eq('id', profile.id)
      if (err) throw err
      setProfile({ ...profile, ...form, age }); setEditing(false)
      setSuccess('Profil mis à jour'); setTimeout(() => setSuccess(''), 3000)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const generateAiDescription = async () => {
    setAiLoading(true)
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: `Tu es un agent de football professionnel. Génère une description courte et percutante (max 120 mots) pour ce joueur, à la 3ème personne, pour attirer l'attention des recruteurs. Données: Nom: ${profile.prenom} ${profile.nom}, Poste: ${profile.poste_principal}, Âge: ${profile.age} ans, Club: ${profile.club_actuel}, Région: ${profile.region}, Niveau: ${profile.niveau_championnat}, Catégorie: ${profile.categorie}, Stats: ${profile.matchs_joues} matchs, ${profile.buts} buts, ${profile.passes_decisives} passes décisives, Pied fort: ${profile.pied_fort}, Objectif: ${profile.objectif}. Réponds UNIQUEMENT avec la description, sans titre.` }]
        })
      })
      const data = await response.json()
      const description = data.content?.[0]?.text || ''
      await supabase.from('player_profiles').update({ ai_description: description }).eq('id', profile.id)
      setProfile(p => ({ ...p, ai_description: description }))
      setSuccess('Description générée'); setTimeout(() => setSuccess(''), 3000)
    } catch (err) { setError('Erreur IA : ' + err.message) }
    finally { setAiLoading(false) }
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
            <div className="ngd-title">Mon profil joueur</div>
            <div className="ngd-badges" style={{ marginTop: 10 }}>
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

        {/* Avatar */}
        <div className="ngd-card">
          <div className="ngd-avatar-row">
            <AvatarUpload user={user} currentUrl={profile.photo_url} onUpload={handleAvatarUpload} />
            <div>
              <div className="ngd-avatar-name">{profile.prenom} {profile.nom}</div>
              <div className="ngd-avatar-meta">{profile.poste_principal} · {profile.club_actuel}</div>
              <div className="ngd-avatar-meta2">{profile.region} · {profile.age} ans</div>
            </div>
          </div>
        </div>

        {/* IA */}
        <div className="ngd-ai-box">
          <div className="ngd-ai-head">
            <div className="ngd-card-title" style={{ margin: 0 }}>Description IA</div>
            <button className="ngd-btn ngd-btn-violet ngd-btn-sm" onClick={generateAiDescription} disabled={aiLoading}>{aiLoading ? 'Génération...' : 'Générer'}</button>
          </div>
          {profile.ai_description
            ? <p className="ngd-ai-text">{profile.ai_description}</p>
            : <p className="ngd-ai-empty">"Clique sur Générer pour créer une présentation professionnelle de ton profil, prête à convaincre les recruteurs."</p>}
        </div>

        {/* Infos perso */}
        <div className="ngd-card">
          <div className="ngd-card-title">Informations personnelles</div>
          {editing ? (
            <div className="ngd-grid">
              <div className="ngd-field"><label>Prénom</label><input value={form.prenom||''} onChange={set('prenom')} /></div>
              <div className="ngd-field"><label>Nom</label><input value={form.nom||''} onChange={set('nom')} /></div>
              <div className="ngd-field"><label>Date de naissance</label><input type="date" value={form.date_naissance||''} onChange={set('date_naissance')} /></div>
              <div className="ngd-field"><label>Nationalité</label><input value={form.nationalite||''} onChange={set('nationalite')} /></div>
              <div className="ngd-field"><label>Région</label><select value={form.region||''} onChange={set('region')}><option value="">Choisir...</option>{REGIONS.map(o=><option key={o}>{o}</option>)}</select></div>
              <div className="ngd-field"><label>Ville</label><input value={form.ville||''} onChange={set('ville')} /></div>
              <div className="ngd-field"><label>Taille (cm)</label><input type="number" value={form.taille||''} onChange={set('taille')} /></div>
              <div className="ngd-field"><label>Poids (kg)</label><input type="number" value={form.poids||''} onChange={set('poids')} /></div>
              <div className="ngd-field"><label>WhatsApp</label><input value={form.whatsapp||''} onChange={set('whatsapp')} /></div>
              <div className="ngd-field"><label>Instagram</label><input value={form.instagram||''} onChange={set('instagram')} /></div>
            </div>
          ) : (
            <div className="ngd-grid">
              {[['Prénom',profile.prenom],['Nom',profile.nom],['Âge',profile.age?`${profile.age} ans`:'—'],
                ['Nationalité',profile.nationalite||'—'],['Ville',profile.ville||'—'],['Région',profile.region||'—'],
                ['Taille',profile.taille?`${profile.taille} cm`:'—'],['Poids',profile.poids?`${profile.poids} kg`:'—'],
                ['WhatsApp',profile.whatsapp||'—'],['Instagram',profile.instagram||'—']
              ].map(([k,v])=>(
                <div key={k} className="ngd-readfield"><div className="ngd-readfield-label">{k}</div><div className="ngd-readfield-val">{v}</div></div>
              ))}
            </div>
          )}
        </div>

        {/* Infos sportives */}
        <div className="ngd-card">
          <div className="ngd-card-title">Informations sportives</div>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="ngd-grid">
                <div className="ngd-field"><label>Pied fort</label><select value={form.pied_fort||''} onChange={set('pied_fort')}><option>Droit</option><option>Gauche</option><option>Les deux</option></select></div>
                <div className="ngd-field"><label>Poste principal</label><select value={form.poste_principal||''} onChange={set('poste_principal')}><option value="">Choisir...</option>{POSTES.map(o=><option key={o}>{o}</option>)}</select></div>
                <div className="ngd-field"><label>Poste secondaire</label><select value={form.poste_secondaire||''} onChange={set('poste_secondaire')}><option value="">Choisir...</option>{POSTES.map(o=><option key={o}>{o}</option>)}</select></div>
                <div className="ngd-field"><label>Club actuel</label><input value={form.club_actuel||''} onChange={set('club_actuel')} /></div>
                <div className="ngd-field"><label>Catégorie</label><select value={form.categorie||''} onChange={set('categorie')}><option value="">Choisir...</option>{CATEGORIES.map(o=><option key={o}>{o}</option>)}</select></div>
                <div className="ngd-field"><label>Niveau</label><select value={form.niveau_championnat||''} onChange={set('niveau_championnat')}><option value="">Choisir...</option>{NIVEAUX.map(o=><option key={o}>{o}</option>)}</select></div>
                <div className="ngd-field"><label>Matchs joués</label><input type="number" value={form.matchs_joues||''} onChange={set('matchs_joues')} /></div>
                <div className="ngd-field"><label>Buts</label><input type="number" value={form.buts||''} onChange={set('buts')} /></div>
                <div className="ngd-field"><label>Passes décisives</label><input type="number" value={form.passes_decisives||''} onChange={set('passes_decisives')} /></div>
                <div className="ngd-field"><label>Clean sheets</label><input type="number" value={form.clean_sheets||''} onChange={set('clean_sheets')} /></div>
              </div>
              <div className="ngd-field"><label>Vidéo highlights</label><input value={form.video_highlights||''} onChange={set('video_highlights')} placeholder="https://..." /></div>
              <div className="ngd-field"><label>Vidéo match complet</label><input value={form.video_match||''} onChange={set('video_match')} placeholder="https://..." /></div>
              <div className="ngd-field"><label>Objectif sportif</label>
                <select value={form.objectif||''} onChange={set('objectif')}>
                  <option value="">Choisir...</option>
                  <option>Monter de division</option>
                  <option>Rejoindre un club professionnel</option>
                  <option>Partir à l'étranger</option>
                  <option>Rejoindre un centre de formation</option>
                  <option>Rejoindre un club amateur ambitieux</option>
                </select>
              </div>
              <label className="ngd-check">
                <input type="checkbox" checked={form.ouvert_opportunites||false} onChange={e => setForm(f => ({ ...f, ouvert_opportunites: e.target.checked }))} />
                Ouvert(e) à des opportunités dans d'autres régions / pays
              </label>
            </div>
          ) : (
            <>
              <div className="ngd-badges" style={{ marginBottom: 16 }}>
                <span className="ngd-badge ngd-badge-violet">{profile.poste_principal}</span>
                {profile.poste_secondaire && <span className="ngd-badge ngd-badge-white">{profile.poste_secondaire}</span>}
                <span className="ngd-badge ngd-badge-white">{profile.categorie}</span>
                <span className="ngd-badge ngd-badge-white">{profile.niveau_championnat}</span>
                <span className="ngd-badge ngd-badge-white">Pied {profile.pied_fort}</span>
              </div>
              <div className="ngd-stats">
                {[['Matchs',profile.matchs_joues??0],['Buts',profile.buts??0],['Passes D.',profile.passes_decisives??0],['Clean sheets',profile.clean_sheets??0]].map(([l,n])=>(
                  <div key={l} className="ngd-stat"><div className="ngd-stat-val">{n}</div><div className="ngd-stat-lbl">{l}</div></div>
                ))}
              </div>
              <div className="ngd-grid">
                {[['Club actuel',profile.club_actuel||'—'],['Objectif',profile.objectif||'—']].map(([k,v])=>(
                  <div key={k} className="ngd-readfield"><div className="ngd-readfield-label">{k}</div><div className="ngd-readfield-val">{v}</div></div>
                ))}
              </div>
              {(profile.video_highlights || profile.video_match) && (
                <div className="ngd-videos">
                  {profile.video_highlights && <a href={profile.video_highlights} target="_blank" rel="noreferrer" className="ngd-video-link">Highlights</a>}
                  {profile.video_match && <a href={profile.video_match} target="_blank" rel="noreferrer" className="ngd-video-link">Match complet</a>}
                </div>
              )}
              {profile.ouvert_opportunites && <div style={{ marginTop: 14 }}><span className="ngd-badge ngd-badge-green">Ouvert à d'autres régions / pays</span></div>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
