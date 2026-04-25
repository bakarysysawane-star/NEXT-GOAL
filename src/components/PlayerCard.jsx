import { Link } from 'react-router-dom'

const COLORS = [
  { bg: '#1a2e1a', text: '#4ade80' },
  { bg: '#0c1e3a', text: '#7dd3fc' },
  { bg: '#2a1a0a', text: '#fbbf24' },
  { bg: '#26215C', text: '#c084fc' },
  { bg: '#2e1a00', text: '#fb923c' },
  { bg: '#1a0a2e', text: '#e879f9' },
]

function getColor(name) {
  const idx = (name?.charCodeAt(0) || 0) % COLORS.length
  return COLORS[idx]
}

export default function PlayerCard({ player, onContact, isRecruiter }) {
  const color = getColor(player.nom)
  const initials = `${player.prenom?.[0] || ''}${player.nom?.[0] || ''}`.toUpperCase()

  return (
    <div className="card fade-in" style={{ cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          background: color.bg, color: color.text,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: '600', fontSize: '16px', flexShrink: 0,
          border: `1px solid ${color.text}30`,
        }}>
          {player.photo_url
            ? <img src={player.photo_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            : initials
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text)' }}>
            {player.prenom} {player.nom}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>
            {player.age} ans · {player.club_actuel}
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
            <span className="badge badge-purple">{player.poste_principal}</span>
            {player.region && <span className="badge badge-blue">{player.region}</span>}
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '10px' }}>
        {player.niveau_championnat} · {player.categorie} · Pied {player.pied_fort}
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
        gap: '6px', padding: '10px 0',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        marginBottom: '12px',
      }}>
        {[
          { label: 'Matchs', val: player.matchs_joues ?? '-' },
          { label: 'Buts', val: player.buts ?? '-' },
          { label: 'Passes', val: player.passes_decisives ?? '-' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text)' }}>{s.val}</div>
            <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* AI Description */}
      {player.ai_description && (
        <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.5', marginBottom: '12px' }}>
          {player.ai_description.slice(0, 100)}...
        </p>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <Link
          to={`/joueurs/${player.id}`}
          className="btn btn-secondary btn-sm"
          style={{ flex: 1, textAlign: 'center' }}
        >
          Voir profil
        </Link>
        {isRecruiter && (
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
            onClick={e => { e.stopPropagation(); onContact(player) }}
          >
            Contacter
          </button>
        )}
      </div>
    </div>
  )
}
