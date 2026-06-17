import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Layout from '../components/Layout'
import TaskRow from '../components/TaskRow'
import ViewTaskModal from '../components/ViewTaskModal'
import './TasksPage.css'

export default function PendingTasksPage() {
  const { tasks, addTask, loading, error } = useApp()
  const [newTitle, setNewTitle] = useState('')
  const [selectedTask, setSelectedTask] = useState(null)

  const pending = [...tasks]
    .filter(t => !t.completed)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  async function handleAdd(e) {
    e.preventDefault()
    if (newTitle.trim()) {
      await addTask({ title: newTitle.trim() })
      setNewTitle('')
    }
  }

  return (
    <Layout>
      <div className="tasks-page">
        <form className="task-create" onSubmit={handleAdd}>
          <input
            className="task-create-input"
            placeholder="new task?"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <button type="submit" className="task-create-btn" disabled={loading}>+</button>
        </form>

        {error && <p className="tasks-error">{error}</p>}
        <p className="tasks-sort-label">Here are your tasks sorted by date created:</p>

        <div className="task-list">
          {pending.map(task => (
            <TaskRow key={task.id} task={task} onOpenModal={setSelectedTask} />
          ))}
          {pending.length === 0 && (
            <p className="tasks-empty">No pending tasks. You're all caught up!</p>
          )}
        </div>
      </div>

      {selectedTask && (
        <ViewTaskModal
          task={tasks.find(t => t.id === selectedTask.id) || selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </Layout>
  )
}
