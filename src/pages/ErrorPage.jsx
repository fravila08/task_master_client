import { useNavigate } from 'react-router-dom'
import './ErrorPage.css'

export default function ErrorPage() {
  const navigate = useNavigate()

  return (
    <div className="error-bg">
      <div className="error-content">
        <p className="error-message">
          Oops! Something went wrong. We've been notified of this issue and will work diligently to fix it. We apologize for the inconvenience.
        </p>
        <button className="error-home-btn" onClick={() => navigate('/home')}>
          home
        </button>
      </div>
    </div>
  )
}
