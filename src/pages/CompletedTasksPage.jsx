import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Layout from '../components/Layout'
import TaskRow from '../components/TaskRow'
import ViewTaskModal from '../components/ViewTaskModal'
import './TasksPage.css'

export default function CompletedTasksPage() {
  const { tasks } = useApp()
  const [selectedTask, setSelectedTask] = useState(null)

  const completed = [...tasks]
    .filter(t => t.completed)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <Layout>
      <div className="tasks-page">
        <p className="tasks-sort-label">Here are your completed tasks sorted by date created:</p>

        <div className="task-list">
          {completed.map(task => (
            <TaskRow key={task.id} task={task} onOpenModal={setSelectedTask} />
          ))}
          {completed.length === 0 && (
            <p className="tasks-empty">No completed tasks yet. Get to work!</p>
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
