import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signIn } from '../lib/supabase'
import './Login.css'

export default function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      window.location.href = '/joueurs'
    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect.'
        : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ngl-auth fade-in">
      <div className="ngl-auth-glow" />
      <div className="ngl-auth-box">
        <div className="ngl-auth-head">
          <Link to="/" className="ngl-auth-logo">NEXT GOAL</Link>
          <h1 className="ngl-auth-title">Connexion</h1>
          <p className="ngl-auth-sub">"Content de te revoir. Reprends là où tu t'es arrêté."</p>
        </div>

        <div className="ngl-auth-card">
          <form onSubmit={handleSubmit} className="ngl-auth-form">
            {error && <div className="ngl-auth-error">{error}</div>}

            <div className="ngl-auth-field">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="ton@email.com" required />
            </div>

            <div className="ngl-auth-field">
              <label>Mot de passe</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required />
            </div>

            <button className="ngl-auth-btn" type="submit" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="ngl-auth-divider" />

          <p className="ngl-auth-foot">
            Pas encore de compte ? <Link to="/inscription">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
