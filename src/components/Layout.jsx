import { NavLink, useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Layout.css'

export default function Layout({ children }) {
  const { logout, dailyCount } = useApp()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-logo">
          <span className="logo-text">TASK<span className="logo-accent">MASTER</span></span>
        </div>
        <div className="layout-daily">
          <span className="daily-label">TODAY'S COMPLETED</span>
          <span className="daily-count">{dailyCount}</span>
        </div>
      </header>

      <nav className="layout-nav">
        <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
        <NavLink to="/tasks" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>All Tasks</NavLink>
        <NavLink to="/tasks/completed" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Completed</NavLink>
        <NavLink to="/tasks/pending" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Pending</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Contact Us</NavLink>
        <button className="nav-logout" onClick={handleLogout}>Logout</button>
      </nav>

      <main className="layout-main">
        {children}
      </main>

      <Link to="/donate" className="coffee-btn" aria-label="Buy me a coffee">
        <img src="/buy_me_a_coffee.png" alt="Buy me a coffee" className="coffee-img" />
      </Link>
    </div>
  )
}
