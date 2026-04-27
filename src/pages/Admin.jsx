import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Admin({ user }) {
  const [players, setPlayers] = useState([])
  const [pros, setPros] = useState([])
  const [loading, setLoading] = useState(true)
  const [mainTab, setMainTab] = useState('joueurs')
  const [playerTab, setPlayerTab] = useState('en_attente')
  const [proTab, setProTab] = useState('en_attente')
  const [updating, setUpdating] = useState(null)
  const [stats, setStats] = useState({ total: 0, publie: 0, en_attente: 0, users: 0, pros: 0, pros_valides: 0, pros_attente: 0 })

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    const [
      { data: playersData },
      { data: prosData },
      { count: total },
      { count: publie },
      { count: attente },
      { count: users },
      { count: prosCount },
      { count: prosValides },
      { count: prosAttente },
    ] = await Promise.all([
      supabase.from('player_profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('pro_profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('player_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('player_profiles').select('*', { count: 'exact', head: true }).eq('statut', 'publie'),
      supabase.from('player_profiles').select('*', { count: 'exact', head: true }).eq('statut', 'en_attente'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('pro_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('pro_profiles').select('*', { count: 'exact', head: true }).eq('statut', 'valide'),
      supabase.from('pro_profiles').select('*', { count: 'exact', head: true }).eq('statut', 'en_attente'),
    ])
    setPlayers(playersData || [])
    setPros(prosData || [])
    setStats({ total, publie, en_attente: attente, users, pros: prosCount, pros_valides: prosValides, pros_attente: prosAttente })
    setLoading(false)
  }

  const updatePlayerStatut = async (id, statut) => {
    setUpdating(id)
    await supabase.from('player_profiles').update({ statut }).eq('id', id)
    setPlayers(p => p.map(pl => pl.id === id ? { ...pl, statut } : pl))
    setUpdating(null)
    fetchAll()
  }

  const updateProStatut = async (id, statut) => {
    setUpdating(id)
    await supabase.from('pro_profiles').update({ statut }).eq('id', id)
    setPros(p => p.map(pr => pr.id === id ? { ...pr, statut } : pr))
    setUpdating(null)
    fetchAll()
  }

  const filteredPlayers = players.filter(p => p.statut === playerTab)
  const filteredPros = pros.filter(p => p.statut === proTab)

  const PLAYER_STATUT_COLORS = {
    en_attente: 'badge-amber',
    publie: 'badge-green',
    refuse: 'badge-pink',
  }

  const PRO_STATUT_COLORS = {
    en_attente: 'badge-amber',
    valide: 'badge-green',
    refuse: 'badge-pink',
  }

  const ROLE_COLORS = {
    recruiter: 'badge-blue',
    agent: 'badge-amber',
    club: 'badge-purple',
  }

  const ROLE_LABELS = {
    recruiter: 'Recruteur',
    agent: 'Agent',
    club: 'Club',
  }

  const tabStyle = (active) => ({
    padding: '8px 18px', borderRadius: '8px', border: 'none',
    background: active ? 'var(--purple)' : 'transparent',
    color: active ? '#fff' : 'var(--text2)',
    cursor: 'pointer', fontSize: '13px', fontWeight: '500',
    transition: 'all 0.2s', fontFamily: 'var(--font)',
  })

  if (user?.profile?.role !== 'admin') {
    return (
      <div className="page fade-in" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2 style={{ color: 'var(--text)' }}>Accès refusé</h2>
      </div>
    )
  }

  return (
    <div className="page fade-in">
      <div className="container">
        <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--text)', marginBottom: '1.5rem' }}>
          Dashboard Admin
        </h1>

        {/* Stats */}
        <div className="stat-row" style={{ marginBottom: '2rem' }}>
          {[
            { num: stats.users, label: 'Utilisateurs' },
            { num: stats.total, label: 'Profils joueurs' },
            { num: stats.publie, label: 'Joueurs publiés' },
            { num: stats.en_attente, label: 'Joueurs en attente' },
            { num: stats.pros_valides, label: 'Pros validés' },
            { num: stats.pros_attente, label: 'Pros en attente' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="num">{s.num ?? 0}</div>
              <div className="lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Main tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', background: 'var(--bg2)', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          <button style={tabStyle(mainTab === 'joueurs')} onClick={() => setMainTab('joueurs')}>⚽ Joueurs</button>
          <button style={tabStyle(mainTab === 'pros')} onClick={() => setMainTab('pros')}>🎯 Professionnels</button>
        </div>

        {/* JOUEURS TAB */}
        {mainTab === 'joueurs' && (
          <>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', background: 'var(--bg2)', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
              <button style={tabStyle(playerTab === 'en_attente')} onClick={() => setPlayerTab('en_attente')}>⏳ En attente</button>
              <button style={tabStyle(playerTab === 'publie')} onClick={() => setPlayerTab('publie')}>✅ Publiés</button>
              <button style={tabStyle(playerTab === 'refuse')} onClick={() => setPlayerTab('refuse')}>❌ Refusés</button>
            </div>

            {loading ? <div className="spinner" /> : (
              filteredPlayers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text2)' }}>Aucun profil dans cette catégorie.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {filteredPlayers.map(p => (
                    <div key={p.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: 'var(--accent)' }}>
                        {p.prenom?.[0]}{p.nom?.[0]}
                      </div>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ fontWeight: '600', color: 'var(--text)', fontSize: '15px' }}>{p.prenom} {p.nom}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>{p.poste_principal} · {p.club_actuel} · {p.region} · {p.age} ans</div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>{p.niveau_championnat} · {p.categorie} · {p.matchs_joues} matchs · {p.buts} buts</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {p.video_highlights && <a href={p.video_highlights} target="_blank" rel="noreferrer" className="video-link btn-sm">🎬</a>}
                        {p.video_match && <a href={p.video_match} target="_blank" rel="noreferrer" className="video-link btn-sm">📹</a>}
                      </div>
                      <span className={`badge ${PLAYER_STATUT_COLORS[p.statut]}`}>{p.statut}</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {p.statut !== 'publie' && (
                          <button className="btn btn-green btn-sm" disabled={updating === p.id} onClick={() => updatePlayerStatut(p.id, 'publie')}>
                            {updating === p.id ? '...' : '✅ Publier'}
                          </button>
                        )}
                        {p.statut !== 'refuse' && (
                          <button className="btn btn-danger btn-sm" disabled={updating === p.id} onClick={() => updatePlayerStatut(p.id, 'refuse')}>
                            ❌ Refuser
                          </button>
                        )}
                        {p.statut !== 'en_attente' && (
                          <button className="btn btn-secondary btn-sm" disabled={updating === p.id} onClick={() => updatePlayerStatut(p.id, 'en_attente')}>
                            ⏳ Attente
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}

        {/* PROFESSIONNELS TAB */}
        {mainTab === 'pros' && (
          <>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', background: 'var(--bg2)', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
              <button style={tabStyle(proTab === 'en_attente')} onClick={() => setProTab('en_attente')}>⏳ En attente</button>
              <button style={tabStyle(proTab === 'valide')} onClick={() => setProTab('valide')}>✅ Validés</button>
              <button style={tabStyle(proTab === 'refuse')} onClick={() => setProTab('refuse')}>❌ Refusés</button>
            </div>

            {loading ? <div className="spinner" /> : (
              filteredPros.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text2)' }}>Aucun professionnel dans cette catégorie.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {filteredPros.map(p => (
                    <div key={p.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: 'var(--accent)' }}>
                        {p.prenom?.[0]}{p.nom?.[0]}
                      </div>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ fontWeight: '600', color: 'var(--text)', fontSize: '15px' }}>{p.prenom} {p.nom}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>
                          {p.organisation || 'Organisation non renseignée'} · {p.region_couverte}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>
                          📧 {p.email_pro || 'Non renseigné'} · 📱 {p.whatsapp || 'Non renseigné'}
                        </div>
                        {p.postes_recherches && (
                          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>
                            Recherche : {p.postes_recherches}
                          </div>
                        )}
                        {p.criteres && (
                          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>
                            Critères : {p.criteres}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                        <span className={`badge ${ROLE_COLORS[p.role_pro] || 'badge-blue'}`}>
                          {ROLE_LABELS[p.role_pro] || p.role_pro}
                        </span>
                        <span className={`badge ${PRO_STATUT_COLORS[p.statut]}`}>{p.statut}</span>
                        <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
                          {new Date(p.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
                        {p.statut !== 'valide' && (
                          <button className="btn btn-green btn-sm" disabled={updating === p.id} onClick={() => updateProStatut(p.id, 'valide')}>
                            {updating === p.id ? '...' : '✅ Valider'}
                          </button>
                        )}
                        {p.statut !== 'refuse' && (
                          <button className="btn btn-danger btn-sm" disabled={updating === p.id} onClick={() => updateProStatut(p.id, 'refuse')}>
                            ❌ Refuser
                          </button>
                        )}
                        {p.statut !== 'en_attente' && (
                          <button className="btn btn-secondary btn-sm" disabled={updating === p.id} onClick={() => updateProStatut(p.id, 'en_attente')}>
                            ⏳ Attente
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  )
}
