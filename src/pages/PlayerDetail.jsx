import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ContactModal from '../components/ContactModal'
import ReportButton from '../components/ReportButton'
import './PlayerDetail.css'

// Abréviation du poste pour la carte FIFA
const POSTE_ABBR = {
  'Gardien de but': 'GB', 'Défenseur central': 'DC', 'Latéral droit': 'LD',
  'Latéral gauche': 'LG', 'Milieu défensif': 'MDF', 'Milieu central': 'MC',
  'Milieu offensif': 'MOF', 'Ailier droit': 'AD', 'Ailier gauche': 'AG', 'Attaquant': 'ATT',
}
const PIED_ABBR = { 'Droit': 'D', 'Gauche': 'G', 'Les deux': 'DG' }

// Transforme un lien YouTube en URL d'intégration (lecteur)
function getYoutubeEmbed(url) {
  if (!url) return null
  // Formats gérés : youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return `https://www.youtube.com/embed/${m[1]}`
  }
  return null
}

export default function PlayerDetail({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showContact, setShowContact] = useState(false)
  const [viewers, setViewers] = useState([])
  const [viewCount, setViewCount] = useState(0)
  const [clubHistory, setClubHistory] = useState([])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      // 1. Charger le joueur
      const { data: playerData } = await supabase
        .from('player_profiles').select('*').eq('id', id).single()
      if (cancelled) return
      setPlayer(playerData)
      setLoading(false)
      if (!playerData) return

      // Charger l'historique de clubs (trié du plus récent au plus ancien)
      const { data: history } = await supabase
        .from('club_history')
        .select('*')
        .eq('player_id', id)
        .order('annee_debut', { ascending: false })
      if (!cancelled) setClubHistory(history || [])

      const role = user?.profile?.role
      const isPro = ['recruiter', 'agent', 'club'].includes(role)
      const isOwner = user?.id && playerData.user_id === user.id

      // 2. Si c'est un pro (pas admin, pas le propriétaire) : enregistrer la vue
      if (isPro && !isOwner && user?.id) {
        await supabase.from('profile_views').upsert(
          { player_id: id, viewer_id: user.id, viewed_at: new Date().toISOString() },
          { onConflict: 'player_id,viewer_id' }
        )
      }

      // 3. Si c'est le propriétaire : charger qui a vu son profil
      if (isOwner) {
        const { data: views } = await supabase
          .from('profile_views')
          .select('viewer_id, viewed_at')
          .eq('player_id', id)
          .order('viewed_at', { ascending: false })

        const list = views || []
        setViewCount(list.length)

        if (list.length > 0) {
          // Récupérer les infos des pros qui ont vu le profil
          const viewerIds = list.map(v => v.viewer_id)
          const { data: pros } = await supabase
            .from('pro_profiles')
            .select('user_id, prenom, nom, organisation, role_pro')
            .in('user_id', viewerIds)
          const prosMap = {}
          ;(pros || []).forEach(p => { prosMap[p.user_id] = p })
          setViewers(list.map(v => ({ ...v, pro: prosMap[v.viewer_id] })).filter(v => v.pro))
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [id, user])

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
            {player.poste_principal} · {player.age} ans · {
              (player.est_mineur || (player.age > 0 && player.age < 18))
                ? (player.region || 'Région non précisée')
                : `${player.ville || ''}${player.region ? `, ${player.region}` : ''}`
            }
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
          {isOwnProfile && viewCount > 0 && (
            <div className="ngp-views-badge">
              <span className="ngp-views-num">{viewCount}</span>
              <span className="ngp-views-txt">pro{viewCount > 1 ? 's' : ''} {viewCount > 1 ? 'ont' : 'a'} consulté ton profil</span>
            </div>
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

          {clubHistory.length > 0 && (
            <div>
              <div className="ngp-label">Parcours</div>
              <div className="ngp-timeline">
                {clubHistory.map((c, i) => (
                  <div key={c.id} className="ngp-timeline-item">
                    <div className="ngp-timeline-marker">
                      <span className={`ngp-timeline-dot ${i === 0 ? 'current' : ''}`}></span>
                      {i < clubHistory.length - 1 && <span className="ngp-timeline-line"></span>}
                    </div>
                    <div className="ngp-timeline-content">
                      <div className="ngp-timeline-club">{c.club_nom}</div>
                      <div className="ngp-timeline-period">
                        {c.annee_debut || '?'} → {c.annee_fin || "aujourd'hui"}
                        {c.niveau ? ` · ${c.niveau}` : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(player.video_highlights || player.video_match) && (
            <div>
              <div className="ngp-label">Vidéos</div>
              <div className="ngp-videos-list">
                {player.video_highlights && (
                  <div className="ngp-video-block">
                    <div className="ngp-video-title">Highlights</div>
                    {getYoutubeEmbed(player.video_highlights) ? (
                      <div className="ngp-video-frame">
                        <iframe
                          src={getYoutubeEmbed(player.video_highlights)}
                          title="Highlights"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <a href={player.video_highlights} target="_blank" rel="noreferrer" className="ngp-video">
                        <div className="ngp-video-play"></div>
                        <div className="ngp-video-label">Voir la vidéo</div>
                      </a>
                    )}
                  </div>
                )}
                {player.video_match && (
                  <div className="ngp-video-block">
                    <div className="ngp-video-title">Match complet</div>
                    {getYoutubeEmbed(player.video_match) ? (
                      <div className="ngp-video-frame">
                        <iframe
                          src={getYoutubeEmbed(player.video_match)}
                          title="Match complet"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <a href={player.video_match} target="_blank" rel="noreferrer" className="ngp-video">
                        <div className="ngp-video-play"></div>
                        <div className="ngp-video-label">Voir la vidéo</div>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {isOwnProfile && viewers.length > 0 && (
            <div>
              <div className="ngp-label">Qui a consulté ton profil</div>
              <div className="ngp-viewers">
                {viewers.map((v, i) => {
                  const ROLE = { recruiter: 'Recruteur', agent: 'Agent', club: 'Club' }
                  const init = `${v.pro.prenom?.[0] || ''}${v.pro.nom?.[0] || ''}`.toUpperCase()
                  return (
                    <div key={i} className="ngp-viewer">
                      <div className="ngp-viewer-avatar">{init}</div>
                      <div className="ngp-viewer-info">
                        <div className="ngp-viewer-name">{v.pro.prenom} {v.pro.nom}</div>
                        <div className="ngp-viewer-meta">
                          {ROLE[v.pro.role_pro] || 'Pro'}{v.pro.organisation ? ` · ${v.pro.organisation}` : ''}
                        </div>
                      </div>
                      <div className="ngp-viewer-date">
                        {new Date(v.viewed_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  )
                })}
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

      {user && !isOwnProfile && (
        <div style={{ textAlign: 'center', marginTop: '20px', paddingBottom: '10px' }}>
          <ReportButton cibleType="profil" cibleId={player.id} cibleNom={`${player.prenom} ${player.nom}`} user={user} />
        </div>
      )}

      {showContact && (
        <ContactModal player={player} user={user} onClose={() => setShowContact(false)} />
      )}
    </div>
  )
}
