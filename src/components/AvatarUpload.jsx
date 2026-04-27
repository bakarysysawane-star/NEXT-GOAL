import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AvatarUpload({ user, currentUrl, onUpload }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier la taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Photo trop lourde. Maximum 2MB.')
      return
    }

    // Vérifier le type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Format accepté : JPG, PNG ou WebP.')
      return
    }

    setUploading(true)
    setError('')

    try {
      const ext = file.name.split('.').pop()
      const fileName = `${user.id}/avatar.${ext}`

      // Upload dans Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      // Récupérer l'URL publique
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      const photoUrl = data.publicUrl

      // Appeler le callback avec la nouvelle URL
      onUpload(photoUrl)

    } catch (err) {
      setError('Erreur upload : ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      {/* Avatar preview */}
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'var(--bg3)', border: '2px solid var(--border)',
        overflow: 'hidden', display: 'flex', alignItems: 'center',
        justifyContent: 'center', position: 'relative',
      }}>
        {currentUrl ? (
          <img src={currentUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '28px', color: 'var(--accent)', fontWeight: '700' }}>
            {user.email?.[0]?.toUpperCase()}
          </span>
        )}
      </div>

      {/* Upload button */}
      <label style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '7px 14px', borderRadius: '8px', cursor: 'pointer',
        background: 'rgba(127,119,221,0.15)', border: '1px solid var(--border)',
        color: 'var(--text2)', fontSize: '13px', fontFamily: 'var(--font)',
        transition: 'all 0.2s',
      }}>
        {uploading ? '⏳ Upload...' : '📷 Changer la photo'}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleUpload}
          disabled={uploading}
          style={{ display: 'none' }}
        />
      </label>

      {error && <p style={{ fontSize: '12px', color: '#ef5350', textAlign: 'center' }}>{error}</p>}
      <p style={{ fontSize: '11px', color: 'var(--text3)', textAlign: 'center' }}>JPG, PNG ou WebP · Max 2MB</p>
    </div>
  )
}
