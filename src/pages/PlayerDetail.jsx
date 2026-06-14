import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ContactModal from '../components/ContactModal'
import './PlayerDetail.css'

// Abréviation du poste pour la carte FIFA
const POSTE_ABBR = {
  'Gardien de but': 'GB', 'Défenseur central': 'DC', 'Latéral droit': 'LD',
  'Latéral gauche': 'LG', 'Milieu défensif': 'MDF', 'Milieu central': 'MC',
  'Milieu offensif': 'MOF', 'Ailier droit': 'AD', 'Ailier gauche': 'AG', 'Attaquant': 'ATT',
}
const PIED_ABBR = { 'Droit': 'D', 'Gauche': 'G', 'Les deux': 'DG' }

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

  if (loading) return <div className="ngp" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}><div className="spinner" /></div>
  if (!player) return <div className="ngp" style={{ padding:'80px 6vw' }}><p style={{ color:'rgba(255,255,255,0.4)' }}>Joueur introuvable.</p></div>

  const initiales = `${player.prenom?.[0] || ''}${player.nom?.[0] || ''}`
  const posteAbbr = POSTE_ABBR[player.poste_principal] || (player.poste_principal?.slice(0,3).toUpperCase()) || '—'
  const piedAbbr = PIED_ABBR[player.pied_fort] || '—'
  const estGardien = player.poste_principal === 'Gardien de but'

  return (
    <div className="ngp fade-in">
      <button className="ngp-back" onClick={() => navigate(-1)}>← Retour</button>

      {/* HEADER */}
      <div className="ngp-header">
        <div className="ngp-avatar">
          {player.photo_url ? <img src={player.photo_url} alt="" /> : initiales}
        </div>
        <div>
          <div className="ngp-name">{player.prenom} {player.nom}</div>
          <div className="ngp-meta">
            {player.poste_principal} · {player.age} ans · {player.ville}{player.region ? `, ${player.region}` : ''}
          </div>
          <div className="ngp-tags">
            <span className="ngp-tag ngp-tag-purple">{player.categorie}</span>
            <span className="ngp-tag ngp-tag-white">{player.niveau_championnat}</span>
            {player.club_actuel && <span className="ngp-tag ngp-tag-white">{player.club_actuel}</span>}
            {player.poste_secondaire && <span className="ngp-tag ngp-tag-white">{player.poste_secondaire}</span>}
            {player.ouvert_opportunites && <span className="ngp-tag ngp-tag-active">En recherche active</span>}
          </div>
        </div>
        <div className="ngp-actions">
          {isRecruiter && !isOwnProfile && (
            <button className="ngp-btn-contact" onClick={() => setShowContact(true)}>Contacter</button>
          )}
          {isOwnProfile && (
            <button className="ngp-btn-edit" onClick={() => navigate('/mon-profil')}>Modifier mon profil</button>
          )}
          {typeof player.vues === 'number' && player.vues > 0 && (
            <div className="ngp-views">Vu par {player.vues} recruteur{player.vues > 1 ? 's' : ''}</div>
          )}
        </div>
      </div>

      {/* BODY */}
      <div className="ngp-body">
        {/* GAUCHE */}
        <div className="ngp-left">
          <div>
            <div className="ngp-label">Carte Next Goal</div>
            <div className="ngp-fifa">
              <div className="ngp-fifa-top">
                <div className="ngp-fifa-pos">{posteAbbr}</div>
                <div className="ngp-fifa-logo">NEXT<br />GOAL</div>
              </div>
              <div className="ngp-fifa-photo">
                {player.photo_url ? <img src={player.photo_url} alt="" /> : initiales}
              </div>
              <div className="ngp-fifa-meta">
                {player.club_actuel || '—'} · {player.categorie || '—'} · {player.niveau_championnat || '—'}
              </div>
              <div className="ngp-fifa-name">{player.nom}</div>
              <div className="ngp-fifa-stats">
                <div className="ngp-fifa-col">
                  <div className="ngp-fifa-stat"><span className="ngp-fifa-val">{player.matchs_joues ?? 0}</span><span className="ngp-fifa-lbl">MJ</span></div>
                  {estGardien
                    ? <div className="ngp-fifa-stat"><span className="ngp-fifa-val">{player.clean_sheets ?? 0}</span><span className="ngp-fifa-lbl">CS</span></div>
                    : <div className="ngp-fifa-stat"><span className="ngp-fifa-val">{player.buts ?? 0}</span><span className="ngp-fifa-lbl">BUT</span></div>
                  }
                  <div className="ngp-fifa-stat"><span className="ngp-fifa-val">{player.passes_decisives ?? 0}</span><span className="ngp-fifa-lbl">PAS</span></div>
                </div>
                <div className="ngp-fifa-sep"></div>
                <div className="ngp-fifa-col">
                  <div className="ngp-fifa-stat"><span className="ngp-fifa-val">{player.age ?? '—'}</span><span className="ngp-fifa-lbl">ÂGE</span></div>
                  <div className="ngp-fifa-stat"><span className="ngp-fifa-val">{player.taille ? player.taille : '—'}</span><span className="ngp-fifa-lbl">CM</span></div>
                  <div className="ngp-fifa-stat"><span className="ngp-fifa-val">{piedAbbr}</span><span className="ngp-fifa-lbl">PIED</span></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="ngp-label">Informations</div>
            <div className="ngp-quick">
              <div className="ngp-quick-row"><span className="ngp-quick-label">Taille</span><span className="ngp-quick-val">{player.taille ? `${player.taille} cm` : '—'}</span></div>
              <div className="ngp-quick-row"><span className="ngp-quick-label">Poids</span><span className="ngp-quick-val">{player.poids ? `${player.poids} kg` : '—'}</span></div>
              <div className="ngp-quick-row"><span className="ngp-quick-label">Pied fort</span><span className="ngp-quick-val">{player.pied_fort || '—'}</span></div>
              <div className="ngp-quick-row"><span className="ngp-quick-label">Poste sec.</span><span className="ngp-quick-val">{player.poste_secondaire || '—'}</span></div>
              <div className="ngp-quick-row"><span className="ngp-quick-label">Nationalité</span><span className="ngp-quick-val">{player.nationalite || '—'}</span></div>
              {player.date_naissance && (
                <div className="ngp-quick-row"><span className="ngp-quick-label">Naissance</span><span className="ngp-quick-val">{new Date(player.date_naissance).toLocaleDateString('fr-FR')}</span></div>
              )}
              {player.ouvert_opportunites && (
                <div className="ngp-quick-row"><span className="ngp-quick-label">Mobilité</span><span className="ngp-quick-val" style={{ color:'#4ade80' }}>Autres régions OK</span></div>
              )}
            </div>
          </div>
        </div>

        {/* DROITE */}
        <div className="ngp-right">
          <div>
            <div className="ngp-label">Statistiques — Dernière saison</div>
            <div className="ngp-stats-grid">
              <div className="ngp-stat-box"><div className="ngp-stat-box-val">{player.matchs_joues ?? 0}</div><div className="ngp-stat-box-lbl">Matchs joués</div></div>
              <div className="ngp-stat-box"><div className="ngp-stat-box-val">{player.buts ?? 0}</div><div className="ngp-stat-box-lbl">Buts</div></div>
              <div className="ngp-stat-box"><div className="ngp-stat-box-val">{player.passes_decisives ?? 0}</div><div className="ngp-stat-box-lbl">Passes déc.</div></div>
              <div className="ngp-stat-box"><div className="ngp-stat-box-val">{estGardien ? (player.clean_sheets ?? 0) : player.niveau_championnat}</div><div className="ngp-stat-box-lbl">{estGardien ? 'Clean sheets' : 'Niveau'}</div></div>
            </div>
          </div>

          {(player.objectif || player.ai_description) && (
            <div>
              <div className="ngp-label">Objectif sportif</div>
              <div className="ngp-bio">{player.ai_description || player.objectif}</div>
            </div>
          )}

          {(player.video_highlights || player.video_match) && (
            <div>
              <div className="ngp-label">Vidéos</div>
              <div className="ngp-videos">
                {player.video_highlights && (
                  <a href={player.video_highlights} target="_blank" rel="noreferrer" className="ngp-video">
                    <div className="ngp-video-play"></div>
                    <div className="ngp-video-label">Highlights</div>
                  </a>
                )}
                {player.video_match && (
                  <a href={player.video_match} target="_blank" rel="noreferrer" className="ngp-video">
                    <div className="ngp-video-play"></div>
                    <div className="ngp-video-label">Match complet</div>
                  </a>
                )}
              </div>
            </div>
          )}

          {isRecruiter && !isOwnProfile && (
            <div className="ngp-cta-final">
              <button className="ngp-btn-contact" onClick={() => setShowContact(true)} style={{ padding:'14px 40px' }}>
                Contacter {player.prenom}
              </button>
            </div>
          )}
        </div>
      </div>

      {showContact && (
        <ContactModal player={player} user={user} onClose={() => setShowContact(false)} />
      )}
    </div>
  )
}
