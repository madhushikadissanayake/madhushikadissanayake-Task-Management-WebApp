import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [summary, setSummary] = useState({ total: 0, pending: 0, completed: 0 })

  useEffect(() => {
    axios.get('/api/user', { withCredentials: true }).then(res => {
      setUser(res.data.user)
    })

    axios.get('/api/tasks/summary').then(res => {
      setSummary(res.data)
    })
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
      <div className="mt-4 flex gap-4">
        <div className="bg-blue-100 p-4 rounded shadow">Total Tasks: {summary.total}</div>
        <div className="bg-yellow-100 p-4 rounded shadow">Pending: {summary.pending}</div>
        <div className="bg-green-100 p-4 rounded shadow">Completed: {summary.completed}</div>
      </div>
      <Link to="/tasks" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded">
        Go to Task Manager
      </Link>
      <Link to="/profile" className="text-blue-600 underline">
        View Profile
      </Link>
    </div>
  )
}

export default Dashboard
