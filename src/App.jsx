import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import ProtectedRoute from './components/ProtectedRoute'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import AllTasksPage from './pages/AllTasksPage'
import PendingTasksPage from './pages/PendingTasksPage'
import CompletedTasksPage from './pages/CompletedTasksPage'
import ContactPage from './pages/ContactPage'
import ErrorPage from './pages/ErrorPage'
import DonatePage from './pages/DonatePage'
import './App.css'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><AllTasksPage /></ProtectedRoute>} />
          <Route path="/tasks/pending" element={<ProtectedRoute><PendingTasksPage /></ProtectedRoute>} />
          <Route path="/tasks/completed" element={<ProtectedRoute><CompletedTasksPage /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
          <Route path="/donate" element={<ProtectedRoute><DonatePage /></ProtectedRoute>} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
