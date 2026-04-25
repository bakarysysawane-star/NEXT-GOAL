import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ContactModal from '../components/ContactModal'

export default function PlayerDetail({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showContact, setShowContact] = useState(false)

  useEffect(() => {
    supabase.from('player_profiles').select('*').eq('id', id).single()
      .then(({ data }) => { setPlayer(data); setLoading(false) })
  }, [id])

  const isRecruiter = ['recruiter', 'agent', 'club', 'admin'].includes(user?.profile?.role)
  const isOwnProfile = user?.id && player?.user_id === user.id

  if (loading) return <div className="page"><div className="container"><div className="spinner" /></div></div>
  if (!player) return <div className="page"><div className="container"><p style={{ color: 'var(--text2)' }}>Joueur introuvable.</p></div></div>

  return (
    <div className="page fade-in">
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Back */}
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>
          ← Retour
        </button>

        {/* Header card */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
              background: 'var(--bg3)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '24px', fontWeight: '700', color: 'var(--accent)',
              border: '2px solid var(--border)',
            }}>
              {player.prenom?.[0]}{player.nom?.[0]}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text)', marginBottom: '4px' }}>
                {player.prenom} {player.nom}
              </h1>
              <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '10px' }}>
                {player.age} ans · {player.club_actuel} · {player.ville}, {player.region}
              </p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="badge badge-purple">{player.poste_principal}</span>
                {player.poste_secondaire && <span className="badge badge-blue">{player.poste_secondaire}</span>}
                <span className="badge badge-green">{player.categorie}</span>
                <span className="badge badge-amber">{player.niveau_championnat}</span>
                <span className="badge badge-pink">Pied {player.pied_fort}</span>
              </div>
            </div>
            {isRecruiter && !isOwnProfile && (
              <button className="btn btn-primary" onClick={() => setShowContact(true)}>
                📨 Contacter
              </button>
            )}
            {isOwnProfile && (
              <button className="btn btn-secondary" onClick={() => navigate('/mon-profil')}>
                ✏️ Modifier
              </button>
            )}
          </div>
        </div>

        {/* AI Description */}
        {player.ai_description && (
          <div className="card" style={{ marginBottom: '1rem', background: 'linear-gradient(135deg, rgba(26,10,46,0.9), rgba(38,33,92,0.3))' }}>
            <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '600', letterSpacing: '1px', marginBottom: '8px' }}>✨ PRÉSENTATION</div>
            <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7 }}>{player.ai_description}</p>
          </div>
        )}

        {/* Stats */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '1rem' }}>Statistiques</h2>
          <div className="stat-row">
            {[
              { num: player.matchs_joues ?? 0, label: 'Matchs joués' },
              { num: player.buts ?? 0, label: 'Buts' },
              { num: player.passes_decisives ?? 0, label: 'Passes D.' },
              { num: player.clean_sheets ?? 0, label: 'Clean sheets' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="num">{s.num}</div>
                <div className="lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Physical */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '1rem' }}>Informations physiques</h2>
          <div className="grid-3" style={{ gap: '10px' }}>
            {[
              ['Taille', player.taille ? `${player.taille} cm` : '-'],
              ['Poids', player.poids ? `${player.poids} kg` : '-'],
              ['Pied fort', player.pied_fort || '-'],
              ['Nationalité', player.nationalite || '-'],
              ['Date de naissance', player.date_naissance ? new Date(player.date_naissance).toLocaleDateString('fr-FR') : '-'],
            ].map(([k, v]) => (
              <div key={k} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '3px' }}>{k}</div>
                <div style={{ fontWeight: '500', color: 'var(--text)', fontSize: '14px' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Objectif */}
        {player.objectif && (
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '8px' }}>Objectif sportif</h2>
            <p style={{ color: 'var(--text2)', fontSize: '14px' }}>{player.objectif}</p>
            {player.ouvert_opportunites && (
              <div style={{ marginTop: '8px' }}>
                <span className="badge badge-green">✓ Ouvert à d'autres régions / pays</span>
              </div>
            )}
          </div>
        )}

        {/* Vidéos */}
        {(player.video_highlights || player.video_match) && (
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '1rem' }}>Vidéos</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {player.video_highlights && (
                <a href={player.video_highlights} target="_blank" rel="noreferrer" className="video-link">
                  🎬 Highlights
                </a>
              )}
              {player.video_match && (
                <a href={player.video_match} target="_blank" rel="noreferrer" className="video-link">
                  📹 Match complet
                </a>
              )}
            </div>
          </div>
        )}

        {/* Contact CTA */}
        {isRecruiter && !isOwnProfile && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <button className="btn btn-primary" onClick={() => setShowContact(true)} style={{ padding: '14px 40px', fontSize: '15px' }}>
              📨 Contacter {player.prenom}
            </button>
          </div>
        )}
      </div>

      {showContact && (
        <ContactModal player={player} user={user} onClose={() => setShowContact(false)} />
      )}
    </div>
  )
}
