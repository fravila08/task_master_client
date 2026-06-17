import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './AuthPage.css'

export default function AuthPage() {
  const { register, login, loading } = useApp()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '',
    email: '', password: '', confirmPassword: '',
  })

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (isLogin) {
      const result = await login({ email: form.email, password: form.password })
      if (result?.error) { setError(result.error); return }
    } else {
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match.')
        return
      }
      if (!form.email) {
        setError('Email is required.')
        return
      }
      const result = await register({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        password: form.password,
      })
      if (result?.error) { setError(result.error); return }
    }

    navigate('/home')
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-text">TASK<span className="logo-accent">MASTER</span></span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <input
                name="firstName"
                placeholder="first_name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <input
                name="lastName"
                placeholder="last_name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
              <input
                name="username"
                placeholder="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </>
          )}

          <input
            name="email"
            type="email"
            placeholder="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="password-wrap">
            <input
              name="password"
              type="password"
              placeholder="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="password-wrap">
              <input
                name="confirmPassword"
                type="password"
                placeholder="confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {error && <p className="auth-error">{error}</p>}

          <div className="auth-actions">
            <button
              type="button"
              className="auth-toggle"
              onClick={() => { setIsLogin(p => !p); setError('') }}
            >
              {isLogin ? "I don't have an account" : 'I have an account'}
            </button>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Loading...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
