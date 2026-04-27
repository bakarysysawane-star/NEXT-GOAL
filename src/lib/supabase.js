import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const signUp = async (email, password, role, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role, full_name: fullName } }
  })
  if (error) throw error

  if (data.user) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    await supabase.from('profiles').upsert({
      id: data.user.id,
      role,
      full_name: fullName
    })
  }

  return data
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    if (error) return { ...user, profile: { role: 'player' } }
    return { ...user, profile }
  } catch (err) {
    return null
  }
}
