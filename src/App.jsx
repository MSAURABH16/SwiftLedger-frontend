import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Transfer from './pages/Transfer.jsx'
import Transactions from './pages/Transactions.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Sidebar from './components/Sidebar.jsx'
import Navbar from './components/Navbar.jsx'
import { useAuth } from './hooks/useAuth.jsx'

function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-banking-dark text-slate-100">
      {user && <Navbar />}
      <div className="flex min-h-screen">
        {user && <Sidebar />}
        <main className="flex-1 p-4 lg:p-6">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transfer"
              element={
                <ProtectedRoute>
                  <Transfer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
            <Route path="*" element={<Navigate to={user ? '/' : '/login'} />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
