import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import PlayerCard from '../components/PlayerCard'
import ContactModal from '../components/ContactModal'

export default function Recommendations({ user }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [explanation, setExplanation] = useState('')
  const [contactPlayer, setContactPlayer] = useState(null)
  const [proProfile, setProProfile] = useState(null)

  useEffect(() => { fetchAndRecommend() }, [user])

  const fetchAndRecommend = async () => {
    setLoading(true)
    try {
      // 1. Récupérer le profil pro
      const { data: pro } = await supabase
        .from('pro_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      setProProfile(pro)

      // 2. Récupérer les favoris existants
      const { data: favs } = await supabase
        .from('favorites')
        .select('*, player_profiles(*)')
        .eq('recruiter_id', user.id)

      // 3. Récupérer tous les joueurs publiés
      const { data: players } = await supabase
        .from('player_profiles')
        .select('*')
        .eq('statut', 'publie')

      if (!players || players.length === 0) { setLoading(false); return }

      const favIds = (favs || []).map(f => f.player_id)
      const favPlayers = (favs || []).map(f => f.player_profiles).filter(Boolean)

      // 4. Appel IA pour recommandations
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Tu es un assistant de recrutement football expert. Analyse le profil de ce recruteur et recommande les 4 meilleurs joueurs parmi la liste disponible.

PROFIL DU RECRUTEUR:
- Rôle: ${pro?.role_pro || 'recruteur'}
- Organisation: ${pro?.organisation || 'non renseigné'}
- Région couverte: ${pro?.region_couverte || 'France'}
- Postes recherchés: ${pro?.postes_recherches || 'tous postes'}
- Niveau ciblé: ${pro?.niveau_cible || 'tous niveaux'}
- Critères: ${pro?.criteres || 'non renseigné'}

JOUEURS DÉJÀ EN FAVORIS:
${favPlayers.length > 0 ? favPlayers.map(p => `- ${p.prenom} ${p.nom} (${p.poste_principal}, ${p.region})`).join('\n') : 'Aucun favori pour l\'instant'}

JOUEURS DISPONIBLES:
${JSON.stringify(players.filter(p => !favIds.includes(p.id)).map(p => ({
  id: p.id, nom: p.nom, prenom: p.prenom, poste: p.poste_principal,
  region: p.region, age: p.age, niveau: p.niveau_championnat,
  categorie: p.categorie, buts: p.buts, matchs: p.matchs_joues,
  pied: p.pied_fort, objectif: p.objectif
})), null, 2)}

Réponds UNIQUEMENT avec un JSON valide (sans backticks) contenant:
- "ids": tableau des 4 ids des joueurs les plus recommandés
- "explication": explication personnalisée (max 100 mots) pourquoi ces joueurs correspondent au profil du recruteur`
          }]
        })
      })

      const data = await response.json()
      const text = data.content?.[0]?.text || ''
      const result = JSON.parse(text)

      const recommended = players.filter(p => result.ids?.includes(p.id))
      setRecommendations(recommended)
      setExplanation(result.explication || '')
    } catch (err) {
      console.error('Recommandation error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page fade-in">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>
            🤖 Recommandations IA
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '14px' }}>
            Joueurs sélectionnés par l'IA selon votre profil et vos favoris
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spinner" />
            <p style={{ color: 'var(--text2)', marginTop: '1rem', fontSize: '14px' }}>
              L'IA analyse votre profil et sélectionne les meilleurs talents...
            </p>
          </div>
        ) : (
          <>
            {explanation && (
              <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(26,10,46,0.9), rgba(38,33,92,0.3))' }}>
                <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '600', letterSpacing: '1px', marginBottom: '8px' }}>
                  ✨ ANALYSE IA
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7 }}>
                  {explanation}
                </p>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={fetchAndRecommend}
                  style={{ marginTop: '12px' }}
                >
                  🔄 Actualiser les recommandations
                </button>
              </div>
            )}

            {recommendations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text2)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <p>Aucune recommandation disponible pour l'instant.</p>
                <p style={{ fontSize: '13px', marginTop: '8px' }}>Complétez votre profil pro pour de meilleures recommandations.</p>
              </div>
            ) : (
              <div className="grid-auto">
                {recommendations.map(p => (
                  <PlayerCard key={p.id} player={p} isRecruiter={true} onContact={setContactPlayer} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {contactPlayer && <ContactModal player={contactPlayer} user={user} onClose={() => setContactPlayer(null)} />}
    </div>
  )
}
