import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ContactModal({ player, user, onClose }) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const estMineur = player.est_mineur || (typeof player.age === 'number' && player.age > 0 && player.age < 18)

  const handleSend = async e => {
    e.preventDefault()
    setSending(true); setError('')
    try {
      // Pour un mineur, on préfixe le message d'une mention rappelant le cadre parental
      const contenuFinal = estMineur
        ? `[Échange concernant un joueur mineur — le représentant légal (${player.parent_nom || 'parent'}${player.parent_email ? `, ${player.parent_email}` : ''}) est informé de ce contact.]\n\n${message}`
        : message

      const { error: err } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: player.user_id,
        player_profile_id: player.id,
        subject,
        content: contenuFinal,
        is_read: false,
      })
      if (err) throw err
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally { setSending(false) }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'none', border: 'none', color: 'var(--text2)',
          cursor: 'pointer', fontSize: '20px',
        }}>×</button>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ color: 'var(--text)', marginBottom: '8px' }}>Message envoyé !</h3>
            <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '1.5rem' }}>
              {player.prenom} recevra votre message.
            </p>
            <button className="btn btn-primary" onClick={onClose}>Fermer</button>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>
              Contacter {player.prenom} {player.nom}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '1.5rem' }}>
              {player.poste_principal} · {player.club_actuel} · {player.region}
            </p>

            {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

            {estMineur && (
              <div style={{
                background: 'rgba(184,127,255,0.1)', border: '1px solid rgba(184,127,255,0.4)',
                borderRadius: '10px', padding: '14px 16px', marginBottom: '1.25rem',
              }}>
                <div style={{ color: '#B87FFF', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>
                  Joueur mineur — cadre protégé
                </div>
                <div style={{ color: 'var(--text2)', fontSize: '12px', lineHeight: 1.6 }}>
                  Ce joueur a moins de 18 ans. Tout contact doit rester strictement professionnel et respectueux.
                  Son représentant légal est informé de cet échange{player.parent_nom ? ` : ${player.parent_nom}` : ''}.
                  {player.parent_email && <><br />Contact du parent : <strong style={{ color: 'var(--text)' }}>{player.parent_email}</strong></>}
                </div>
              </div>
            )}

            <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Objet *</label>
                <input value={subject} onChange={e => setSubject(e.target.value)}
                  placeholder="Proposition, invitation au test..." required />
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Bonjour, j'ai consulté votre profil et je souhaite..."
                  rows={5} required />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={sending} style={{ flex: 1 }}>
                  {sending ? 'Envoi...' : '📨 Envoyer'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
