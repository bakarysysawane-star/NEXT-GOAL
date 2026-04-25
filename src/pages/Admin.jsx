import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Admin({ user }) {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('en_attente')
  const [updating, setUpdating] = useState(null)
  const [stats, setStats] = useState({ total: 0, publie: 0, en_attente: 0, users: 0 })

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    const [{ data: players }, { count: total }, { count: publie }, { count: attente }, { count: users }] = await Promise.all([
      supabase.from('player_profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('player_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('player_profiles').select('*', { count: 'exact', head: true }).eq('statut', 'publie'),
      supabase.from('player_profiles').select('*', { count: 'exact', head: true }).eq('statut', 'en_attente'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
    ])
    setPlayers(players || [])
    setStats({ total, publie, en_attente: attente, users })
    setLoading(false)
  }

  const updateStatut = async (id, statut) => {
    setUpdating(id)
    await supabase.from('player_profiles').update({ statut }).eq('id', id)
    setPlayers(p => p.map(pl => pl.id === id ? { ...pl, statut } : pl))
    setUpdating(null)
    fetchAll()
  }

  const filtered = players.filter(p => p.statut === tab)

  const STATUT_COLORS = {
    en_attente: 'badge-amber',
    publie: 'badge-green',
    refuse: 'badge-pink',
  }

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
            { num: stats.users, label: 'Utilisateurs inscrits' },
            { num: stats.total, label: 'Profils joueurs' },
            { num: stats.publie, label: 'Profils publiés' },
            { num: stats.en_attente, label: 'En attente de validation' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="num">{s.num ?? 0}</div>
              <div className="lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', background: 'var(--bg2)', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {[['en_attente', '⏳ En attente'], ['publie', '✅ Publiés'], ['refuse', '❌ Refusés']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)}
              style={{
                padding: '8px 18px', borderRadius: '8px', border: 'none',
                background: tab === val ? 'var(--purple)' : 'transparent',
                color: tab === val ? '#fff' : 'var(--text2)',
                cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'all 0.2s',
              }}>
              {label}
            </button>
          ))}
        </div>

        {loading ? <div className="spinner" /> : (
          filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text2)' }}>
              Aucun profil dans cette catégorie.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map(p => (
                <div key={p.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                    background: 'var(--bg3)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: '600', color: 'var(--accent)',
                  }}>
                    {p.prenom?.[0]}{p.nom?.[0]}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text)', fontSize: '15px' }}>
                      {p.prenom} {p.nom}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>
                      {p.poste_principal} · {p.club_actuel} · {p.region} · {p.age} ans
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>
                      {p.niveau_championnat} · {p.categorie} · {p.matchs_joues} matchs · {p.buts} buts
                    </div>
                  </div>

                  {/* Links */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {p.video_highlights && <a href={p.video_highlights} target="_blank" rel="noreferrer" className="video-link btn-sm">🎬</a>}
                    {p.video_match && <a href={p.video_match} target="_blank" rel="noreferrer" className="video-link btn-sm">📹</a>}
                  </div>

                  {/* Status badge */}
                  <span className={`badge ${STATUT_COLORS[p.statut]}`}>{p.statut}</span>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {p.statut !== 'publie' && (
                      <button className="btn btn-green btn-sm" disabled={updating === p.id}
                        onClick={() => updateStatut(p.id, 'publie')}>
                        {updating === p.id ? '...' : '✅ Publier'}
                      </button>
                    )}
                    {p.statut !== 'refuse' && (
                      <button className="btn btn-danger btn-sm" disabled={updating === p.id}
                        onClick={() => updateStatut(p.id, 'refuse')}>
                        ❌ Refuser
                      </button>
                    )}
                    {p.statut !== 'en_attente' && (
                      <button className="btn btn-secondary btn-sm" disabled={updating === p.id}
                        onClick={() => updateStatut(p.id, 'en_attente')}>
                        ⏳ Attente
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
