import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const EditTask = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedTo: '',
    status: 'Pending',
  })

  useEffect(() => {
    axios.get(`http://localhost:5000/api/tasks/${id}`, { withCredentials: true })
      .then(res => {
        const data = res.data
        setTask({
          title: data.title,
          description: data.description,
          deadline: data.deadline?.split('T')[0], // format to yyyy-mm-dd
          assignedTo: data.assignedTo,
          status: data.status,
        })
      })
      .catch(err => console.error(err))
  }, [id])

  const handleChange = e => {
    setTask({ ...task, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, task, { withCredentials: true })
      navigate('/tasks')
    } catch (err) {
      console.error('Update failed:', err)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6">Edit Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" value={task.title} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <textarea name="description" value={task.description} onChange={handleChange} className="w-full px-4 py-2 border rounded"></textarea>
        <input type="date" name="deadline" value={task.deadline} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <input type="text" name="assignedTo" value={task.assignedTo} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <select name="status" value={task.status} onChange={handleChange} className="w-full px-4 py-2 border rounded">
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Update Task</button>
      </form>
    </div>
  )
}

export default EditTask
