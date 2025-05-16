import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('title')
  const [sortOrder, setSortOrder] = useState('asc')

  const fetchTasks = () => {
    axios.get('http://localhost:5000/api/tasks', { withCredentials: true })
      .then(res => setTasks(res.data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, { withCredentials: true })
        fetchTasks()
      } catch (err) {
        console.error('Delete failed:', err)
      }
    }
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Task List Report', 14, 20)

    const filtered = filteredTasks()

    autoTable(doc, {
      head: [['Title', 'Assigned To', 'Deadline', 'Status']],
      body: filtered.map(task => [
        task.title,
        task.assignedTo,
        new Date(task.deadline).toLocaleDateString(),
        task.status
      ]),
      startY: 30
    })

    doc.save('task-report.pdf')
  }

  const toggleSort = field => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const filteredTasks = () => {
    let filtered = tasks.filter(task =>
      (statusFilter === 'All' || task.status === statusFilter) &&
      (
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )

    filtered.sort((a, b) => {
      const aVal = sortBy === 'title' ? a.title.toLowerCase() : new Date(a.deadline)
      const bVal = sortBy === 'title' ? b.title.toLowerCase() : new Date(b.deadline)

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Tasks</h1>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or assignee"
          className="border px-4 py-2 rounded w-72"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          className="border px-4 py-2 rounded"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th
                className="border px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => toggleSort('title')}
              >
                Title {sortBy === 'title' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="border px-4 py-2">Assigned To</th>
              <th
                className="border px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => toggleSort('deadline')}
              >
                Deadline {sortBy === 'deadline' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks().map(task => (
              <tr key={task._id} className="text-center">
                <td className="border px-4 py-2">{task.title}</td>
                <td className="border px-4 py-2">{task.assignedTo}</td>
                <td className="border px-4 py-2">{new Date(task.deadline).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{task.status}</td>
                <td className="border px-4 py-2 space-x-3">
                  <Link to={`/tasks/view/${task._id}`} className="text-blue-600 hover:underline">View</Link>
                  <span className="text-gray-400">|</span>
                  <Link to={`/tasks/edit/${task._id}`} className="text-yellow-500 hover:underline">Edit</Link>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-500 hover:underline bg-transparent border-none p-0"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredTasks().length === 0 && (
              <tr>
                <td colSpan="5" className="border px-4 py-6 text-center text-gray-500">No matching tasks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 mt-6">
        <Link to="/tasks/add" className="bg-blue-600 text-white px-4 py-2 rounded">Add Task</Link>
        <button
          onClick={handleDownloadPDF}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>
      </div>
    </div>
  )
}

export default TaskList
