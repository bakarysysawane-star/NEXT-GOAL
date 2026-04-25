import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function MyProfile({ user }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => {
    fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('player_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    setProfile(data)
    setForm(data || {})
    setLoading(false)
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccess('')
    try {
      const { error: err } = await supabase
        .from('player_profiles')
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
      if (err) throw err
      setProfile({ ...profile, ...form })
      setEditing(false)
      setSuccess('Profil mis à jour avec succès !')
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
          messages: [{
            role: 'user',
            content: `Tu es un agent de football professionnel. Génère une description courte et percutante (max 120 mots) pour ce joueur, à la 3ème personne, pour attirer l'attention des recruteurs. Sois précis, professionnel et enthousiaste. 

Données du joueur:
- Nom: ${profile.prenom} ${profile.nom}
- Poste: ${profile.poste_principal}
- Âge: ${profile.age} ans
- Club: ${profile.club_actuel}
- Région: ${profile.region}
- Niveau: ${profile.niveau_championnat}
- Catégorie: ${profile.categorie}
- Stats: ${profile.matchs_joues} matchs, ${profile.buts} buts, ${profile.passes_decisives} passes décisives
- Pied fort: ${profile.pied_fort}
- Objectif: ${profile.objectif}

Réponds UNIQUEMENT avec la description, sans titre ni introduction.`
          }]
        })
      })
      const data = await response.json()
      const description = data.content?.[0]?.text || ''
      set('ai_description', description)

      // Save immediately
      await supabase.from('player_profiles').update({ ai_description: description }).eq('id', profile.id)
      setProfile(p => ({ ...p, ai_description: description }))
      setSuccess('Description IA générée !')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) { setError('Erreur IA: ' + err.message) }
    finally { setAiLoading(false) }
  }

  if (loading) return <div className="spinner" />

  if (!profile) return (
    <div className="page fade-in">
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
        <h2 style={{ color: 'var(--text)', marginBottom: '8px' }}>Profil en cours de validation</h2>
        <p style={{ color: 'var(--text2)', fontSize: '14px' }}>
          Votre inscription est en cours de traitement. Bakary vous contactera sous 48h.
        </p>
      </div>
    </div>
  )

  const StatusBadge = () => {
    const s = { en_attente: { label: 'En attente de validation', cls: 'badge-amber' },
      publie: { label: 'Profil publié ✓', cls: 'badge-green' },
      refuse: { label: 'Refusé', cls: 'badge-pink' } }
    const st = s[profile.statut] || s.en_attente
    return <span className={`badge ${st.cls}`}>{st.label}</span>
  }

  return (
    <div className="page fade-in">
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text)' }}>Mon profil</h1>
            <div style={{ marginTop: '6px' }}><StatusBadge /></div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {!editing ? (
              <button className="btn btn-primary" onClick={() => setEditing(true)}>✏️ Modifier</button>
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

        {/* AI Description */}
        <div className="card" style={{ marginBottom: '1rem', background: 'linear-gradient(135deg, rgba(26,10,46,0.9), rgba(38,33,92,0.3))' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '600', letterSpacing: '1px' }}>
              ✨ DESCRIPTION IA
            </div>
            <button className="btn btn-secondary btn-sm" onClick={generateAiDescription} disabled={aiLoading}>
              {aiLoading ? 'Génération...' : '🤖 Générer avec l\'IA'}
            </button>
          </div>
          {profile.ai_description ? (
            <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7 }}>{profile.ai_description}</p>
          ) : (
            <p style={{ fontSize: '13px', color: 'var(--text3)', fontStyle: 'italic' }}>
              Clique sur "Générer avec l'IA" pour créer une description professionnelle de ton profil.
            </p>
          )}
        </div>

        {/* Profile info */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '1rem' }}>
            Informations personnelles
          </h2>
          <div className="grid-2" style={{ gap: '1rem' }}>
            {editing ? (
              <>
                <div className="form-group"><label>Prénom</label><input value={form.prenom || ''} onChange={e => set('prenom', e.target.value)} /></div>
                <div className="form-group"><label>Nom</label><input value={form.nom || ''} onChange={e => set('nom', e.target.value)} /></div>
                <div className="form-group"><label>Ville</label><input value={form.ville || ''} onChange={e => set('ville', e.target.value)} /></div>
                <div className="form-group"><label>Taille (cm)</label><input value={form.taille || ''} onChange={e => set('taille', e.target.value)} /></div>
                <div className="form-group"><label>Poids (kg)</label><input value={form.poids || ''} onChange={e => set('poids', e.target.value)} /></div>
                <div className="form-group"><label>WhatsApp</label><input value={form.whatsapp || ''} onChange={e => set('whatsapp', e.target.value)} /></div>
              </>
            ) : (
              [
                ['Prénom', profile.prenom], ['Nom', profile.nom],
                ['Âge', profile.age ? `${profile.age} ans` : '-'],
                ['Nationalité', profile.nationalite || '-'],
                ['Ville', profile.ville || '-'], ['Région', profile.region || '-'],
                ['Taille', profile.taille ? `${profile.taille} cm` : '-'],
                ['Poids', profile.poids ? `${profile.poids} kg` : '-'],
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '3px' }}>{k}</div>
                  <div style={{ fontWeight: '500', color: 'var(--text)' }}>{v}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sports info */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '1rem' }}>
            Informations sportives
          </h2>
          {editing ? (
            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="form-group"><label>Club actuel</label><input value={form.club_actuel || ''} onChange={e => set('club_actuel', e.target.value)} /></div>
              <div className="form-group"><label>Matchs joués</label><input type="number" value={form.matchs_joues || ''} onChange={e => set('matchs_joues', e.target.value)} /></div>
              <div className="form-group"><label>Buts</label><input type="number" value={form.buts || ''} onChange={e => set('buts', e.target.value)} /></div>
              <div className="form-group"><label>Passes décisives</label><input type="number" value={form.passes_decisives || ''} onChange={e => set('passes_decisives', e.target.value)} /></div>
              <div className="form-group"><label>Clean sheets</label><input type="number" value={form.clean_sheets || ''} onChange={e => set('clean_sheets', e.target.value)} /></div>
              <div className="form-group"><label>Objectif</label><input value={form.objectif || ''} onChange={e => set('objectif', e.target.value)} /></div>
              <div className="form-group"><label>Vidéo highlights</label><input value={form.video_highlights || ''} onChange={e => set('video_highlights', e.target.value)} placeholder="https://..." /></div>
              <div className="form-group"><label>Vidéo match</label><input value={form.video_match || ''} onChange={e => set('video_match', e.target.value)} placeholder="https://..." /></div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span className="badge badge-purple">{profile.poste_principal}</span>
                {profile.poste_secondaire && <span className="badge badge-blue">{profile.poste_secondaire}</span>}
                <span className="badge badge-green">{profile.categorie}</span>
                <span className="badge badge-amber">{profile.niveau_championnat}</span>
              </div>
              <div className="stat-row" style={{ marginBottom: '1rem' }}>
                {[
                  { num: profile.matchs_joues ?? 0, label: 'Matchs' },
                  { num: profile.buts ?? 0, label: 'Buts' },
                  { num: profile.passes_decisives ?? 0, label: 'Passes D.' },
                  { num: profile.clean_sheets ?? 0, label: 'Clean sheets' },
                ].map(s => (
                  <div key={s.label} className="stat-card">
                    <div className="num">{s.num}</div>
                    <div className="lbl">{s.label}</div>
                  </div>
                ))}
              </div>
              {(profile.video_highlights || profile.video_match) && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {profile.video_highlights && <a href={profile.video_highlights} target="_blank" rel="noreferrer" className="video-link">🎬 Highlights</a>}
                  {profile.video_match && <a href={profile.video_match} target="_blank" rel="noreferrer" className="video-link">📹 Match complet</a>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
