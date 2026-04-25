import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Messages({ user }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('received') // received | sent

  useEffect(() => { fetchMessages() }, [user, tab])

  const fetchMessages = async () => {
    setLoading(true)
    const field = tab === 'received' ? 'receiver_id' : 'sender_id'
    const { data } = await supabase
      .from('messages')
      .select('*, player_profiles(*)')
      .eq(field, user.id)
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  const markRead = async (id) => {
    await supabase.from('messages').update({ is_read: true }).eq('id', id)
    setMessages(m => m.map(msg => msg.id === id ? { ...msg, is_read: true } : msg))
  }

  const handleSelect = (msg) => {
    setSelected(msg)
    if (!msg.is_read && tab === 'received') markRead(msg.id)
  }

  const unread = messages.filter(m => !m.is_read && tab === 'received').length

  return (
    <div className="page fade-in">
      <div className="container">
        <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: 'var(--text)', marginBottom: '1.5rem' }}>
          Messages {unread > 0 && <span className="badge badge-purple" style={{ fontSize: '12px', verticalAlign: 'middle' }}>{unread} nouveau{unread > 1 ? 'x' : ''}</span>}
        </h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', background: 'var(--bg2)', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {[['received', 'Reçus'], ['sent', 'Envoyés']].map(([val, label]) => (
            <button key={val} onClick={() => { setTab(val); setSelected(null) }}
              style={{
                padding: '8px 20px', borderRadius: '8px', border: 'none',
                background: tab === val ? 'var(--purple)' : 'transparent',
                color: tab === val ? '#fff' : 'var(--text2)',
                cursor: 'pointer', fontSize: '14px', fontWeight: '500',
                transition: 'all 0.2s',
              }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.5fr' : '1fr', gap: '1rem' }}>
          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {loading ? <div className="spinner" /> :
              messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text2)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📭</div>
                  <p>Aucun message {tab === 'received' ? 'reçu' : 'envoyé'}.</p>
                </div>
              ) : messages.map(msg => (
                <div key={msg.id} onClick={() => handleSelect(msg)}
                  className="card"
                  style={{
                    cursor: 'pointer', padding: '1rem',
                    borderColor: selected?.id === msg.id ? 'var(--accent)' : (msg.is_read || tab === 'sent' ? 'var(--border)' : 'var(--purple)'),
                    background: selected?.id === msg.id ? 'rgba(192,132,252,0.05)' : 'var(--bg2)',
                    transition: 'all 0.2s',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <span style={{ fontWeight: !msg.is_read && tab === 'received' ? '600' : '400', fontSize: '14px', color: 'var(--text)' }}>
                      {msg.subject || '(Sans objet)'}
                    </span>
                    {!msg.is_read && tab === 'received' && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: '4px' }} />
                    )}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {msg.content?.slice(0, 60)}...
                  </p>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>
                    {new Date(msg.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            }
          </div>

          {/* Detail */}
          {selected && (
            <div className="card fade-in" style={{ position: 'relative' }}>
              <button onClick={() => setSelected(null)} style={{
                position: 'absolute', top: '1rem', right: '1rem',
                background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: '18px',
              }}>×</button>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '4px', paddingRight: '2rem' }}>
                {selected.subject}
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '1.5rem' }}>
                {new Date(selected.created_at).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
              {selected.player_profiles && (
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '1rem', fontSize: '13px', color: 'var(--text2)' }}>
                  👤 Concernant : {selected.player_profiles.prenom} {selected.player_profiles.nom} · {selected.player_profiles.poste_principal}
                </div>
              )}
              <div style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {selected.content}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
