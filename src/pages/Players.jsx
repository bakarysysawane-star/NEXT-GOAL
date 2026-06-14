import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import PlayerCard from '../components/PlayerCard'
import ContactModal from '../components/ContactModal'
import './Players.css'

const POSTES = ['Gardien de but','Défenseur central','Latéral droit','Latéral gauche',
  'Milieu défensif','Milieu central','Milieu offensif','Ailier droit','Ailier gauche','Attaquant']
const REGIONS = ['Île-de-France','PACA','Occitanie','Auvergne-Rhône-Alpes','Nouvelle-Aquitaine',
  'Hauts-de-France','Grand Est','Normandie','Bretagne','Pays de la Loire']
const CATEGORIES = ['U17','U18','U19','U21','Senior','Vétéran']
const NIVEAUX = ['National 1','National 2','National 3','Régional 1','Régional 2','Régional 3','Départemental 1','Départemental 2','Loisir']
const TRANCHES_AGE = [
  { label: 'Moins de 18 ans', min: 0, max: 17 },
  { label: '18 - 21 ans', min: 18, max: 21 },
  { label: '22 - 25 ans', min: 22, max: 25 },
  { label: '26 - 30 ans', min: 26, max: 30 },
  { label: 'Plus de 30 ans', min: 31, max: 99 },
]

export default function Players({ user }) {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [contactPlayer, setContactPlayer] = useState(null)
  const [aiSearch, setAiSearch] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResults, setAiResults] = useState(null)
  const [filters, setFilters] = useState({
    search: '', poste: '', region: '', categorie: '', niveau: '', pied: '', tranche_age: ''
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
    if (filters.tranche_age) {
      const tranche = TRANCHES_AGE.find(t => t.label === filters.tranche_age)
      if (tranche && p.age !== null) {
        if (p.age < tranche.min || p.age > tranche.max) return false
      }
    }
    return true
  })

  const handleAiSearch = async () => {
    if (!aiSearch.trim()) return
    setAiLoading(true)
    setAiResults(null)
    try {
      const playersData = players.map(p => ({
        id: p.id, nom: p.nom, prenom: p.prenom, poste: p.poste_principal,
        region: p.region, age: p.age, niveau: p.niveau_championnat,
        categorie: p.categorie, buts: p.buts, matchs: p.matchs_joues,
        pied: p.pied_fort
      }))

      const { data, error } = await supabase.functions.invoke('ai-search', {
        body: { query: aiSearch, players: playersData }
      })

      if (error) throw error
      setAiResults(data)
    } catch (err) {
      const q = aiSearch.toLowerCase()
      const keywords = q.split(' ')
      const matched = players.filter(p => {
        const text = `${p.prenom} ${p.nom} ${p.poste_principal} ${p.region} ${p.categorie} ${p.niveau_championnat}`.toLowerCase()
        return keywords.some(k => text.includes(k))
      }).slice(0, 4)
      setAiResults({ ids: matched.map(p => p.id), explication: `Résultats basés sur votre recherche : "${aiSearch}"` })
    } finally {
      setAiLoading(false)
    }
  }

  const aiMatchedPlayers = aiResults?.ids ? players.filter(p => aiResults.ids.includes(p.id)) : []
  const displayPlayers = aiResults?.ids ? aiMatchedPlayers : filtered
  const hasActiveFilters = Object.values(filters).some(v => v)

  return (
    <div className="nga fade-in">
      {/* HEADER */}
      <div className="nga-header">
        <div className="nga-eyebrow">Annuaire</div>
        <div className="nga-title">Trouve ton prochain talent</div>
        <div className="nga-sub">"{players.length} profils prêts à être repérés. À toi de jouer."</div>

        {/* AI SEARCH */}
        {isRecruiter && (
          <>
            <div className="nga-ai">
              <span className="nga-ai-badge">IA</span>
              <textarea
                className="nga-ai-input"
                value={aiSearch}
                onChange={e => setAiSearch(e.target.value)}
                placeholder='Ex : attaquant U21 rapide en Île-de-France avec 5+ buts...'
                rows={1}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAiSearch())}
              />
              <button className="nga-ai-btn" onClick={handleAiSearch} disabled={aiLoading}>
                {aiLoading ? '...' : 'Rechercher'}
              </button>
            </div>
            {aiResults?.explication && (
              <div className="nga-ai-result">
                {aiResults.explication}
                <button onClick={() => setAiResults(null)}>Voir tous les joueurs</button>
              </div>
            )}
          </>
        )}

        {/* FILTERS */}
        <div className="nga-filters">
          <input className="nga-search-input" placeholder="Rechercher un nom, un club..." value={filters.search} onChange={e => setFilter('search', e.target.value)} />
          <select className="nga-select" value={filters.poste} onChange={e => setFilter('poste', e.target.value)}>
            <option value="">Tous postes</option>{POSTES.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select className="nga-select" value={filters.region} onChange={e => setFilter('region', e.target.value)}>
            <option value="">Toutes régions</option>{REGIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select className="nga-select" value={filters.categorie} onChange={e => setFilter('categorie', e.target.value)}>
            <option value="">Catégorie</option>{CATEGORIES.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select className="nga-select" value={filters.niveau} onChange={e => setFilter('niveau', e.target.value)}>
            <option value="">Niveau</option>{NIVEAUX.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select className="nga-select" value={filters.pied} onChange={e => setFilter('pied', e.target.value)}>
            <option value="">Pied</option><option>Droit</option><option>Gauche</option><option>Les deux</option>
          </select>
          <select className="nga-select" value={filters.tranche_age} onChange={e => setFilter('tranche_age', e.target.value)}>
            <option value="">Âge</option>{TRANCHES_AGE.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
          </select>
          {hasActiveFilters && (
            <button className="nga-reset" onClick={() => setFilters({ search: '', poste: '', region: '', categorie: '', niveau: '', pied: '', tranche_age: '' })}>Réinitialiser</button>
          )}
        </div>
        <div className="nga-count">
          {displayPlayers.length} joueur{displayPlayers.length > 1 ? 's' : ''} trouvé{displayPlayers.length > 1 ? 's' : ''}
          {aiResults?.ids && <span>Résultats IA</span>}
        </div>
      </div>

      {/* GRID */}
      <div className="nga-body">
        {loading ? <div className="spinner" /> :
          displayPlayers.length === 0 ? (
            <div className="nga-empty">Aucun joueur trouvé avec ces critères.</div>
          ) : (
            <div className="nga-grid">
              {displayPlayers.map(p => (
                <PlayerCard key={p.id} player={p} isRecruiter={isRecruiter} onContact={setContactPlayer} user={user} />
              ))}
            </div>
          )
        }
      </div>

      {contactPlayer && (
        <ContactModal player={contactPlayer} user={user} onClose={() => setContactPlayer(null)} />
      )}
    </div>
  )
}
