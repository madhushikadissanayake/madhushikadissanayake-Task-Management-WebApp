import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api.service';
import { FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [task, setTask] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedTo: '',
    status: 'Pending'
  });
  const [validation, setValidation] = useState({
    title: true,
    deadline: true,
    assignedTo: true
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/tasks/${id}`);
        
        // Format the date for input[type="date"]
        const taskData = response.data;
        const deadlineDate = new Date(taskData.deadline);
        const formattedDeadline = deadlineDate.toISOString().split('T')[0];
        
        setTask({
          ...taskData,
          deadline: formattedDeadline
        });
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Failed to load task. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
    
    // Reset validation error for this field
    if (!validation[name]) {
      setValidation({ ...validation, [name]: true });
    }
  };

  const validateForm = () => {
    const newValidation = {
      title: !!task.title.trim(),
      deadline: !!task.deadline,
      assignedTo: !!task.assignedTo.trim()
    };
    
    setValidation(newValidation);
    return Object.values(newValidation).every(valid => valid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      await api.put(`/tasks/${id}`, task);
      navigate(`/tasks/view/${id}`);
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.response?.data?.message || 'Failed to update task. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to={`/tasks/view/${id}`} className="text-blue-600 hover:underline flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Task Details
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Edit Task</h1>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title*
                </label>
                <input
                  className={`shadow appearance-none border ${!validation.title ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  id="title"
                  type="text"
                  name="title"
                  value={task.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                />
                {!validation.title && (
                  <p className="text-red-500 text-xs italic mt-1">Title is required</p>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="description"
                  name="description"
                  value={task.description}
                  onChange={handleChange}
                  placeholder="Enter task description"
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assignedTo">
                  Assigned To*
                </label>
                <input
                  className={`shadow appearance-none border ${!validation.assignedTo ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  id="assignedTo"
                  type="text"
                  name="assignedTo"
                  value={task.assignedTo}
                  onChange={handleChange}
                  placeholder="Enter assignee name"
                />
                {!validation.assignedTo && (
                  <p className="text-red-500 text-xs italic mt-1">Assignee is required</p>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadline">
                  Deadline*
                </label>
                <input
                  className={`shadow appearance-none border ${!validation.deadline ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  id="deadline"
                  type="date"
                  name="deadline"
                  value={task.deadline}
                  onChange={handleChange}
                />
                {!validation.deadline && (
                  <p className="text-red-500 text-xs italic mt-1">Deadline is required</p>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                  Status
                </label>
                <select
                  className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="status"
                  name="status"
                  value={task.status}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 mt-4 border-t border-gray-200 pt-4">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded flex items-center"
              onClick={() => navigate(`/tasks/view/${id}`)}
              disabled={saving}
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
              disabled={saving}
            >
              <FaSave className="mr-2" /> 
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;