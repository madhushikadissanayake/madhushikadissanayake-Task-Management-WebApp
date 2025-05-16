import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const ViewTask = () => {
  const { id } = useParams()
  const [task, setTask] = useState(null)

  useEffect(() => {
    axios.get(`http://localhost:5000/api/tasks/${id}`, { withCredentials: true })
      .then(res => setTask(res.data))
      .catch(err => console.error(err))
  }, [id])

  if (!task) return <div className="p-6 text-center">Loading...</div>

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Task Details</h2>
      <div className="space-y-3">
        <div><strong>Title:</strong> {task.title}</div>
        <div><strong>Description:</strong> {task.description}</div>
        <div><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</div>
        <div><strong>Assigned To:</strong> {task.assignedTo}</div>
        <div><strong>Status:</strong> {task.status}</div>
        <div><strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}</div>
        <div><strong>Last Updated:</strong> {new Date(task.updatedAt).toLocaleString()}</div>
      </div>

      <Link to="/tasks" className="inline-block mt-6 text-blue-600 underline">← Back to Task List</Link>
    </div>
  )
}

export default ViewTask
