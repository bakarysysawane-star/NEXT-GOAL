import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import PlayerCard from '../components/PlayerCard'
import ContactModal from '../components/ContactModal'
import './Dashboard.css'
import './Players.css'

export default function Favorites({ user }) {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [contactPlayer, setContactPlayer] = useState(null)

  useEffect(() => { fetchFavorites() }, [user])

  const fetchFavorites = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('favorites')
      .select('*, player_profiles(*)')
      .eq('recruiter_id', user.id)
      .order('created_at', { ascending: false })
    setFavorites(data || [])
    setLoading(false)
  }

  const players = favorites.map(f => f.player_profiles).filter(Boolean)

  return (
    <div className="ngd fade-in">
      <div className="ngd-wrap-wide">
        <div className="ngd-head">
          <div>
            <div className="ngd-title">Mes favoris</div>
            <div className="ngd-sub">
              "{players.length} joueur{players.length > 1 ? 's' : ''} que tu gardes à l'œil."
            </div>
          </div>
        </div>

        {loading ? <div className="spinner" /> :
          players.length === 0 ? (
            <div className="ngd-empty">
              <div className="ngd-empty-title">Aucun favori pour l'instant</div>
              <div className="ngd-empty-text">"Ajoute des joueurs depuis l'annuaire en cliquant sur l'étoile."</div>
            </div>
          ) : (
            <div className="nga-grid">
              {players.map(p => (
                <PlayerCard key={p.id} player={p} isRecruiter={true} onContact={setContactPlayer} user={user} />
              ))}
            </div>
          )
        }
      </div>
      {contactPlayer && <ContactModal player={contactPlayer} user={user} onClose={() => setContactPlayer(null)} />}
    </div>
  )
}
