import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import './ViewTaskModal.css'

export default function ViewTaskModal({ task, onClose }) {
  const { updateTask, deleteTask, loading } = useApp()
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)

  useEffect(() => {
    setTitle(task.title)
    setDescription(task.description)
  }, [task])

  async function handleSave() {
    await updateTask(task.id, { title: title.trim() || task.title, description })
    onClose()
  }

  async function handleDelete() {
    if (window.confirm(`Delete task "${task.title}"? This cannot be undone.`)) {
      await deleteTask(task.id)
      onClose()
    }
  }

  async function handleToggle() {
    const nowComplete = !task.completed
    await updateTask(task.id, {
      title:       title.trim() || task.title,
      description,
      completed:   nowComplete,
      completedAt: nowComplete ? new Date().toISOString() : null,
    })
    onClose()
  }

  function formatDate(date) {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    })
  }

  function formatDatetime(date) {
    if (!date) return '—'
    return new Date(date).toLocaleString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    })
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>✕</button>

        <input
          className="modal-title-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <div className="modal-date-row">
          <span className="modal-date-value">{formatDate(task.createdAt)}</span>
        </div>

        <div className="modal-desc-label">Description:</div>
        <textarea
          className="modal-desc"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Add a description..."
          rows={4}
        />

        {task.completed && (
          <div className="modal-completed-info">
            <span className="modal-completed-on">
              Completed On: {formatDatetime(task.completedAt)}
            </span>
            <div className="modal-stamp">COMPLETED!!!</div>
          </div>
        )}

        <div className="modal-actions">
          <button className="modal-btn modal-btn--save" onClick={handleSave} disabled={loading}>SAVE</button>
          <button
            className={`modal-btn ${task.completed ? 'modal-btn--pending' : 'modal-btn--complete'}`}
            onClick={handleToggle}
            disabled={loading}
          >
            {task.completed ? 'Pending??' : 'Completed'}
          </button>
          <button className="modal-btn modal-btn--delete" onClick={handleDelete} disabled={loading}>DELETE</button>
        </div>
      </div>
    </div>
  )
}
