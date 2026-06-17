import supabase from './supabaseClient'
import { mapUser } from './mappers'

export async function registerUser({ firstName, lastName, username, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { first_name: firstName, last_name: lastName, username } },
  })
  if (error) throw error
  return mapUser(data.user)
}

export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return mapUser(data.user)
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
