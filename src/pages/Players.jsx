import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import PlayerCard from '../components/PlayerCard'
import ContactModal from '../components/ContactModal'

const POSTES = ['Gardien de but','Défenseur central','Latéral droit','Latéral gauche',
  'Milieu défensif','Milieu central','Milieu offensif','Ailier droit','Ailier gauche','Attaquant']
const REGIONS = ['Île-de-France','PACA','Occitanie','Auvergne-Rhône-Alpes','Nouvelle-Aquitaine',
  'Hauts-de-France','Grand Est','Normandie','Bretagne','Pays de la Loire']
const CATEGORIES = ['U17','U18','U19','U21','Senior','Vétéran']
const NIVEAUX = ['National 3','Régional 1','Régional 2','Régional 3','Départemental 1','Départemental 2']

export default function Players({ user }) {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [contactPlayer, setContactPlayer] = useState(null)
  const [aiSearch, setAiSearch] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResults, setAiResults] = useState(null)
  const [filters, setFilters] = useState({
    search: '', poste: '', region: '', categorie: '', niveau: '', pied: ''
  })

  const role = user?.profile?.role
  const isRecruiter = ['recruiter', 'agent', 'club', 'admin'].includes(role)

  useEffect(() => { fetchPlayers() }, [])

  const fetchPlayers = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('player_profiles')
      .select('*')
      .eq('statut', 'publie')
      .order('created_at', { ascending: false })
    setPlayers(data || [])
    setLoading(false)
  }

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v }))

  const filtered = players.filter(p => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (!`${p.prenom} ${p.nom} ${p.club_actuel}`.toLowerCase().includes(q)) return false
    }
    if (filters.poste && p.poste_principal !== filters.poste) return false
    if (filters.region && p.region !== filters.region) return false
    if (filters.categorie && p.categorie !== filters.categorie) return false
    if (filters.niveau && p.niveau_championnat !== filters.niveau) return false
    if (filters.pied && p.pied_fort !== filters.pied) return false
    return true
  })

  const handleAiSearch = async () => {
    if (!aiSearch.trim()) return
    setAiLoading(true)
    setAiResults(null)
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Tu es un assistant de recrutement football. Voici la demande du recruteur : "${aiSearch}"
            
Voici la liste des joueurs disponibles (JSON):
${JSON.stringify(players.map(p => ({
  id: p.id, nom: p.nom, prenom: p.prenom, poste: p.poste_principal,
  region: p.region, age: p.age, niveau: p.niveau_championnat,
  categorie: p.categorie, buts: p.buts, matchs: p.matchs_joues
})), null, 2)}

Réponds UNIQUEMENT avec un JSON valide (sans backticks ni markdown) contenant:
- "ids": tableau des ids des 3 meilleurs joueurs correspondant à la demande
- "explication": courte explication (max 80 mots) de pourquoi ces joueurs correspondent`
          }]
        })
      })
      const data = await response.json()
      const text = data.content?.[0]?.text || ''
      const result = JSON.parse(text)
      setAiResults(result)
    } catch (err) {
      setAiResults({ error: 'Erreur lors de la recherche IA. Réessaie.' })
    } finally {
      setAiLoading(false)
    }
  }

  const aiMatchedPlayers = aiResults?.ids
    ? players.filter(p => aiResults.ids.includes(p.id))
    : []

  const displayPlayers = aiResults?.ids ? aiMatchedPlayers : filtered

  return (
    <div className="page fade-in">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>
            Annuaire des joueurs
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '14px' }}>
            {players.length} profils publiés · Filtrez et trouvez vos futures recrues
          </p>
        </div>

        {/* AI Search (recruteurs only) */}
        {isRecruiter && (
          <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(26,10,46,0.9), rgba(38,33,92,0.5))' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '600', marginBottom: '6px', letterSpacing: '1px' }}>
                  ✨ RECHERCHE IA
                </div>
                <textarea
                  value={aiSearch}
                  onChange={e => setAiSearch(e.target.value)}
                  placeholder='Ex: "Je cherche un attaquant U21 rapide en Île-de-France avec au moins 5 buts cette saison"'
                  rows={2}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: '14px', resize: 'none', outline: 'none' }}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAiSearch())}
                />
              </div>
              <button className="btn btn-primary" onClick={handleAiSearch} disabled={aiLoading}
                style={{ alignSelf: 'flex-end', whiteSpace: 'nowrap' }}>
                {aiLoading ? '...' : '🔍 Matcher'}
              </button>
            </div>
            {aiResults?.explication && (
              <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(192,132,252,0.1)', borderRadius: '8px', fontSize: '13px', color: 'var(--text2)' }}>
                🤖 {aiResults.explication}
                <button style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '12px' }}
                  onClick={() => setAiResults(null)}>
                  Voir tous les joueurs
                </button>
              </div>
            )}
            {aiResults?.error && (
              <div className="alert alert-error" style={{ marginTop: '8px' }}>{aiResults.error}</div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              placeholder="🔍 Rechercher..."
              value={filters.search}
              onChange={e => setFilter('search', e.target.value)}
              style={{ flex: 2, minWidth: '180px', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px', outline: 'none' }}
            />
            {[
              { k: 'poste', opts: POSTES, label: 'Poste' },
              { k: 'region', opts: REGIONS, label: 'Région' },
              { k: 'categorie', opts: CATEGORIES, label: 'Catégorie' },
              { k: 'niveau', opts: NIVEAUX, label: 'Niveau' },
            ].map(({ k, opts, label }) => (
              <select key={k} value={filters[k]} onChange={e => setFilter(k, e.target.value)}
                style={{ padding: '8px 10px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', color: filters[k] ? 'var(--text)' : 'var(--text3)', fontSize: '13px', cursor: 'pointer', outline: 'none' }}>
                <option value="">{label}</option>
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ))}
            <select value={filters.pied} onChange={e => setFilter('pied', e.target.value)}
              style={{ padding: '8px 10px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text3)', fontSize: '13px', cursor: 'pointer', outline: 'none' }}>
              <option value="">Pied</option>
              <option>Droit</option><option>Gauche</option><option>Les deux</option>
            </select>
            {Object.values(filters).some(v => v) && (
              <button onClick={() => setFilters({ search: '', poste: '', region: '', categorie: '', niveau: '', pied: '' })}
                className="btn btn-secondary btn-sm">
                ✕ Effacer
              </button>
            )}
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text3)' }}>
            {displayPlayers.length} joueur{displayPlayers.length > 1 ? 's' : ''} trouvé{displayPlayers.length > 1 ? 's' : ''}
            {aiResults?.ids && <span style={{ color: 'var(--accent)', marginLeft: '8px' }}>· Résultats IA</span>}
          </div>
        </div>

        {/* Players grid */}
        {loading ? (
          <div className="spinner" />
        ) : displayPlayers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text2)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p>Aucun joueur trouvé avec ces critères.</p>
          </div>
        ) : (
          <div className="grid-auto">
            {displayPlayers.map(p => (
              <PlayerCard
                key={p.id}
                player={p}
                isRecruiter={isRecruiter}
                onContact={setContactPlayer}
              />
            ))}
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {contactPlayer && (
        <ContactModal
          player={contactPlayer}
          user={user}
          onClose={() => setContactPlayer(null)}
        />
      )}
    </div>
  )
}
