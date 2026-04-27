import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase, getUser } from './lib/supabase'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import SignupChoice from './pages/SignupChoice'
import SignupJoueur from './pages/SignupJoueur'
import SignupPro from './pages/SignupPro'
import SignupSuccess from './pages/SignupSuccess'
import Players from './pages/Players'
import PlayerDetail from './pages/PlayerDetail'
import MyProfile from './pages/MyProfile'
import Messages from './pages/Messages'
import Admin from './pages/Admin'
import Favorites from './pages/Favorites'
import Recommendations from './pages/Recommendations'
import MyProProfile from './pages/MyProProfile'

function RequireAuth({ user, loading, children, roles }) {
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><div className="spinner" /></div>
  if (!user) return <Navigate to="/connexion" replace />
  if (roles && !roles.includes(user.profile?.role)) return <Navigate to="/joueurs" replace />
  return children
}

function RequireGuest({ user, loading, children }) {
  if (loading) return null
  if (user) return <Navigate to="/joueurs" replace />
  return children
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUser()
      .then(u => { setUser(u); setLoading(false) })
      .catch(() => setLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        getUser().then(u => { setUser(u); setLoading(false) })
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const showNav = user !== null

  return (
    <BrowserRouter>
      {showNav && <Navbar user={user} />}
      <Routes>
        {/* Public */}
        <Route path="/" element={<RequireGuest user={user} loading={loading}><Home /></RequireGuest>} />
        <Route path="/connexion" element={<RequireGuest user={user} loading={loading}><Login setUser={setUser} /></RequireGuest>} />
        <Route path="/inscription" element={<RequireGuest user={user} loading={loading}><SignupChoice /></RequireGuest>} />
        <Route path="/inscription/joueur" element={<RequireGuest user={user} loading={loading}><SignupJoueur /></RequireGuest>} />
        <Route path="/inscription/pro" element={<RequireGuest user={user} loading={loading}><SignupPro /></RequireGuest>} />
        <Route path="/inscription/succes" element={<SignupSuccess />} />

        {/* Protected — all logged in */}
        <Route path="/joueurs" element={<RequireAuth user={user} loading={loading}><Players user={user} /></RequireAuth>} />
        <Route path="/joueurs/:id" element={<RequireAuth user={user} loading={loading}><PlayerDetail user={user} /></RequireAuth>} />
        <Route path="/messages" element={<RequireAuth user={user} loading={loading}><Messages user={user} /></RequireAuth>} />

        {/* Player only */}
        <Route path="/mon-profil" element={<RequireAuth user={user} loading={loading} roles={['player', 'admin']}><MyProfile user={user} /></RequireAuth>} />

        {/* Pro only */}
        <Route path="/favoris" element={<RequireAuth user={user} loading={loading} roles={['recruiter', 'agent', 'club', 'admin']}><Favorites user={user} /></RequireAuth>} />
        <Route path="/recommandations" element={<RequireAuth user={user} loading={loading} roles={['recruiter', 'agent', 'club', 'admin']}><Recommendations user={user} /></RequireAuth>} />
        <Route path="/mon-profil-pro" element={
  <RequireAuth user={user} loading={loading} roles={['recruiter','agent','club']}>
    <MyProProfile user={user} />
  </RequireAuth>
} />

        {/* Admin only */}
        <Route path="/admin" element={<RequireAuth user={user} loading={loading} roles={['admin']}><Admin user={user} /></RequireAuth>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? '/joueurs' : '/'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
