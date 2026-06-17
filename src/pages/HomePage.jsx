import { useApp } from '../context/AppContext'
import Layout from '../components/Layout'
import './HomePage.css'

export default function HomePage() {
  const { tasks, dailyCount } = useApp()

  return (
    <Layout>
      <div className="home-content">
        <header className="home-hero">
          <h1 className="home-title">MISSION CONTROL</h1>
          <p className="home-tagline">Your cyberpunk-grade productivity hub.</p>
        </header>

        <div className="home-stats">
          <div className="stat-card">
            <span className="stat-value">{tasks.length}</span>
            <span className="stat-label">TOTAL TASKS</span>
          </div>
          <div className="stat-card stat-card--pending">
            <span className="stat-value">{tasks.filter(t => !t.completed).length}</span>
            <span className="stat-label">PENDING</span>
          </div>
          <div className="stat-card stat-card--done">
            <span className="stat-value">{tasks.filter(t => t.completed).length}</span>
            <span className="stat-label">COMPLETED</span>
          </div>
          <div className="stat-card stat-card--daily">
            <span className="stat-value">{dailyCount}</span>
            <span className="stat-label">TODAY</span>
          </div>
        </div>

        <div className="panel home-about">
          <p className="home-para">
            Welcome to <strong>TaskMaster</strong> — your cyberpunk-grade productivity hub built for the mercenaries of the modern age. In Night City, every second counts. Here, so do your tasks.
          </p>
          <p className="home-para">
            Create tasks, monitor their progress, and mark them complete as you go. Use the navigation above to jump between your task lists. Need help or want to reach the team? Hit <strong>Contact Us</strong>. Now jack in — there's work to be done.
          </p>
        </div>
      </div>
    </Layout>
  )
}
