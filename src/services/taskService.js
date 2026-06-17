import supabase from './supabaseClient'
import { mapTask } from './mappers'

export async function fetchTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(mapTask)
}

export async function createTask({ title, description = '', userId }) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({ title, description, completed: false, completed_at: null, user_id: userId })
    .select()
    .single()
  if (error) throw error
  return mapTask(data)
}

export async function patchTask(id, changes) {
  const payload = {}
  if (changes.title       !== undefined) payload.title        = changes.title
  if (changes.description !== undefined) payload.description  = changes.description
  if (changes.completed   !== undefined) payload.completed    = changes.completed
  if (changes.completedAt !== undefined) payload.completed_at = changes.completedAt

  const { data, error } = await supabase
    .from('tasks')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return mapTask(data)
}

export async function removeTask(id) {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}
