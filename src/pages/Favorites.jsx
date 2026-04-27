import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import PlayerCard from '../components/PlayerCard'
import ContactModal from '../components/ContactModal'

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

  const removeFavorite = async (playerId) => {
    await supabase.from('favorites').delete()
      .eq('recruiter_id', user.id)
      .eq('player_id', playerId)
    setFavorites(f => f.filter(fav => fav.player_id !== playerId))
  }

  const players = favorites.map(f => f.player_profiles).filter(Boolean)

  return (
    <div className="page fade-in">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>
            ⭐ Mes favoris
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '14px' }}>
            {players.length} joueur{players.length > 1 ? 's' : ''} sauvegardé{players.length > 1 ? 's' : ''}
          </p>
        </div>

        {loading ? <div className="spinner" /> :
          players.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
              <h3 style={{ color: 'var(--text)', marginBottom: '8px' }}>Aucun favori pour l'instant</h3>
              <p style={{ fontSize: '14px' }}>Ajoutez des joueurs en cliquant sur ⭐ depuis l'annuaire.</p>
            </div>
          ) : (
            <div className="grid-auto">
              {players.map(p => (
                <div key={p.id} style={{ position: 'relative' }}>
                  <PlayerCard player={p} isRecruiter={true} onContact={setContactPlayer} />
                  <button
                    onClick={() => removeFavorite(p.id)}
                    style={{
                      position: 'absolute', top: '10px', right: '10px',
                      background: 'rgba(211,47,47,0.2)', border: '1px solid rgba(211,47,47,0.4)',
                      color: '#ef5350', borderRadius: '6px', padding: '4px 8px',
                      cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font)',
                    }}
                  >
                    Retirer
                  </button>
                </div>
              ))}
            </div>
          )
        }
      </div>
      {contactPlayer && <ContactModal player={contactPlayer} user={user} onClose={() => setContactPlayer(null)} />}
    </div>
  )
}
