import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import './Messages.css'

const ROLE_LABEL = {
  recruiter: 'Recruteur', agent: 'Agent', club: 'Club',
  player: 'Joueur', admin: 'Admin',
}

export default function Messages({ user }) {
  const [allMessages, setAllMessages] = useState([])
  const [profilesMap, setProfilesMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState(null)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => { fetchAll() }, [user])

  const fetchAll = async () => {
    setLoading(true)
    // Tous les messages où l'utilisateur est impliqué (envoyés ou reçus)
    const { data: msgs } = await supabase
      .from('messages')
      .select('*, player_profiles(*)')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: true })

    const messages = msgs || []
    setAllMessages(messages)

    // Récupérer les infos (nom, rôle) de tous les interlocuteurs
    const otherIds = [...new Set(messages.map(m =>
      m.sender_id === user.id ? m.receiver_id : m.sender_id
    ))]
    if (otherIds.length > 0) {
      const { data: profs } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .in('id', otherIds)
      const map = {}
      ;(profs || []).forEach(p => { map[p.id] = p })
      setProfilesMap(map)
    }
    setLoading(false)
  }

  // Regrouper les messages en conversations par interlocuteur
  const conversations = (() => {
    const convs = {}
    allMessages.forEach(m => {
      const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id
      if (!convs[otherId]) convs[otherId] = { otherId, messages: [], lastMsg: null, unread: 0 }
      convs[otherId].messages.push(m)
      convs[otherId].lastMsg = m
      if (!m.is_read && m.receiver_id === user.id) convs[otherId].unread++
    })
    return Object.values(convs).sort((a, b) =>
      new Date(b.lastMsg.created_at) - new Date(a.lastMsg.created_at)
    )
  })()

  const activeConv = conversations.find(c => c.otherId === activeId)

  useEffect(() => {
    if (activeConv) {
      // Marquer comme lus les messages reçus non lus
      const unreadIds = activeConv.messages.filter(m => !m.is_read && m.receiver_id === user.id).map(m => m.id)
      if (unreadIds.length > 0) {
        supabase.from('messages').update({ is_read: true }).in('id', unreadIds).then(() => {
          setAllMessages(prev => prev.map(m => unreadIds.includes(m.id) ? { ...m, is_read: true } : m))
        })
      }
      // Scroll en bas
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [activeId])

  const handleSend = async () => {
    if (!reply.trim() || !activeConv || sending) return
    setSending(true)
    // Retrouver le player_profile_id de la conversation (s'il existe)
    const playerProfileId = activeConv.messages.find(m => m.player_profile_id)?.player_profile_id || null
    const { data, error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: activeConv.otherId,
      player_profile_id: playerProfileId,
      subject: null,
      content: reply.trim(),
      is_read: false,
    }).select('*, player_profiles(*)').single()

    if (!error && data) {
      setAllMessages(prev => [...prev, data])
      setReply('')
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
    setSending(false)
  }

  const getName = (id) => profilesMap[id]?.full_name || 'Utilisateur'
  const getRole = (id) => ROLE_LABEL[profilesMap[id]?.role] || ''
  const getInitials = (id) => {
    const name = profilesMap[id]?.full_name || '?'
    const parts = name.split(' ')
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase()
  }

  const formatTime = (date) => new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  const formatDay = (date) => new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="ngm fade-in">
      <div className="ngm-layout">

        {/* SIDEBAR */}
        <div className={`ngm-sidebar ${activeId ? 'mobile-hide-on-active' : 'mobile-show'}`}>
          <div className="ngm-sidebar-head">
            <div className="ngm-sidebar-title">Messagerie</div>
            <div className="ngm-sidebar-sub">"Tes échanges avec les clubs et recruteurs."</div>
          </div>
          <div className="ngm-conv-list">
            {loading ? <div className="spinner" style={{ margin: '40px auto' }} /> :
              conversations.length === 0 ? (
                <div className="ngm-conv-empty">Aucune conversation pour l'instant.<br />Les échanges apparaîtront ici.</div>
              ) : conversations.map(conv => (
                <div key={conv.otherId}
                  className={`ngm-conv ${activeId === conv.otherId ? 'active' : ''} ${conv.unread > 0 ? 'unread' : ''}`}
                  onClick={() => setActiveId(conv.otherId)}>
                  <div className="ngm-conv-avatar">
                    {getInitials(conv.otherId)}
                    {conv.unread > 0 && <span className="ngm-conv-unread-dot" />}
                  </div>
                  <div className="ngm-conv-body">
                    <div className="ngm-conv-top">
                      <span className="ngm-conv-name">{getName(conv.otherId)}</span>
                      <span className="ngm-conv-time">{formatTime(conv.lastMsg.created_at)}</span>
                    </div>
                    <div className="ngm-conv-preview">
                      {conv.lastMsg.sender_id === user.id ? 'Vous : ' : ''}{conv.lastMsg.content}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* CHAT */}
        <div className="ngm-chat">
          {!activeConv ? (
            <div className="ngm-empty">
              <div className="ngm-empty-title">Sélectionne une conversation</div>
              <div className="ngm-empty-text">"Choisis un échange à gauche pour voir les messages et répondre."</div>
            </div>
          ) : (
            <>
              <div className="ngm-chat-head">
                <div className="ngm-chat-avatar">{getInitials(activeConv.otherId)}</div>
                <div>
                  <div className="ngm-chat-name">{getName(activeConv.otherId)}</div>
                  <div className="ngm-chat-meta">{getRole(activeConv.otherId)}</div>
                </div>
              </div>

              <div className="ngm-messages">
                {activeConv.messages.map((m, i) => {
                  const isMe = m.sender_id === user.id
                  const showDay = i === 0 || formatDay(activeConv.messages[i-1].created_at) !== formatDay(m.created_at)
                  return (
                    <div key={m.id} style={{ display: 'contents' }}>
                      {showDay && <div className="ngm-day">{formatDay(m.created_at)}</div>}
                      <div className={`ngm-row ${isMe ? 'me' : 'other'}`}>
                        <div className="ngm-bubble">
                          {m.subject && <div className="ngm-bubble-subject">{m.subject}</div>}
                          {m.content}
                          <div className="ngm-bubble-time">{new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="ngm-input-area">
                <textarea className="ngm-textarea" value={reply} onChange={e => setReply(e.target.value)}
                  placeholder="Écris ton message..."
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} />
                <button className="ngm-send" onClick={handleSend} disabled={sending || !reply.trim()}>
                  {sending ? '...' : 'Envoyer'}
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
