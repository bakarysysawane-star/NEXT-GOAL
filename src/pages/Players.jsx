import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import PlayerCard from '../components/PlayerCard'
import ContactModal from '../components/ContactModal'

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

  // Recherche IA via Supabase Edge Function (pour éviter CORS)
  const handleAiSearch = async () => {
    if (!aiSearch.trim()) return
    setAiLoading(true)
    setAiResults(null)
    try {
      // On fait le matching côté client avec les données disponibles
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
      // Fallback : recherche textuelle simple
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

  const selectStyle = {
    padding: '8px 10px', background: 'var(--bg2)',
    border: '1px solid var(--border)', borderRadius: '8px',
    color: 'var(--text2)', fontSize: '13px', cursor: 'pointer', outline: 'none',
  }

  return (
    <div className="page fade-in">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>
            Annuaire des joueurs
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '14px' }}>
            {players.length} profils publiés · Filtrez et trouvez vos futures recrues
          </p>
        </div>

        {/* AI Search */}
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
                  placeholder='Ex: "attaquant U21 rapide en Île-de-France avec 5+ buts"'
                  rows={2}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: '14px', resize: 'none', outline: 'none' }}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAiSearch())}
                />
              </div>
              <button className="btn btn-primary" onClick={handleAiSearch} disabled={aiLoading}
                style={{ alignSelf: 'flex-end', whiteSpace: 'nowrap' }}>
                {aiLoading ? '...' : '🔍 Chercher'}
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
            <select style={selectStyle} value={filters.poste} onChange={e => setFilter('poste', e.target.value)}>
              <option value="">Poste</option>
              {POSTES.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <select style={selectStyle} value={filters.region} onChange={e => setFilter('region', e.target.value)}>
              <option value="">Région</option>
              {REGIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <select style={selectStyle} value={filters.categorie} onChange={e => setFilter('categorie', e.target.value)}>
              <option value="">Catégorie</option>
              {CATEGORIES.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <select style={selectStyle} value={filters.niveau} onChange={e => setFilter('niveau', e.target.value)}>
              <option value="">Niveau</option>
              {NIVEAUX.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <select style={selectStyle} value={filters.pied} onChange={e => setFilter('pied', e.target.value)}>
              <option value="">Pied</option>
              <option>Droit</option><option>Gauche</option><option>Les deux</option>
            </select>
            <select style={selectStyle} value={filters.tranche_age} onChange={e => setFilter('tranche_age', e.target.value)}>
              <option value="">Âge</option>
              {TRANCHES_AGE.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
            </select>
            {Object.values(filters).some(v => v) && (
              <button onClick={() => setFilters({ search: '', poste: '', region: '', categorie: '', niveau: '', pied: '', tranche_age: '' })}
                className="btn btn-secondary btn-sm">✕ Effacer</button>
            )}
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text3)' }}>
            {displayPlayers.length} joueur{displayPlayers.length > 1 ? 's' : ''} trouvé{displayPlayers.length > 1 ? 's' : ''}
            {aiResults?.ids && <span style={{ color: 'var(--accent)', marginLeft: '8px' }}>· Résultats IA</span>}
          </div>
        </div>

        {/* Players grid */}
        {loading ? <div className="spinner" /> :
          displayPlayers.length === 0 ? (
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
                  user={user}
                />
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
