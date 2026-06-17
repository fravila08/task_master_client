import { createContext, useContext, useState, useEffect } from 'react'
import { registerUser, loginUser, logoutUser } from '../services/userService'
import { fetchTasks, createTask, patchTask, removeTask } from '../services/taskService'
import { mapUser } from '../services/mappers'
import supabase from '../services/supabaseClient'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [currentUser,    setCurrentUser]    = useState(null)
  const [tasks,          setTasks]          = useState([])
  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState(null)
  const [sessionLoading, setSessionLoading] = useState(true)

  const today = new Date().toDateString()
  const dailyCount = tasks.filter(
    t => t.completed && t.completedAt && new Date(t.completedAt).toDateString() === today
  ).length

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setCurrentUser(mapUser(session.user))
        fetchTasks().then(setTasks).catch(() => {})
      }
      setSessionLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setCurrentUser(null)
        setTasks([])
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function withRequest(fn) {
    setLoading(true)
    setError(null)
    try {
      return await fn()
    } catch (err) {
      const msg = err.message || 'An unexpected error occurred.'
      setError(msg)
      return { error: msg }
    } finally {
      setLoading(false)
    }
  }

  async function register({ firstName, lastName, username, email, password }) {
    return withRequest(async () => {
      const user = await registerUser({ firstName, lastName, username, email, password })
      setCurrentUser(user)
      return { success: true }
    })
  }

  async function login({ email, password }) {
    return withRequest(async () => {
      const user = await loginUser({ email, password })
      setCurrentUser(user)
      const userTasks = await fetchTasks()
      setTasks(userTasks)
      return { success: true }
    })
  }

  async function logout() {
    await logoutUser()
    setCurrentUser(null)
    setTasks([])
    setError(null)
  }

  async function addTask({ title, description = '' }) {
    return withRequest(async () => {
      const task = await createTask({ title, description, userId: currentUser.id })
      setTasks(prev => [task, ...prev])
    })
  }

  async function updateTask(id, changes) {
    return withRequest(async () => {
      const updated = await patchTask(id, changes)
      setTasks(prev => prev.map(t => t.id === id ? updated : t))
    })
  }

  async function deleteTask(id) {
    return withRequest(async () => {
      await removeTask(id)
      setTasks(prev => prev.filter(t => t.id !== id))
    })
  }

  async function toggleComplete(id) {
    return withRequest(async () => {
      const task = tasks.find(t => t.id === id)
      if (!task) return
      const nowComplete = !task.completed
      const updated = await patchTask(id, {
        completed:   nowComplete,
        completedAt: nowComplete ? new Date().toISOString() : null,
      })
      setTasks(prev => prev.map(t => t.id === id ? updated : t))
    })
  }

  return (
    <AppContext.Provider value={{
      currentUser, tasks, dailyCount,
      loading, error, sessionLoading,
      register, login, logout,
      addTask, updateTask, deleteTask, toggleComplete,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
