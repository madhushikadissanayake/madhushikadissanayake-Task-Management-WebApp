import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import TaskList from './pages/TaskList'
import AddTask from './pages/AddTask'
import EditTask from './pages/EditTask'
import ViewTask from './pages/ViewTask'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
          <Route path="/tasks/add" element={<ProtectedRoute><AddTask /></ProtectedRoute>} />
          <Route path="/tasks/edit/:id" element={<ProtectedRoute><EditTask /></ProtectedRoute>} />
          <Route path="/tasks/view/:id" element={<ProtectedRoute><ViewTask /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

