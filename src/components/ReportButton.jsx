import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ReportButton({ cibleType, cibleId, cibleNom, user }) {
  const [open, setOpen] = useState(false)
  const [motif, setMotif] = useState('')
  const [details, setDetails] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const MOTIFS = [
    'Comportement inapproprie',
    'Faux profil ou usurpation',
    'Contact deplace avec un mineur',
    'Contenu choquant ou inadapte',
    'Spam ou arnaque',
    'Autre',
  ]

  const envoyer = async () => {
    if (!motif) { setError('Merci de choisir un motif.'); return }
    setSending(true)
    setError('')
    try {
      const { error: err } = await supabase.from('signalements').insert({
        auteur_id: user?.id || null,
        cible_type: cibleType,
        cible_id: cibleId || null,
        cible_nom: cibleNom || null,
        motif: motif,
        details: details.trim() || null,
      })
      if (err) throw err
      setSent(true)
    } catch (e) {
      setError("Impossible d'envoyer le signalement pour le moment.")
    } finally {
      setSending(false)
    }
  }

  if (!user) return null

  const overlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px',
  }
  const boxStyle = {
    background: '#111', border: '1px solid #2a2a2a', borderRadius: '14px',
    padding: '24px', maxWidth: '440px', width: '100%',
  }
  const linkStyle = {
    background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.35)',
    fontSize: '12px', cursor: 'pointer', textDecoration: 'underline', padding: '4px 0',
  }
  const selectStyle = {
    width: '100%', background: '#0d0d0d', border: '1px solid #222', color: '#fff',
    padding: '10px', borderRadius: '6px', fontSize: '13px',
  }
  const textareaStyle = {
    width: '100%', background: '#0d0d0d', border: '1px solid #222', color: '#fff',
    padding: '10px', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical',
  }
  const labelStyle = { display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }

  return (
    <>
      <button onClick={() => setOpen(true)} style={linkStyle}>
        Signaler
      </button>

      {open && (
        <div onClick={() => setOpen(false)} style={overlayStyle}>
          <div onClick={(e) => e.stopPropagation()} style={boxStyle}>
            {sent ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#4ade80', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>
                  Signalement envoye
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: 1.6, marginBottom: '18px' }}>
                  Merci. Notre equipe va examiner ce signalement. Tu as bien fait de nous alerter.
                </div>
                <button onClick={() => setOpen(false)} className="ngd-btn ngd-btn-violet ngd-btn-sm">Fermer</button>
              </div>
            ) : (
              <>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>
                  Signaler un probleme
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '18px', lineHeight: 1.5 }}>
                  Aide-nous a garder Next Goal sur. Ton signalement est confidentiel et sera examine par notre equipe.
                </div>

                {error && <div style={{ color: '#ef5350', fontSize: '12px', marginBottom: '12px' }}>{error}</div>}

                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>Motif</label>
                  <select value={motif} onChange={(e) => setMotif(e.target.value)} style={selectStyle}>
                    <option value="">Choisis un motif</option>
                    {MOTIFS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={labelStyle}>Details (facultatif)</label>
                  <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={3} placeholder="Explique ce qui ne va pas..." style={textareaStyle} />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setOpen(false)} className="ngd-btn ngd-btn-ghost ngd-btn-sm">Annuler</button>
                  <button onClick={envoyer} disabled={sending} className="ngd-btn ngd-btn-violet ngd-btn-sm">
                    {sending ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
