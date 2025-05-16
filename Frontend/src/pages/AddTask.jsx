import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AddTask = () => {
  const navigate = useNavigate()
  const [task, setTask] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedTo: '',
    status: 'Pending',
  })

  const handleChange = e => {
    setTask({ ...task, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/tasks', task, { withCredentials: true })
      navigate('/tasks')
    } catch (err) {
      console.error('Task creation failed:', err)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6">Add New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Title" required className="w-full px-4 py-2 border rounded" onChange={handleChange} />
        <textarea name="description" placeholder="Description" className="w-full px-4 py-2 border rounded" onChange={handleChange}></textarea>
        <input type="date" name="deadline" className="w-full px-4 py-2 border rounded" onChange={handleChange} />
        <input type="text" name="assignedTo" placeholder="Assigned To" className="w-full px-4 py-2 border rounded" onChange={handleChange} />
        <select name="status" className="w-full px-4 py-2 border rounded" onChange={handleChange}>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Task</button>
      </form>
    </div>
  )
}

export default AddTask
