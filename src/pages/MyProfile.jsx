import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AvatarUpload from '../components/AvatarUpload'

const REGIONS = ['Île-de-France','PACA','Occitanie','Auvergne-Rhône-Alpes','Nouvelle-Aquitaine',
  'Hauts-de-France','Grand Est','Normandie','Bretagne','Pays de la Loire',
  'Centre-Val de Loire','Bourgogne-Franche-Comté','Corse']
const POSTES = ['Gardien de but','Défenseur central','Latéral droit','Latéral gauche',
  'Milieu défensif','Milieu central','Milieu offensif','Ailier droit','Ailier gauche','Attaquant']
const NIVEAUX = ['National 1','National 2','National 3','Régional 1','Régional 2','Régional 3','Départemental 1','Départemental 2','Loisir']
const CATEGORIES = ['U17','U18','U19','U21','Senior','Vétéran']

const S = {
  input: { padding:'10px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', fontFamily:'var(--font)', fontSize:'14px', outline:'none', width:'100%' },
  label: { fontSize:'12px', fontWeight:'500', color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'4px', display:'block' },
  fg: { display:'flex', flexDirection:'column', gap:'4px' },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' },
}

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
    setProfile(data)
    setForm(data || {})
    setLoading(false)
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleAvatarUpload = async (photoUrl) => {
    await supabase.from('player_profiles').update({ photo_url: photoUrl }).eq('id', profile.id)
    setProfile(p => ({ ...p, photo_url: photoUrl }))
    setForm(f => ({ ...f, photo_url: photoUrl }))
    setSuccess('✅ Photo mise à jour !')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccess('')
    try {
      const age = form.date_naissance ? Math.floor((Date.now() - new Date(form.date_naissance)) / 31557600000) : form.age
      const { error: err } = await supabase.from('player_profiles').update({ ...form, age, updated_at: new Date().toISOString() }).eq('id', profile.id)
      if (err) throw err
      setProfile({ ...profile, ...form, age })
      setEditing(false)
      setSuccess('✅ Profil mis à jour !')
      setTimeout(() => setSuccess(''), 3000)
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
      setSuccess('✨ Description IA générée !')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) { setError('Erreur IA: ' + err.message) }
    finally { setAiLoading(false) }
  }

  if (loading) return <div className="spinner" />
  if (!profile) return (
    <div className="page fade-in"><div className="container" style={{ textAlign:'center', padding:'4rem' }}>
      <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📋</div>
      <h2 style={{ color:'var(--text)', marginBottom:'8px' }}>Profil en cours de validation</h2>
      <p style={{ color:'var(--text2)', fontSize:'14px' }}>Bakary validera votre profil sous 48h.</p>
    </div></div>
  )

  const StatusBadge = () => {
    const s = { en_attente:{label:'En attente de validation',cls:'badge-amber'}, publie:{label:'✓ Profil publié',cls:'badge-green'}, refuse:{label:'Refusé',cls:'badge-pink'} }
    const st = s[profile.statut] || s.en_attente
    return <span className={`badge ${st.cls}`}>{st.label}</span>
  }

  return (
    <div className="page fade-in">
      <div className="container" style={{ maxWidth:'800px' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 style={{ fontSize:'1.5rem', fontWeight:'600', color:'var(--text)' }}>Mon profil joueur</h1>
            <div style={{ marginTop:'6px' }}><StatusBadge /></div>
          </div>
          <div style={{ display:'flex', gap:'10px' }}>
            {!editing ? (
              <button className="btn btn-primary" onClick={() => setEditing(true)}>✏️ Modifier</button>
            ) : (
              <>
                <button className="btn btn-secondary" onClick={() => { setEditing(false); setForm(profile) }}>Annuler</button>
                <button className="btn btn-green" onClick={handleSave} disabled={saving}>{saving ? 'Sauvegarde...' : '💾 Sauvegarder'}</button>
              </>
            )}
          </div>
        </div>

        {success && <div className="alert alert-success" style={{ marginBottom:'1rem' }}>{success}</div>}
        {error && <div className="alert alert-error" style={{ marginBottom:'1rem' }}>{error}</div>}

        {/* Avatar */}
        <div className="card" style={{ marginBottom:'1rem', display:'flex', alignItems:'center', gap:'2rem', flexWrap:'wrap' }}>
          <AvatarUpload user={user} currentUrl={profile.photo_url} onUpload={handleAvatarUpload} />
          <div>
            <h2 style={{ fontSize:'1.2rem', fontWeight:'700', color:'var(--text)' }}>{profile.prenom} {profile.nom}</h2>
            <p style={{ color:'var(--text2)', fontSize:'14px', marginTop:'4px' }}>{profile.poste_principal} · {profile.club_actuel}</p>
            <p style={{ color:'var(--text3)', fontSize:'13px', marginTop:'2px' }}>{profile.region} · {profile.age} ans</p>
          </div>
        </div>

        {/* AI Description */}
        <div className="card" style={{ marginBottom:'1rem', background:'linear-gradient(135deg, rgba(26,10,46,0.9), rgba(38,33,92,0.3))' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' }}>
            <div style={{ fontSize:'12px', color:'var(--accent)', fontWeight:'600', letterSpacing:'1px' }}>✨ DESCRIPTION IA</div>
            <button className="btn btn-secondary btn-sm" onClick={generateAiDescription} disabled={aiLoading}>{aiLoading ? 'Génération...' : '🤖 Générer'}</button>
          </div>
          {profile.ai_description ? <p style={{ fontSize:'14px', color:'var(--text2)', lineHeight:1.7 }}>{profile.ai_description}</p>
            : <p style={{ fontSize:'13px', color:'var(--text3)', fontStyle:'italic' }}>Clique sur "Générer" pour créer une description professionnelle.</p>}
        </div>

        {/* Infos personnelles */}
        <div className="card" style={{ marginBottom:'1rem' }}>
          <h2 style={{ fontSize:'1rem', fontWeight:'600', color:'var(--text)', marginBottom:'1rem' }}>👤 Informations personnelles</h2>
          {editing ? (
            <div style={S.grid}>
              <div style={S.fg}><label style={S.label}>Prénom</label><input style={S.input} value={form.prenom||''} onChange={set('prenom')} /></div>
              <div style={S.fg}><label style={S.label}>Nom</label><input style={S.input} value={form.nom||''} onChange={set('nom')} /></div>
              <div style={S.fg}><label style={S.label}>Date de naissance</label><input style={S.input} type="date" value={form.date_naissance||''} onChange={set('date_naissance')} /></div>
              <div style={S.fg}><label style={S.label}>Nationalité</label><input style={S.input} value={form.nationalite||''} onChange={set('nationalite')} /></div>
              <div style={S.fg}><label style={S.label}>Région</label><select style={S.input} value={form.region||''} onChange={set('region')}><option value="">Choisir...</option>{REGIONS.map(o=><option key={o}>{o}</option>)}</select></div>
              <div style={S.fg}><label style={S.label}>Ville</label><input style={S.input} value={form.ville||''} onChange={set('ville')} /></div>
              <div style={S.fg}><label style={S.label}>Taille (cm)</label><input style={S.input} type="number" value={form.taille||''} onChange={set('taille')} /></div>
              <div style={S.fg}><label style={S.label}>Poids (kg)</label><input style={S.input} type="number" value={form.poids||''} onChange={set('poids')} /></div>
              <div style={S.fg}><label style={S.label}>WhatsApp</label><input style={S.input} value={form.whatsapp||''} onChange={set('whatsapp')} /></div>
              <div style={S.fg}><label style={S.label}>Instagram</label><input style={S.input} value={form.instagram||''} onChange={set('instagram')} /></div>
            </div>
          ) : (
            <div style={S.grid}>
              {[['Prénom',profile.prenom],['Nom',profile.nom],['Âge',profile.age?`${profile.age} ans`:'-'],
                ['Nationalité',profile.nationalite||'-'],['Ville',profile.ville||'-'],['Région',profile.region||'-'],
                ['Taille',profile.taille?`${profile.taille} cm`:'-'],['Poids',profile.poids?`${profile.poids} kg`:'-'],
                ['WhatsApp',profile.whatsapp||'-'],['Instagram',profile.instagram||'-']
              ].map(([k,v])=>(
                <div key={k} style={{ background:'rgba(255,255,255,0.03)', padding:'10px', borderRadius:'8px' }}>
                  <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'3px' }}>{k}</div>
                  <div style={{ fontWeight:'500', color:'var(--text)' }}>{v}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Infos sportives */}
        <div className="card" style={{ marginBottom:'1rem' }}>
          <h2 style={{ fontSize:'1rem', fontWeight:'600', color:'var(--text)', marginBottom:'1rem' }}>⚽ Informations sportives</h2>
          {editing ? (
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={S.grid}>
                <div style={S.fg}><label style={S.label}>Pied fort</label><select style={S.input} value={form.pied_fort||''} onChange={set('pied_fort')}><option>Droit</option><option>Gauche</option><option>Les deux</option></select></div>
                <div style={S.fg}><label style={S.label}>Poste principal</label><select style={S.input} value={form.poste_principal||''} onChange={set('poste_principal')}><option value="">Choisir...</option>{POSTES.map(o=><option key={o}>{o}</option>)}</select></div>
                <div style={S.fg}><label style={S.label}>Poste secondaire</label><select style={S.input} value={form.poste_secondaire||''} onChange={set('poste_secondaire')}><option value="">Choisir...</option>{POSTES.map(o=><option key={o}>{o}</option>)}</select></div>
                <div style={S.fg}><label style={S.label}>Club actuel</label><input style={S.input} value={form.club_actuel||''} onChange={set('club_actuel')} /></div>
                <div style={S.fg}><label style={S.label}>Catégorie</label><select style={S.input} value={form.categorie||''} onChange={set('categorie')}><option value="">Choisir...</option>{CATEGORIES.map(o=><option key={o}>{o}</option>)}</select></div>
                <div style={S.fg}><label style={S.label}>Niveau</label><select style={S.input} value={form.niveau_championnat||''} onChange={set('niveau_championnat')}><option value="">Choisir...</option>{NIVEAUX.map(o=><option key={o}>{o}</option>)}</select></div>
                <div style={S.fg}><label style={S.label}>Matchs joués</label><input style={S.input} type="number" value={form.matchs_joues||''} onChange={set('matchs_joues')} /></div>
                <div style={S.fg}><label style={S.label}>Buts</label><input style={S.input} type="number" value={form.buts||''} onChange={set('buts')} /></div>
                <div style={S.fg}><label style={S.label}>Passes décisives</label><input style={S.input} type="number" value={form.passes_decisives||''} onChange={set('passes_decisives')} /></div>
                <div style={S.fg}><label style={S.label}>Clean sheets</label><input style={S.input} type="number" value={form.clean_sheets||''} onChange={set('clean_sheets')} /></div>
              </div>
              <div style={S.fg}><label style={S.label}>Vidéo highlights</label><input style={S.input} value={form.video_highlights||''} onChange={set('video_highlights')} placeholder="https://..." /></div>
              <div style={S.fg}><label style={S.label}>Vidéo match complet</label><input style={S.input} value={form.video_match||''} onChange={set('video_match')} placeholder="https://..." /></div>
              <div style={S.fg}>
                <label style={S.label}>Objectif sportif</label>
                <select style={S.input} value={form.objectif||''} onChange={set('objectif')}>
                  <option value="">Choisir...</option>
                  <option>Monter de division</option>
                  <option>Rejoindre un club professionnel</option>
                  <option>Partir à l'étranger</option>
                  <option>Rejoindre un centre de formation</option>
                  <option>Rejoindre un club amateur ambitieux</option>
                </select>
              </div>
              <label style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', fontSize:'14px', color:'var(--text2)' }}>
                <input type="checkbox" checked={form.ouvert_opportunites||false} onChange={e => setForm(f => ({ ...f, ouvert_opportunites: e.target.checked }))} />
                Ouvert(e) à des opportunités dans d'autres régions / pays
              </label>
            </div>
          ) : (
            <>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'1rem' }}>
                <span className="badge badge-purple">{profile.poste_principal}</span>
                {profile.poste_secondaire && <span className="badge badge-blue">{profile.poste_secondaire}</span>}
                <span className="badge badge-green">{profile.categorie}</span>
                <span className="badge badge-amber">{profile.niveau_championnat}</span>
                <span className="badge badge-pink">Pied {profile.pied_fort}</span>
              </div>
              <div className="stat-row" style={{ marginBottom:'1rem' }}>
                {[['Matchs',profile.matchs_joues??0],['Buts',profile.buts??0],['Passes D.',profile.passes_decisives??0],['Clean sheets',profile.clean_sheets??0]].map(([l,n])=>(
                  <div key={l} className="stat-card"><div className="num">{n}</div><div className="lbl">{l}</div></div>
                ))}
              </div>
              <div style={S.grid}>
                {[['Club actuel',profile.club_actuel||'-'],['Objectif',profile.objectif||'-']].map(([k,v])=>(
                  <div key={k} style={{ background:'rgba(255,255,255,0.03)', padding:'10px', borderRadius:'8px' }}>
                    <div style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'3px' }}>{k}</div>
                    <div style={{ fontWeight:'500', color:'var(--text)', fontSize:'14px' }}>{v}</div>
                  </div>
                ))}
              </div>
              {(profile.video_highlights||profile.video_match) && (
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginTop:'1rem' }}>
                  {profile.video_highlights && <a href={profile.video_highlights} target="_blank" rel="noreferrer" className="video-link">🎬 Highlights</a>}
                  {profile.video_match && <a href={profile.video_match} target="_blank" rel="noreferrer" className="video-link">📹 Match complet</a>}
                </div>
              )}
              {profile.ouvert_opportunites && <div style={{ marginTop:'10px' }}><span className="badge badge-green">✓ Ouvert à d'autres régions / pays</span></div>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
