export function mapUser(authUser) {
  const meta = authUser.user_metadata ?? {}
  return {
    id:        authUser.id,
    firstName: meta.first_name ?? '',
    lastName:  meta.last_name ?? '',
    username:  meta.username ?? '',
    email:     authUser.email,
  }
}

export function mapTask(row) {
  return {
    id:          row.id,
    title:       row.title,
    description: row.description ?? '',
    createdAt:   row.created_at,
    completed:   row.completed,
    completedAt: row.completed_at,
    userId:      row.user_id,
  }
}
