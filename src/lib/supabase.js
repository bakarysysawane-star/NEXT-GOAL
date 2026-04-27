export const getUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (error) {
      console.error('Profile error:', error)
      return { ...user, profile: { role: 'player' } }
    }
    
    return { ...user, profile }
  } catch (err) {
    console.error('GetUser error:', err)
    return null
  }
}
