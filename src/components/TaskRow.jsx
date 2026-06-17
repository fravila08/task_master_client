import { useState } from 'react'
import { useApp } from '../context/AppContext'
import './TaskRow.css'

export default function TaskRow({ task, onOpenModal }) {
  const { updateTask, deleteTask, toggleComplete, loading } = useApp()
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(task.title)

  async function saveEdit() {
    if (editValue.trim()) await updateTask(task.id, { title: editValue.trim() })
    setEditing(false)
  }

  function cancelEdit() {
    setEditValue(task.title)
    setEditing(false)
  }

  async function handleDelete() {
    if (window.confirm(`Delete task "${task.title}"? This cannot be undone.`)) {
      await deleteTask(task.id)
    }
  }

  return (
    <div className={`task-row ${task.completed ? 'task-row--done' : ''} ${editing ? 'task-row--editing' : ''}`}>
      {editing ? (
        <>
          <input
            className="task-edit-input"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
            autoFocus
          />
          <div className="task-row-actions">
            <button className="task-btn task-btn--save" onClick={saveEdit} title="Save" disabled={loading}>✓</button>
            <button className="task-btn task-btn--cancel" onClick={cancelEdit} title="Cancel">✗</button>
          </div>
        </>
      ) : (
        <>
          <span className="task-title" onClick={() => onOpenModal(task)}>
            {task.title}
          </span>
          <div className="task-row-actions">
            <button className="task-btn task-btn--delete" onClick={handleDelete} title="Delete">🗑</button>
            <button className="task-btn task-btn--edit" onClick={() => { setEditValue(task.title); setEditing(true) }} title="Edit">✎</button>
            <input
              type="checkbox"
              className="task-checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task.id)}
              title={task.completed ? 'Mark pending' : 'Mark complete'}
            />
          </div>
        </>
      )}
    </div>
  )
}
