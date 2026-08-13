import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './Dashboard.css'

const PLAYER_STATUT = { en_attente: 'ngd-badge-amber', publie: 'ngd-badge-green', refuse: 'ngd-badge-pink' }
const PRO_STATUT = { en_attente: 'ngd-badge-amber', valide: 'ngd-badge-green', refuse: 'ngd-badge-pink' }
const ROLE_BADGE = { recruiter: 'ngd-badge-violet', agent: 'ngd-badge-amber', club: 'ngd-badge-violet' }
const ROLE_LABELS = { recruiter: 'Recruteur', agent: 'Agent', club: 'Club' }
const STATUT_LABEL = { en_attente: 'En attente', publie: 'Publié', valide: 'Validé', refuse: 'Refusé' }

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
      { data: playersData }, { data: prosData },
      { count: total }, { count: publie }, { count: attente },
      { count: users }, { count: prosCount }, { count: prosValides }, { count: prosAttente },
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

  if (user?.profile?.role !== 'admin') {
    return (
      <div className="ngd fade-in">
        <div className="ngd-empty"><div className="ngd-empty-title">Accès refusé</div></div>
      </div>
    )
  }

  return (
    <div className="ngd fade-in">
      <div className="ngd-wrap-wide">
        <div className="ngd-head">
          <div>
            <div className="ngd-title">Espace administration</div>
            <div className="ngd-sub">"Valide les profils et garde la plateforme propre."</div>
          </div>
        </div>

        {/* STATS */}
        <div className="ngd-admin-stats">
          {[
            { num: stats.users, label: 'Utilisateurs' },
            { num: stats.total, label: 'Profils joueurs' },
            { num: stats.publie, label: 'Joueurs publiés' },
            { num: stats.en_attente, label: 'Joueurs en attente' },
            { num: stats.pros_valides, label: 'Pros validés' },
            { num: stats.pros_attente, label: 'Pros en attente' },
          ].map(s => (
            <div key={s.label} className="ngd-stat">
              <div className="ngd-stat-val">{s.num ?? 0}</div>
              <div className="ngd-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* MAIN TABS */}
        <div className="ngd-tabs">
          <button className={`ngd-tab ${mainTab === 'joueurs' ? 'active' : ''}`} onClick={() => setMainTab('joueurs')}>Joueurs</button>
          <button className={`ngd-tab ${mainTab === 'pros' ? 'active' : ''}`} onClick={() => setMainTab('pros')}>Professionnels</button>
        </div>

        {/* JOUEURS */}
        {mainTab === 'joueurs' && (
          <>
            <div className="ngd-tabs">
              <button className={`ngd-tab ${playerTab === 'en_attente' ? 'active' : ''}`} onClick={() => setPlayerTab('en_attente')}>En attente</button>
              <button className={`ngd-tab ${playerTab === 'publie' ? 'active' : ''}`} onClick={() => setPlayerTab('publie')}>Publiés</button>
              <button className={`ngd-tab ${playerTab === 'refuse' ? 'active' : ''}`} onClick={() => setPlayerTab('refuse')}>Refusés</button>
            </div>

            {loading ? <div className="spinner" /> : (
              filteredPlayers.length === 0 ? (
                <div className="ngd-empty"><div className="ngd-empty-text">Aucun profil dans cette catégorie.</div></div>
              ) : filteredPlayers.map(p => (
                <div key={p.id} className="ngd-row">
                  <div className="ngd-row-avatar">{p.prenom?.[0]}{p.nom?.[0]}</div>
                  <div className="ngd-row-info">
                    <div className="ngd-row-name">{p.prenom} {p.nom}</div>
                    <div className="ngd-row-meta">{p.poste_principal} · {p.club_actuel} · {p.region} · {p.age} ans</div>
                    <div className="ngd-row-meta2">{p.niveau_championnat} · {p.categorie} · {p.matchs_joues} matchs · {p.buts} buts</div>
                  </div>
                  <div className="ngd-row-actions">
                    {p.video_highlights && <a href={p.video_highlights} target="_blank" rel="noreferrer" className="ngd-btn ngd-btn-ghost ngd-btn-sm">Vidéo</a>}
                  </div>
                  <span className={`ngd-badge ${PLAYER_STATUT[p.statut]}`}>{STATUT_LABEL[p.statut]}</span>
                  <div className="ngd-row-actions">
                    {p.statut !== 'publie' && <button className="ngd-btn ngd-btn-green ngd-btn-sm" disabled={updating === p.id} onClick={() => updatePlayerStatut(p.id, 'publie')}>{updating === p.id ? '...' : 'Publier'}</button>}
                    {p.statut !== 'refuse' && <button className="ngd-btn ngd-btn-danger ngd-btn-sm" disabled={updating === p.id} onClick={() => updatePlayerStatut(p.id, 'refuse')}>Refuser</button>}
                    {p.statut !== 'en_attente' && <button className="ngd-btn ngd-btn-ghost ngd-btn-sm" disabled={updating === p.id} onClick={() => updatePlayerStatut(p.id, 'en_attente')}>Attente</button>}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* PROS */}
        {mainTab === 'pros' && (
          <>
            <div className="ngd-tabs">
              <button className={`ngd-tab ${proTab === 'en_attente' ? 'active' : ''}`} onClick={() => setProTab('en_attente')}>En attente</button>
              <button className={`ngd-tab ${proTab === 'valide' ? 'active' : ''}`} onClick={() => setProTab('valide')}>Validés</button>
              <button className={`ngd-tab ${proTab === 'refuse' ? 'active' : ''}`} onClick={() => setProTab('refuse')}>Refusés</button>
            </div>

            {loading ? <div className="spinner" /> : (
              filteredPros.length === 0 ? (
                <div className="ngd-empty"><div className="ngd-empty-text">Aucun professionnel dans cette catégorie.</div></div>
              ) : filteredPros.map(p => {
                const champManquant = !p.organisation || !p.email_pro || !p.whatsapp || !p.justificatif
                const NR = (v) => v ? <span style={{ color: 'rgba(255,255,255,0.7)' }}>{v}</span> : <span style={{ color: '#ef5350', fontWeight: 700 }}>non renseigné</span>
                const estLien = p.justificatif && (p.justificatif.startsWith('http://') || p.justificatif.startsWith('https://'))
                return (
                <div key={p.id} className="ngd-row" style={champManquant ? { borderColor: 'rgba(239,83,80,0.4)' } : {}}>
                  <div className="ngd-row-avatar">{p.prenom?.[0]}{p.nom?.[0]}</div>
                  <div className="ngd-row-info">
                    <div className="ngd-row-name">{p.prenom} {p.nom}</div>
                    <div className="ngd-row-meta">Organisation : {NR(p.organisation)} · {p.region_couverte}</div>
                    <div className="ngd-row-meta2">Email : {NR(p.email_pro)}</div>
                    <div className="ngd-row-meta2">Tél / WhatsApp : {NR(p.whatsapp)}</div>
                    <div className="ngd-row-meta2">
                      Justificatif : {p.justificatif
                        ? (estLien
                            ? <a href={p.justificatif} target="_blank" rel="noreferrer" style={{ color: '#B87FFF', fontWeight: 700 }}>ouvrir le lien ↗</a>
                            : <span style={{ color: 'rgba(255,255,255,0.7)' }}>{p.justificatif}</span>)
                        : <span style={{ color: '#ef5350', fontWeight: 700 }}>non fourni</span>}
                    </div>
                    <div className="ngd-row-meta2">
                      Charte acceptée : {p.engagement_charte
                        ? <span style={{ color: '#4ade80', fontWeight: 700 }}>oui</span>
                        : <span style={{ color: '#ef5350', fontWeight: 700 }}>non</span>}
                    </div>
                    {p.postes_recherches && <div className="ngd-row-meta2">Recherche : {p.postes_recherches}</div>}
                    {p.niveau_cible && <div className="ngd-row-meta2">Niveau ciblé : {p.niveau_cible}</div>}
                    {p.criteres && <div className="ngd-row-meta2">Critères : {p.criteres}</div>}
                    {champManquant && (
                      <div style={{ marginTop: 8, fontSize: 12, color: '#ef5350', fontWeight: 700 }}>
                        Profil incomplet ou justificatif manquant — impossible à vérifier. À refuser ou recontacter avant toute validation.
                      </div>
                    )}
                    <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                      Avant de valider : vérifie le justificatif, et en cas de doute, contacte le pro par email ou téléphone pour confirmer son identité.
                    </div>
                  </div>
                  <div className="ngd-badges" style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span className={`ngd-badge ${ROLE_BADGE[p.role_pro] || 'ngd-badge-violet'}`}>{ROLE_LABELS[p.role_pro] || p.role_pro}</span>
                    <span className={`ngd-badge ${PRO_STATUT[p.statut]}`}>{STATUT_LABEL[p.statut]}</span>
                  </div>
                  <div className="ngd-row-actions">
                    {p.statut !== 'valide' && <button className="ngd-btn ngd-btn-green ngd-btn-sm" disabled={updating === p.id} onClick={() => updateProStatut(p.id, 'valide')}>{updating === p.id ? '...' : 'Valider'}</button>}
                    {p.statut !== 'refuse' && <button className="ngd-btn ngd-btn-danger ngd-btn-sm" disabled={updating === p.id} onClick={() => updateProStatut(p.id, 'refuse')}>Refuser</button>}
                    {p.statut !== 'en_attente' && <button className="ngd-btn ngd-btn-ghost ngd-btn-sm" disabled={updating === p.id} onClick={() => updateProStatut(p.id, 'en_attente')}>Attente</button>}
                  </div>
                </div>
                )
              })
            )}
          </>
        )}
      </div>
    </div>
  )
}
