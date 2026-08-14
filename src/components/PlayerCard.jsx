import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function PlayerCard({ player, onContact, isRecruiter, user }) {
  const initials = `${player.prenom?.[0] || ''}${player.nom?.[0] || ''}`.toUpperCase()
  const [isFav, setIsFav] = useState(false)
  const [favLoading, setFavLoading] = useState(false)
  const estGardien = player.poste_principal === 'Gardien de but'

  useEffect(() => {
    if (!isRecruiter || !user) return
    supabase.from('favorites')
      .select('id')
      .eq('recruiter_id', user.id)
      .eq('player_id', player.id)
      .single()
      .then(({ data }) => setIsFav(!!data))
  }, [player.id, user])

  const toggleFav = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (!user || favLoading) return
    setFavLoading(true)
    if (isFav) {
      await supabase.from('favorites').delete()
        .eq('recruiter_id', user.id)
        .eq('player_id', player.id)
      setIsFav(false)
    } else {
      await supabase.from('favorites').insert({
        recruiter_id: user.id,
        player_id: player.id,
      })
      setIsFav(true)
    }
    setFavLoading(false)
  }

  return (
    <div className="ngc fade-in">
      {/* Favori */}
      {isRecruiter && (
        <button className={`ngc-fav ${isFav ? 'active' : ''}`} onClick={toggleFav} disabled={favLoading}
          title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
          <svg viewBox="0 0 24 24" fill={isFav ? '#B87FFF' : 'none'} stroke={isFav ? '#B87FFF' : 'rgba(255,255,255,0.4)'} strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      )}

      {/* Header */}
      <div className="ngc-top">
        <div className="ngc-avatar">
          {player.photo_url ? <img src={player.photo_url} alt="" /> : initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="ngc-name">{player.prenom} {player.nom}</div>
          <div className="ngc-pos">{player.poste_principal} · {player.age} ans{
            (player.est_mineur || (player.age > 0 && player.age < 18))
              ? (player.region ? ` · ${player.region}` : '')
              : (player.ville ? ` · ${player.ville}` : '')
          }</div>
        </div>
      </div>

      {/* Stats */}
      <div className="ngc-stats">
        <div className="ngc-stat"><div className="ngc-stat-val">{player.matchs_joues ?? 0}</div><div className="ngc-stat-lbl">MJ</div></div>
        {estGardien
          ? <div className="ngc-stat"><div className="ngc-stat-val">{player.clean_sheets ?? 0}</div><div className="ngc-stat-lbl">CS</div></div>
          : <div className="ngc-stat"><div className="ngc-stat-val">{player.buts ?? 0}</div><div className="ngc-stat-lbl">BUT</div></div>
        }
        <div className="ngc-stat"><div className="ngc-stat-val">{player.passes_decisives ?? 0}</div><div className="ngc-stat-lbl">PAS</div></div>
      </div>

      {/* Tags */}
      <div className="ngc-tags">
        <span className="ngc-tag ngc-tag-purple">{player.categorie}</span>
        {player.region && <span className="ngc-tag ngc-tag-white">{player.niveau_championnat}</span>}
        {player.ouvert_opportunites && <span className="ngc-tag ngc-tag-green">Recherche active</span>}
      </div>

      {/* Actions */}
      <div className="ngc-actions">
        <Link to={`/joueurs/${player.id}`} className="ngc-btn-view" onClick={e => e.stopPropagation()}>Voir profil</Link>
        {isRecruiter && (
          <button className="ngc-btn-contact" onClick={e => { e.stopPropagation(); onContact(player) }}>Contacter</button>
        )}
      </div>
    </div>
  )
}
